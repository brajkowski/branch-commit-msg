import { activeBranchName, GitError } from "../../src/git-interop";
import {
  checkoutBranch,
  commit,
  createRepo,
  deleteRepo,
} from "./test-util/git";

describe("git-interop", () => {
  afterEach(() => {
    deleteRepo();
  });

  describe("activeBranchName()", () => {
    it("should throw an error when there is no git repo", () => {
      expect(() => activeBranchName()).toThrow(GitError);
    });

    it("should return the active branch name on repos that don't have any commits", () => {
      const expectedBranchName = "main";
      createRepo();
      checkoutBranch(expectedBranchName);
      expect(activeBranchName()).toEqual(expectedBranchName);
    });

    it("should return the active branch name when there is an active branch", () => {
      const expectedBranchName = "some/random123/branch-name";
      createRepo();
      checkoutBranch(expectedBranchName);
      commit("empty-commit");
      expect(activeBranchName()).toEqual(expectedBranchName);
    });
  });
});
