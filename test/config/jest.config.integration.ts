import type { Config } from "@jest/types";
import sharedConfig from "./jest.config.shared.ts";

const config: Config.InitialOptions = {
  ...sharedConfig,
  coverageDirectory: "coverage/integration",
};

export default config;
