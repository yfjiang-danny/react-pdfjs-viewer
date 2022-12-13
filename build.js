import esbuild from 'esbuild';
import svg from 'esbuild-plugin-svg';
import {lessLoader} from 'esbuild-plugin-less';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

const devDependencies = packageJson.devDependencies;

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
    plugins: [lessLoader(),svg()],
    loader: {
      ".gif": "file"
    }
  })
  .catch((err) => {
    console.log(err);
  });
