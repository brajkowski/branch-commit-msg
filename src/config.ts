import { readFileSync } from "fs";

export type Config = {
  extractPattern: string;
  extractPatternMatchCase: boolean;
  commitMsgFormat: string;
};

export const RC_FILE_NAME = ".commitmsgrc.json";

export function getConfig(): Config | undefined {
  let rawConfig: Config;
  try {
    rawConfig = JSON.parse(readFileSync(RC_FILE_NAME).toString());
  } catch (err) {
    return undefined;
  }
  if (
    typeof rawConfig.extractPattern === "string" &&
    typeof rawConfig.extractPatternMatchCase === "boolean" &&
    typeof rawConfig.commitMsgFormat === "string"
  ) {
    return rawConfig;
  }
  return undefined;
}
