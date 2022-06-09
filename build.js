const esbuild = require("esbuild");
const { devDependencies } = require("./package.json");
const lessLoader = require('esbuild-plugin-less');

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
    plugins: [lessLoader.lessLoader()],
  })
  .catch((err) => {
    console.log(err);
  });
