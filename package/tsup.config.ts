import { defineConfig, type Options } from "tsup";
import * as sass from "sass";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import * as path from "path";
import * as fs from "fs";
import type { Plugin } from "esbuild";

// Read version from package.json at build time
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const VERSION = pkg.version;

// Vue SFC compiler plugin for esbuild
function vueSfcPlugin(): Plugin {
  return {
    name: "vue-sfc",
    setup(build) {
      build.onResolve({ filter: /\.vue$/ }, (args) => {
        return {
          path: path.resolve(args.resolveDir, args.path),
          namespace: "vue-sfc",
        };
      });

      build.onLoad({ filter: /.*/, namespace: "vue-sfc" }, async (args) => {
        const { parse, compileScript, compileTemplate } = await import(
          "@vue/compiler-sfc"
        );
        const source = fs.readFileSync(args.path, "utf-8");
        const id = args.path;
        const { descriptor, errors } = parse(source, { filename: id });

        if (errors.length > 0) {
          return {
            errors: errors.map((e) => ({
              text: e.message,
              location: { file: args.path },
            })),
          };
        }

        // Compile <script setup> or <script>
        let scriptCode = "";
        let bindings: Record<string, string> | undefined;
        if (descriptor.script || descriptor.scriptSetup) {
          const scriptResult = compileScript(descriptor, {
            id,
            inlineTemplate: false,
          });
          scriptCode = scriptResult.content;
          bindings = scriptResult.bindings;
        }

        // Compile <template>
        let templateCode = "";
        if (descriptor.template) {
          const templateResult = compileTemplate({
            source: descriptor.template.content,
            filename: id,
            id,
            compilerOptions: {
              bindingMetadata: bindings,
            },
          });
          if (templateResult.errors.length > 0) {
            return {
              errors: templateResult.errors
                .filter(
                  (e): e is { message: string } => typeof e !== "string",
                )
                .map((e) => ({
                  text: e.message,
                  location: { file: args.path },
                })),
            };
          }
          templateCode = templateResult.code;
        }

        // Handle <style> blocks - compile and inject at runtime
        let styleCode = "";
        for (let i = 0; i < descriptor.styles.length; i++) {
          const style = descriptor.styles[i];
          let css = style.content;

          // Compile SCSS if needed
          if (style.lang === "scss") {
            const result = sass.compile(args.path);
            css = result.css;
          }

          const styleId = `vue-sfc-${path.basename(args.path, ".vue")}-${i}`;
          styleCode += `
if (typeof document !== 'undefined') {
  let _style = document.getElementById('${styleId}');
  if (!_style) {
    _style = document.createElement('style');
    _style.id = '${styleId}';
    _style.textContent = ${JSON.stringify(css)};
    document.head.appendChild(_style);
  }
}
`;
        }

        // Combine script + template + styles
        // Replace default export to attach render function
        let contents = scriptCode;

        // Remove "export default" and capture the object
        contents = contents.replace(
          /export\s+default\s+/,
          "const _sfc_main = ",
        );

        // Add template render function
        if (templateCode) {
          contents += "\n" + templateCode;
          contents +=
            "\n_sfc_main.render = render;";
        }

        // Add style injection
        contents += "\n" + styleCode;

        // Re-export
        contents += "\nexport default _sfc_main;\n";

        return {
          contents,
          loader: "ts",
          resolveDir: path.dirname(args.path),
        };
      });
    },
  };
}

// Custom SCSS CSS Modules plugin with SSR-safe style injection
function scssModulesPlugin(): Plugin {
  return {
    name: "scss-modules",
    setup(build) {
      // Handle all .scss files
      build.onLoad({ filter: /\.scss$/ }, async (args) => {
        const isModule = args.path.includes(".module.");
        // Use parent directory + filename for unique style IDs
        const parentDir = path.basename(path.dirname(args.path));
        const baseName = path.basename(args.path, isModule ? ".module.scss" : ".scss");
        const styleId = `${parentDir}-${baseName}`;

        // Compile SCSS to CSS
        const result = sass.compile(args.path);
        let css = result.css;

        if (isModule) {
          // Process with postcss-modules to get class name mappings
          let classNames: Record<string, string> = {};
          const postcssResult = await postcss([
            postcssModules({
              getJSON(cssFileName, json) {
                classNames = json;
              },
              generateScopedName: "[name]__[local]___[hash:base64:5]",
            }),
          ]).process(css, { from: args.path });

          css = postcssResult.css;

          // Generate JS that exports class names and injects styles (SSR-safe)
          const contents = `
const css = ${JSON.stringify(css)};
const classNames = ${JSON.stringify(classNames)};

// SSR-safe style injection
if (typeof document !== 'undefined') {
  let style = document.getElementById('feedback-tool-styles-${styleId}');
  if (!style) {
    style = document.createElement('style');
    style.id = 'feedback-tool-styles-${styleId}';
    style.textContent = css;
    document.head.appendChild(style);
  }
}

export default classNames;
`;
          return { contents, loader: "js" };
        } else {
          // Regular SCSS - no CSS modules processing
          const contents = `
const css = ${JSON.stringify(css)};
if (typeof document !== 'undefined') {
  let style = document.getElementById('feedback-tool-styles-${styleId}');
  if (!style) {
    style = document.createElement('style');
    style.id = 'feedback-tool-styles-${styleId}';
    style.textContent = css;
    document.head.appendChild(style);
  }
}
export default {};
`;
          return { contents, loader: "js" };
        }
      });
    },
  };
}

export default defineConfig((options) => [
  // React component
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: !options.watch,
    external: ["react", "react-dom"],
    esbuildPlugins: [scssModulesPlugin()],
    define: {
      __VERSION__: JSON.stringify(VERSION),
    },
    banner: {
      js: '"use client";',
    },
  },
  // Vue component (runtime)
  {
    entry: { vue: "src/vue.ts" },
    format: ["cjs", "esm"],
    dts: false, // DTS generated separately (Rollup can't process .vue files)
    splitting: false,
    sourcemap: true,
    clean: false, // React build already cleaned
    external: ["vue"],
    esbuildPlugins: [scssModulesPlugin(), vueSfcPlugin()],
    define: {
      __VERSION__: JSON.stringify(VERSION),
    },
  },
  // Vue component (type declarations only)
  {
    entry: { vue: "src/vue-dts.ts" },
    dts: { only: true },
    external: ["vue"],
  },
]);
