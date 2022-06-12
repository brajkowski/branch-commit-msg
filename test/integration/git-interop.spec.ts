import { spawnSync } from "child_process";
import {
  activeBranchName,
  ActiveBranchNotFoundError,
  gitCmd,
} from "../../src/git-interop";

describe("git-interop", () => {
  describe("activeBranchName()", () => {
    afterEach(() => {
      spawnSync("rm", ["-rf", ".git"]); // Remove git repo for testing isolation.
    });

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
});
