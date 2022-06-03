const esbuild = require("esbuild");
const dependencies = require("./package.json")

esbuild.build({
    entryPoints: ["packages/index.ts"],
    outdir: "dist",
    outExtension: {
        ".js": ".mjs"
    },
    target: "es6",
    format: "esm",
    external: Object.keys(dependencies),
    bundle: true,
    minify: true,
    sourcemap: false,
    sourcesContent: false,
    logLevel: "silent",
}).catch(err => {
    console.log(err);
})