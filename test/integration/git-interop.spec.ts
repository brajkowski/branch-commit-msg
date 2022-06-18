import { spawnSync } from "child_process";
import { activeBranchName, gitCmd, GitError } from "../../src/git-interop";

describe("git-interop", () => {
  afterEach(() => {
    spawnSync("rm", ["-rf", ".git"]); // Remove git repo for testing isolation.
  });

  describe("activeBranchName()", () => {
    it("should throw an error when there is no git repo", () => {
      expect(() => activeBranchName()).toThrow(GitError);
    });

    it("should return the active branch name on repos that don't have any commits", () => {
      const expectedBranchName = "main";
      gitCmd(["init", "--quiet"]);
      gitCmd(["checkout", "-b", expectedBranchName]);
      expect(activeBranchName()).toEqual(expectedBranchName);
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
});
