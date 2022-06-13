import { spawnSync } from "child_process";
import {
  activeBranchName,
  ActiveBranchNotFoundError,
  CommitMessageNotFoundError,
  gitCmd,
  latestCommitMessage,
} from "../../src/git-interop";

describe("git-interop", () => {
  afterEach(() => {
    spawnSync("rm", ["-rf", ".git"]); // Remove git repo for testing isolation.
  });

  describe("activeBranchName()", () => {
    it("should throw an error when there is no git repo", () => {
      expect(() => activeBranchName()).toThrow(ActiveBranchNotFoundError);
    });

    it("should throw an error when there is no active branch", () => {
      gitCmd(["init", "--quiet"]);
      expect(() => activeBranchName()).toThrow(ActiveBranchNotFoundError);
    });

    it("should return the active branch name when there is an active branch", () => {
      const expectedBranchName = "some/random123/branch-name";
      gitCmd(["init", "--quiet"]);
      gitCmd(["config", "user.email", "test@test.com"]);
      gitCmd(["config", "user.name", "test"]);
      gitCmd(["checkout", "-b", expectedBranchName]);
      gitCmd(["commit", "--allow-empty", "-m", "empty-commit"]);
      expect(activeBranchName()).toEqual(expectedBranchName);
    });
  });

  describe("latestCommitMessage()", () => {
    it("should throw an error when there is no git repo", () => {
      expect(() => latestCommitMessage()).toThrow(CommitMessageNotFoundError);
    });

    it("should throw an error when there are no commits to the repo", () => {
      gitCmd(["init", "--quiet"]);
      expect(() => latestCommitMessage()).toThrow(CommitMessageNotFoundError);
    });

    it("should return the latest commit message when there are commits to the repo", () => {
      const expectedCommitMessage = "some commit message";
      gitCmd(["init", "--quiet"]);
      gitCmd(["config", "user.email", "test@test.com"]);
      gitCmd(["config", "user.name", "test"]);
      gitCmd(["commit", "--allow-empty", "-m", "first commit"]);
      gitCmd(["commit", "--allow-empty", "-m", expectedCommitMessage]);
      expect(latestCommitMessage()).toEqual(expectedCommitMessage);
    });
  });
});
