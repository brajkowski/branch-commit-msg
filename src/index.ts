#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { installAsGitHook } from "./install";

yargs(hideBin(process.argv))
  .scriptName("commit-msg")
  .command("install", "Install as a git commit-msg hook", installAsGitHook)
  .demandCommand()
  .showHelpOnFail(true)
  .strictCommands()
  .version(false)
  .parse();
