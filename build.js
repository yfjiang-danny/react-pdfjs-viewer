import esbuild from "esbuild";
import svg from "esbuild-plugin-svg";
import { lessLoader } from "esbuild-plugin-less";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

const devDependencies = packageJson.devDependencies;

const formats = ["esm", "cjs"];

function build() {
  formats.forEach((v) => {
    esbuild
      .build({
        entryPoints: ["packages/index.ts"],
        outdir: "dist",
        outExtension: {
          ".js": v == "esm" ? ".mjs" : ".cjs",
        },
        target: "es6",
        format: v,
        external: Object.keys(devDependencies),
        bundle: true,
        minify: false,
        sourcemap: true,
        sourcesContent: false,
        logLevel: "silent",
        plugins: [lessLoader(), svg()],
        loader: {
          ".gif": "file",
        },
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

build();
