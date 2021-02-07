
import { rollup, watch } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
// import svgr from '@svgr/rollup';
import json from "@rollup/plugin-json";
import babel from "rollup-plugin-babel";
import fs from "fs-extra";

const inputOptions = {
    input: "./src/index.tsx",
    plugins: [
        json(),
        external(),
        postcss({
            modules: false,
            extract: true,
            minimize: true,
            sourceMap: true
        }),
        url(),
        // svgr(),
        resolve(),
        babel({
            exclude: 'node_modules/**'
        }),
        typescript({
            rollupCommonJSResolveHack: true,
            clean: true,
            exclude: 'node_modules/**'
        }),
        commonjs()
    ]
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

let cache;
export default async function microbundle() {
    console.log("1");
    inputOptions.cache = cache;
    console.log(cache ? "cache 1" : "no cache 1");
    let bundle = await rollup(inputOptions);
    cache = bundle;
    console.log(cache ? "cache 2" : "no cache 2");
    // console.log("2");
    // const { output } = await bundle.generate(outputOptions);
    // console.log("3");

    await bundle.write(outputOptions);
    await bundle.close();
}

export async function microwatch() {
    return new Promise((resolve, reject) => {
        const watcher = watch(watchOptions).on('event', event => {
            switch (event.code) {
                case "START":
                    console.log("watch START");
                    break;
                case "BUNDLE_START":
                    console.log("watch BUNDLE_START");
                    // console.clear();
                    // console.log("Bundling...");
                    // if (fs.existsSync("./tmp"))
                    //     fs.removeSync("./tmp");
                    break;
                case "BUNDLE_END":
                    console.log("Bundling completed in " + event.duration);

                    // if (fs.existsSync("./dist"))
                    //     fs.removeSync("./dist");

                    // if (fs.existsSync("./exampleDist1"))
                    //     fs.removeSync("./exampleDist1");

                    // fs.copySync("./tmp", "./dist", { overwrite: true, recursive: true });

                    // if (fs.existsSync("./exampleDist"))
                    //     fs.renameSync("./exampleDist", "./exampleDist1");

                    // fs.renameSync("./tmp", "./exampleDist");

                    // if (fs.existsSync("./exampleDist1"))
                    //     fs.removeSync("./exampleDist1");

                    // console.log("Folders created");
                    break;
                case "END":
                    console.log("Ready for change...");
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

microwatch();
// microbundle();

// START        — the watcher is (re)starting
  //   BUNDLE_START — building an individual bundle
  //                  * event.input will be the input options object if present
  //                  * event.outputFiles cantains an array of the "file" or
  //                    "dir" option values of the generated outputs
  //   BUNDLE_END   — finished building a bundle
  //                  * event.input will be the input options object if present
  //                  * event.outputFiles cantains an array of the "file" or
  //                    "dir" option values of the generated outputs
  //                  * event.duration is the build duration in milliseconds
  //                  * event.result contains the bundle object that can be
  //                    used to generate additional outputs by calling
  //                    bundle.generate or bundle.write. This is especially
  //                    important when the watch.skipWrite option is used.
  //                  You should call "event.result.close()" once you are done
  //                  generating outputs, or if you do not generate outputs.
  //                  This will allow plugins to clean up resources via the
  //                  "closeBundle" hook.
  //   END          — finished building all bundles
  //   ERROR        — encountered an error while bundling
  //                  * event.error contains the error that was thrown
  //                  * event.result is null for build errors and contains the
  //                    bundle object for output generation errors. As with
  //                    "BUNDLE_END", you should call "event.result.close()" if
  //                    present once you are done.