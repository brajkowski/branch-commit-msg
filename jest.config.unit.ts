import type { Config } from "@jest/types";
import sharedConfig from "./jest.config.shared";

const config: Config.InitialOptions = {
  ...sharedConfig,
  coverageDirectory: "coverage/unit",
};

export default config;
