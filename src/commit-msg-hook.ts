#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { exit } from "process";
import { getConfig } from "./config";
import { activeBranchName, GitError } from "./git-interop";
const commitMsgFile = process.argv[process.argv.length - 1];
const currentMsg = readFileSync(commitMsgFile).toString().trimEnd();
const config = getConfig();
if (config === undefined) {
  exit();
}
try {
  const branch = activeBranchName();
  const branchDetail = branch.match(
    new RegExp(
      config.extractPattern,
      config.extractPatternMatchCase ? undefined : "i"
    )
  );
  if (!branchDetail) {
    exit();
  }
  let newMessage = config.commitMsgFormat;
  branchDetail.forEach((b, index) => {
    newMessage = newMessage
      .replace(`%b${index} | upper`, b.toUpperCase())
      .replace(`%b${index} | lower`, b.toLowerCase())
      .replace(`%b${index}`, b);
  });
  newMessage = newMessage
    .replace("%m | upper", currentMsg.toUpperCase())
    .replace("%m | lower", currentMsg.toUpperCase())
    .replace("%m", currentMsg);
  writeFileSync(commitMsgFile, newMessage);
} catch (error) {
  if (!(error instanceof GitError)) {
    throw error;
  }
}
