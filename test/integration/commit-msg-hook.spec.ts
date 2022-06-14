import { Config } from "../../src/config";
import { latestCommitMessage } from "../../src/git-interop";
import {
  checkoutBranch,
  commit,
  createGitRepo,
  createRcFile,
  deleteGitRepo,
  deleteRcFile,
  installHook,
} from "./util";

describe("commit-msg-hook", () => {
  beforeEach(() => {
    createGitRepo();
    installHook();
  });

  afterEach(() => {
    deleteGitRepo();
    deleteRcFile();
  });

  it("should not change the commit message if there is no rc file", () => {
    const expectedMessage = "the original commit message";
    commit(expectedMessage);
    expect(latestCommitMessage()).toEqual(expectedMessage);
  });

  it("should not change the commit message if the rc file is malformed", () => {
    const expectedMessage = "the original commit message";
    createRcFile({ extractPattern: "" } as Config);
    commit(expectedMessage);
    expect(latestCommitMessage()).toEqual(expectedMessage);
  });

  const configCases = [
    {
      branch: "branch",
      originalMessage: "message",
      expectedMessage: "message",
      config: {
        extractPattern: "no-match",
        extractPatternMatchCase: true,
        commitMsgFormat: "%b0: %m",
      },
    },
    {
      branch: "branch",
      originalMessage: "message",
      expectedMessage: "branch: MESSAGE",
      config: {
        extractPattern: ".*",
        extractPatternMatchCase: true,
        commitMsgFormat: "%b0: %m | upper",
      },
    },
    {
      branch: "some/complex-123-5/branch",
      originalMessage: "ADDED A FEATURE",
      expectedMessage: "added a feature (ref: complex-123-5)",
      config: {
        extractPattern: "complex[0-9-]+",
        extractPatternMatchCase: true,
        commitMsgFormat: "%m | lower (ref: %b0)",
      },
    },
    {
      branch: "some/CoMpLEX-123-5/branch",
      originalMessage: "added a feature",
      expectedMessage: "added a feature (ref: CoMpLEX-123-5)",
      config: {
        extractPattern: "complex[0-9-]+",
        extractPatternMatchCase: false,
        commitMsgFormat: "%m (ref: %b0)",
      },
    },
    {
      branch: "some/CoMpLEX-123-5/branch",
      originalMessage: "added a feature",
      expectedMessage: "added a feature",
      config: {
        extractPattern: "complex[0-9-]+",
        extractPatternMatchCase: true,
        commitMsgFormat: "%m (ref: %b0)",
      },
    },
    {
      branch: "some/CoMpLEX-123-5/branch",
      originalMessage: "added a feature",
      expectedMessage: "ADDED A FEATURE (ref: complex-123-5)",
      config: {
        extractPattern: "complex[0-9-]+",
        extractPatternMatchCase: false,
        commitMsgFormat: "%m | upper (ref: %b0 | lower)",
      },
    },
    {
      branch: "some/CoMpLEX-123-5/BRANCH",
      originalMessage: "added a feature",
      expectedMessage: "SOME CoMpLEX-123-5 branch",
      config: {
        extractPattern: "(some).*(complex[0-9-]+).*(branch)",
        extractPatternMatchCase: false,
        commitMsgFormat: "%b1 | upper %b2 %b3 | lower",
      },
    },
  ];
  test.each(configCases)(
    "should update the commit message per the rc file",
    ({ branch, originalMessage, config, expectedMessage }) => {
      createRcFile(config);
      checkoutBranch(branch);
      commit(originalMessage);
      expect(latestCommitMessage()).toEqual(expectedMessage);
    }
  );
});
