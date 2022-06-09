const esbuild = require("esbuild");
const { devDependencies } = require("./package.json");

esbuild
  .build({
    entryPoints: ["packages/index.ts"],
    outdir: "dist",
    outExtension: {
      ".js": ".mjs",
    },
    target: "es6",
    format: "esm",
    external: Object.keys(devDependencies),
    bundle: true,
    minify: false,
    sourcemap: true,
    sourcesContent: false,
    logLevel: "silent",
  })
  .catch((err) => {
    console.log(err);
  });
