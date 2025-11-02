const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const membersFile = path.join(dataDir, "members.json");
const metaFile = path.join(dataDir, "meta.json");

function readJson(filePath, fallbackValue) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw || "{}");
  } catch (err) {
    if (err.code === "ENOENT") {
      return fallbackValue;
    }
    throw err;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function loadMembers() {
  return readJson(membersFile, {});
}

function saveMembers(members) {
  writeJson(membersFile, members);
}

function loadMeta() {
  return readJson(metaFile, { nextMemberNumber: 1 });
}

function saveMeta(meta) {
  writeJson(metaFile, meta);
}

function generateMemberCode(meta) {
  const sequence = meta.nextMemberNumber || 1;
  const code = `M${String(sequence).padStart(5, "0")}`;
  meta.nextMemberNumber = sequence + 1;
  return code;
}

function findPlacement(members, sponsorCode, preferredPosition) {
  const sponsor = members[sponsorCode];
  if (!sponsor) {
    const error = new Error("Invalid Sponsor Code.");
    error.status = 400;
    throw error;
  }

  const direction = preferredPosition === "RIGHT" ? "right" : "left";
  const memberKey = direction === "right" ? "rightMemberCode" : "leftMemberCode";

  let current = sponsor;
  while (current[memberKey]) {
    const nextCode = current[memberKey];
    const nextMember = members[nextCode];
    if (!nextMember) {
      const error = new Error("Tree data is inconsistent. Please contact support.");
      error.status = 500;
      throw error;
    }
    current = nextMember;
  }

  return {
    parentCode: current.memberCode,
    position: direction === "right" ? "RIGHT" : "LEFT",
  };
}

function updateCounts(members, startCode, branchPosition) {
  let currentCode = startCode;
  let branch = branchPosition;
  const timestamp = new Date().toISOString();

  while (currentCode) {
    const member = members[currentCode];
    if (!member) {
      break;
    }

    if (branch === "LEFT") {
      member.leftCount = (member.leftCount || 0) + 1;
    } else {
      member.rightCount = (member.rightCount || 0) + 1;
    }
    member.updatedAt = timestamp;

    branch = member.positionFromSponsor ? member.positionFromSponsor.toUpperCase() : null;
    currentCode = member.sponsorCode;
  }
}

function createMember({ name, email, mobile, sponsorCode, position }) {
  if (!name || !email || !mobile || !sponsorCode || !position) {
    const error = new Error("All fields are required.");
    error.status = 400;
    throw error;
  }

  const sanitizedSponsor = sponsorCode.trim().toUpperCase();
  const preferredPosition = position.trim().toUpperCase() === "RIGHT" ? "RIGHT" : "LEFT";

  const members = loadMembers();
  const meta = loadMeta();

  if (!members[sanitizedSponsor]) {
    const error = new Error("Invalid Sponsor Code.");
    error.status = 400;
    throw error;
  }

  const { parentCode, position: finalPosition } = findPlacement(
    members,
    sanitizedSponsor,
    preferredPosition
  );

  const now = new Date().toISOString();
  const memberCode = generateMemberCode(meta);

  const newMember = {
    memberCode,
    name: name.trim(),
    email: email.trim(),
    mobile: mobile.trim(),
    sponsorCode: parentCode,
    positionFromSponsor: finalPosition,
    leftMemberCode: null,
    rightMemberCode: null,
    leftCount: 0,
    rightCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const parentMember = members[parentCode];
  if (!parentMember) {
    const error = new Error("Unable to locate placement parent.");
    error.status = 500;
    throw error;
  }

  if (finalPosition === "LEFT") {
    parentMember.leftMemberCode = memberCode;
  } else {
    parentMember.rightMemberCode = memberCode;
  }
  parentMember.updatedAt = now;

  members[memberCode] = newMember;

  updateCounts(members, parentCode, finalPosition);

  saveMembers(members);
  saveMeta(meta);

  return {
    memberCode,
    placedUnder: parentCode,
    position: finalPosition,
  };
}

module.exports = {
  loadMembers,
  saveMembers,
  loadMeta,
  saveMeta,
  createMember,
};
