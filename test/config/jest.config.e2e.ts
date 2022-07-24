import type { Config } from "@jest/types";
import sharedConfig from "./jest.config.shared";

const config: Config.InitialOptions = {
  ...sharedConfig,
  coverageDirectory: "coverage/e2e",
};

export default config;
