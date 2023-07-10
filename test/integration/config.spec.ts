import { Config, getConfig } from "../../src/config";
import {
  createRcFile,
  createRcFileRaw,
  deleteRcFile,
} from "../test-util/config";

describe("config", () => {
  describe("getConfig()", () => {
    beforeEach(() => {
      deleteRcFile();
    });

    it("should return undefined when there is no rc file", () => {
      expect(getConfig()).toBeUndefined();
    });

    it("should return undefined if the rc file is malformed", () => {
      createRcFileRaw("{");
      expect(getConfig()).toBeUndefined();
    });

    const missingPropCases: Partial<Config>[] = [
      {},
      { extractPattern: ".*" },
      { extractPatternMatchCase: true },
      { commitMsgFormat: "%b %m" },
      { extractPattern: ".*", extractPatternMatchCase: true },
      { extractPattern: ".*", commitMsgFormat: "%b %m" },
      { extractPatternMatchCase: true, commitMsgFormat: "%b %m" },
    ];
    test.each(missingPropCases)(
      "should return undefined if the rc file is missing properties",
      () => {
        const partialConfig: Partial<Config> = {
          extractPattern: ".*",
        };
        createRcFileRaw(JSON.stringify(partialConfig));
        expect(getConfig()).toBeUndefined();
      },
    );

    it("should return the config if the rc file is well-formed", () => {
      const expectedConfig: Config = {
        extractPattern: ".*",
        extractPatternMatchCase: false,
        commitMsgFormat: "%b %m",
      };
      createRcFile(expectedConfig);
      expect(getConfig()).toStrictEqual(expectedConfig);
    });
  });
});
