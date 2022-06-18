#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { exit } from "process";
import { getConfig } from "./config";
import { activeBranchName, GitError } from "./git-interop";

let branchName: string;
const commitMsgFilePath = process.argv[process.argv.length - 1];
const currentCommitMsg = readFileSync(commitMsgFilePath).toString().trimEnd();
const hookConfig = getConfig();

if (hookConfig === undefined) {
  exit();
}

try {
  branchName = activeBranchName();
} catch (error) {
  if (!(error instanceof GitError)) {
    throw error;
  }
}

const branchMatches = branchName!.match(
  new RegExp(
    hookConfig.extractPattern,
    hookConfig.extractPatternMatchCase ? undefined : "i"
  )
);

if (!branchMatches) {
  exit();
}

let newCommitMsg = hookConfig.commitMsgFormat;
branchMatches.forEach((b, index) => {
  newCommitMsg = newCommitMsg
    .replace(`%b${index} | upper`, b.toUpperCase())
    .replace(`%b${index} | lower`, b.toLowerCase())
    .replace(`%b${index}`, b);
});
newCommitMsg = newCommitMsg
  .replace("%m | upper", currentCommitMsg.toUpperCase())
  .replace("%m | lower", currentCommitMsg.toLowerCase())
  .replace("%m", currentCommitMsg);

writeFileSync(commitMsgFilePath, newCommitMsg);
