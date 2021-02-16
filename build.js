import { rollup } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import json from "@rollup/plugin-json";
import babel from "rollup-plugin-babel";
import fs from "fs-extra";

const plugins = [
    external({
        includeDependencies: true
    }),
    resolve(),
    json(),
    postcss({
        modules: false,
        extract: true,
        exclude: ['example/**', 'dist/**'],
        minimize: false,
        sourceMap: true
    }),
    babel(),
    url(),
    typescript({
        rollupCommonJSResolveHack: true,
        clean: true,
        exclude: ['node_modules/**', 'example/**', 'dist/**']
    }),
    commonjs({
        include: 'node_modules/**'
    }),
];

const inputOptions = {
    input: "./src/index.tsx",
    plugins: plugins
};

const outputOptions = {
    dir: "dist/",
    format: 'cjs',
    sourcemap: true
};

export default async function build() {
    if (fs.existsSync("./dist"))
        fs.removeSync("./dist");
    console.log("Bundle start")
    let bundle = await rollup(inputOptions);
    console.log("Bundled")
    await bundle.generate(outputOptions);
    console.log("Generated")
    await bundle.write(outputOptions);
    console.log("Wrote");
    await bundle.close();
    console.log("Completed");
}

build();