#!/usr/bin/env node
const { buildSync } = require("esbuild");
const { join } = require("path");
const fs = require("fs");

const { dependencies, peerDependencies, version } = require("../package.json");

// replace all comments (//... and /*...*/)
function readJson(path) {
    let data = fs.readFileSync(path, { encoding: "utf-8" });
    data = data.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => (g ? "" : m));
    console.log(typeof data);
    console.log(data);
    const json = JSON.parse(data);
    return json;
}

const tsConfig = readJson(__dirname + "/../tsconfig.json");
if (!tsConfig?.compilerOptions?.target) {
    throw new Error("build target not defined");
}
const opts = {
    entryPoints: ["src/index.ts"],
    absWorkingDir: join(__dirname, ".."),
    target: tsConfig.compilerOptions.target,
    bundle: true,
    sourcemap: true,
};

const external = Object.keys({ ...dependencies, ...peerDependencies });

try {
    // esm
    buildSync({
        ...opts,
        platform: "neutral",
        outfile: "dist/esm/browser-crypto-secure-store.js",
        external,
    });
    // generate package.json for esm
    const distPackageJson = { type: "module" , version };
    fs.writeFileSync("dist/esm/package.json", JSON.stringify(distPackageJson, null, 2) + "\n");

    // node
    buildSync({
        ...opts,
        platform: "node",
        outfile: "dist/umd/browser-crypto-secure-store.js",
        external,
    });

    // browser (self contained)
    buildSync({
        ...opts,
        platform: "browser",
        outfile: "dist/browser/browser-crypto-secure-store.js",
        globalName: "securestore",
    });
    // browser-min (self contained)
    buildSync({
        ...opts,
        platform: "browser",
        outfile: "dist/browser/browser-crypto-secure-store.min.js",
        globalName: "securestore",
        minify: true,
    });
} catch (err) {
    // esbuild handles error reporting
    process.exitCode = 1;
}
