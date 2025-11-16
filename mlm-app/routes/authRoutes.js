const express = require("express");
const router = express.Router();
const { loadMembers } = require("../services/memberService");

router.post("/login", (req, res) => {
  const { memberCode, mobile } = req.body;

  if (!memberCode || !mobile) {
    const message = "Member Code and Mobile are required.";
    if (req.accepts("json")) {
      return res.status(400).json({ error: message });
    }
    return res.status(400).send(message);
  }

  const members = loadMembers();
  const code = memberCode.trim().toUpperCase();
  const member = members[code];

  if (!member || member.mobile !== mobile.trim()) {
    const message = "Invalid credentials.";
    if (req.accepts("json")) {
      return res.status(401).json({ error: message });
    }
    return res.status(401).send(message);
  }

  req.session.memberCode = member.memberCode;
  req.session.memberName = member.name;

  if (req.accepts("json")) {
    return res.json({ message: "Login successful", memberCode: member.memberCode });
  }

  res.redirect("/dashboard.html");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    if (req.accepts("json")) {
      return res.json({ message: "Logged out" });
    }
    res.redirect("/login.html");
  });
});

module.exports = router;
