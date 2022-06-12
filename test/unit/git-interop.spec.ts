import { SpawnSyncReturns } from "child_process";
import {
  activeBranchName,
  ActiveBranchNameExtractionError,
  ActiveBranchNotFoundError,
  GitError,
} from "../../src/git-interop";

describe("git-interop", () => {
  describe("GitError", () => {
    it("should be an instance of an error", () => {
      expect(new GitError(null) instanceof Error).toBe(true);
    });

    const statusCases = [0, 1, null];
    test.each(statusCases)(
      "should return a message with the status of %p",
      (status) => {
        const error = new GitError(status);
        expect(error.message).toMatch(new RegExp(`${status}`));
      }
    );
    test.each(statusCases)("should return the status of %p", (status) => {
      const error = new GitError(status);
      expect(error.status).toEqual(status);
    });
  });

  describe("ActiveBranchNotFoundError", () => {
    it("should be an instance of a GitError", () => {
      expect(new ActiveBranchNotFoundError(null) instanceof GitError).toBe(
        true
      );
    });
  });

  describe("ActiveBranchNameExtractionError", () => {
    it("should be an instance of an Error", () => {
      expect(new ActiveBranchNameExtractionError() instanceof Error).toBe(true);
    });
  });

  describe("activeBranchName()", () => {
    function createMockSpawnSyncReturns(
      status: number,
      output: (string | null)[] = []
    ): SpawnSyncReturns<string> {
      return {
        status,
        output,
        pid: 0,
        stdout: "",
        stderr: "",
        signal: null,
      };
    }

    it("should throw an error if the git command does not succeed", () => {
      expect(() =>
        activeBranchName(() => createMockSpawnSyncReturns(1))
      ).toThrow(ActiveBranchNotFoundError);
    });

    it("should return the branch name when the git command succeeds with expected output format", () => {
      const expectedBranchName = "my-branch";
      expect(
        activeBranchName(() =>
          createMockSpawnSyncReturns(0, [null, `${expectedBranchName}\n`, null])
        )
      ).toEqual(expectedBranchName);
    });

    const unexpectedOutputCases = [[[]], [[null, null]]];
    test.each(unexpectedOutputCases)(
      "should throw an error if the git command succeeds with an unexpected output format of %p",
      (output) => {
        expect(() =>
          activeBranchName(() => createMockSpawnSyncReturns(0, output))
        ).toThrow(ActiveBranchNameExtractionError);
      }
    );
  });
});
