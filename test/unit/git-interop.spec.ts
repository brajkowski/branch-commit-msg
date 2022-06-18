import { SpawnSyncReturns } from "child_process";
import {
  activeBranchName,
  GitError,
  ResultExtractionError,
} from "../../src/git-interop";

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

  describe("ResultExtractionError", () => {
    it("should be an instance of a Error", () => {
      expect(new ResultExtractionError() instanceof Error).toBe(true);
    });
  });

  describe("activeBranchName()", () => {
    it("should throw an error if the git command does not succeed", () => {
      expect(() =>
        activeBranchName(() => createMockSpawnSyncReturns(1))
      ).toThrow(GitError);
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
        ).toThrow(ResultExtractionError);
      }
    );
  });
});
