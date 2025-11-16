const express = require("express");
const router = express.Router();

const ensureAuthenticated = require("../middleware/auth");
const {
  createMember,
  loadMembers,
} = require("../services/memberService");

router.post("/join", (req, res, next) => {
  try {
    const result = createMember(req.body);
    if (req.accepts("json")) {
      return res.status(201).json({
        message: "Member created successfully",
        ...result,
      });
    }
    res.status(201).send(
      `Member created successfully. Code: ${result.memberCode}, Sponsor: ${result.placedUnder}, Position: ${result.position}`
    );
  } catch (err) {
    if (req.accepts("json")) {
      return res.status(err.status || 500).json({ error: err.message });
    }
    res.status(err.status || 500).send(err.message);
  }
});

router.get("/profile", ensureAuthenticated, (req, res) => {
  const members = loadMembers();
  const member = members[req.session.memberCode];
  if (!member) {
    req.session.destroy(() => {});
    const message = "Member not found.";
    if (req.accepts("json")) {
      return res.status(404).json({ error: message });
    }
    return res.status(404).send(message);
  }

  const { memberCode, name, email, mobile, sponsorCode, positionFromSponsor, leftCount, rightCount, createdAt } = member;

  const payload = {
    memberCode,
    name,
    email,
    mobile,
    sponsorCode,
    positionFromSponsor,
    leftCount,
    rightCount,
    createdAt,
  };

  if (req.accepts("json")) {
    return res.json(payload);
  }

  res.send(payload);
});

router.get("/downline", ensureAuthenticated, (req, res) => {
  const members = loadMembers();
  const member = members[req.session.memberCode];
  if (!member) {
    req.session.destroy(() => {});
    const message = "Member not found.";
    if (req.accepts("json")) {
      return res.status(404).json({ error: message });
    }
    return res.status(404).send(message);
  }

  const leftChild = member.leftMemberCode ? members[member.leftMemberCode] : null;
  const rightChild = member.rightMemberCode ? members[member.rightMemberCode] : null;

  const payload = {
    left: leftChild
      ? {
          memberCode: leftChild.memberCode,
          name: leftChild.name,
          leftCount: leftChild.leftCount,
          rightCount: leftChild.rightCount,
        }
      : null,
    right: rightChild
      ? {
          memberCode: rightChild.memberCode,
          name: rightChild.name,
          leftCount: rightChild.leftCount,
          rightCount: rightChild.rightCount,
        }
      : null,
    totals: {
      leftCount: member.leftCount,
      rightCount: member.rightCount,
    },
  };

  if (req.accepts("json")) {
    return res.json(payload);
  }

  res.send(payload);
});

module.exports = router;
