import { spawnSync } from "child_process";
import { createRcFile } from "../test-util/config";
import {
  checkoutBranch,
  commit,
  createRepo,
  deleteRepo,
  latestCommitMessage,
} from "../test-util/git";

describe("branch-commit-msg", () => {
  beforeAll(() => {
    createRepo();
  });

  afterAll(() => {
    deleteRepo();
  });

  it("should install successfully with npx", () => {
    const result = spawnSync("npx", ["branch-commit-msg", "install"]);
    expect(result.status).toEqual(0);
  });

  it("should update a commit message", () => {
    const branch = "smoke-test";
    const originalMessage = "smoke test commit message";
    const expectedMessage = `branch: ${branch} | message: ${originalMessage}`;
    createRcFile({
      extractPattern: ".*",
      extractPatternMatchCase: false,
      commitMsgFormat: "branch: %b0 | message: %m",
    });
    checkoutBranch(branch);
    commit(originalMessage);
    expect(latestCommitMessage()).toEqual(expectedMessage);
  });
});
