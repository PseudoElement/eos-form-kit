
import { watch } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import json from "@rollup/plugin-json";
import babel from "rollup-plugin-babel";
import fs from "fs-extra";
import eslintPlugin from 'rollup-plugin-eslint'

const plugins = [
    eslintPlugin.eslint(),
    external({
        includeDependencies: true
    }),
    resolve(),
    json(),
    postcss({
        modules: false,
        extract: true,
        exclude: ['example/**', 'dist/**'],
        minimize: true,
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
    sourcemap: true,
    // chunkFileNames: "chunk-[name].js",
    // chunkFileNames: "chunk-[name][hash].js",
    // chunkFileNames: "chunk-[name].js?v=[hash]",
    // chunkFileNames: "chunk-[name][extname]?v=[hash]",
}

const watchOptions = {
    ...inputOptions,
    output: outputOptions,
    // buildDelay: 100,
    // watch: {
    //     skipWrite: true
    // }
};

export async function start() {
    if (fs.existsSync("./dist"))
        fs.removeSync("./dist");

    return new Promise((resolve, reject) => {
        const watcher = watch(watchOptions).on('event', event => {
            switch (event.code) {
                case "START":
                    console.log("Start");
                    break;
                case "BUNDLE_START":
                    console.log("Bundle start");
                    break;
                case "BUNDLE_END":
                    console.log("Bundled in " + event.duration);
                    break;
                case "END":
                    console.log("Completed");
                    console.log("Ready for new changes...");
                    break;
                case "ERROR":
                    console.log("watch ERROR");
                    console.error(event.error);
                    break;
                default:
                    console.log(event.code);
                    break;

            }
        });
    });
}

start();