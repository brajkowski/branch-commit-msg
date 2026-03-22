import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  format: "esm",
  packages: "bundle",
  banner: {
    js: `import{fileURLToPath as __fileURLToPath}from"url";import{dirname as __dirname_fn}from"path";const __dirname=__dirname_fn(__fileURLToPath(import.meta.url));`,
  },
  outfile: "dist/index.mjs",
});
