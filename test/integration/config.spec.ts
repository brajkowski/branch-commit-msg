import { spawnSync } from "child_process";
import { writeFileSync } from "fs";
import { Config, getConfig, rcFile } from "../../src/config";

describe("config", () => {
  describe("getConfig()", () => {
    beforeEach(() => {
      spawnSync("rm", ["-rf", rcFile]);
    });

    it("should return undefined when there is no rc file", () => {
      expect(getConfig()).toBeUndefined();
    });

    it("should return undefined if the rc file is malformed", () => {
      writeFileSync(rcFile, "{");
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
        writeFileSync(rcFile, JSON.stringify(partialConfig));
        expect(getConfig()).toBeUndefined();
      }
    );

    it("should return the config if the rc file is well-formed", () => {
      const expectedConfig: Config = {
        extractPattern: ".*",
        extractPatternMatchCase: false,
        commitMsgFormat: "%b %m",
      };
      writeFileSync(rcFile, JSON.stringify(expectedConfig));
      expect(getConfig()).toStrictEqual(expectedConfig);
    });
  });
});
