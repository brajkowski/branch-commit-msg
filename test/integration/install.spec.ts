import { installAsGitHook } from "../../src/install";

describe("install", () => {
  describe("installAsGitHook()", () => {
    it("should throw a helpful error if the install occurs outside of a git repo", () => {
      expect(() => installAsGitHook()).toThrowError(
        "Could not find the root of the repository -- check that git is installed and that this install is running inside of a git repository.",
      );
    });
  });
});
