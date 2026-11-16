// TODO when this project gains `"type": "module"`, switch this file extension back to .js

import path from "path";

import discardComments from "postcss-discard-comments";
// TODO nesting has been W3C "baseline" since 2023. Remove this plugin?
import nested from "postcss-nested";
import importPlugin from "postcss-import";
// TODO can these be replaced with native CSS vars?
import simpleVars from "postcss-simple-vars";
import mixins from "postcss-mixins";
import extendRule from "postcss-extend-rule";
import url from "postcss-url";

export default {
  plugins: [
    discardComments,
    nested,
    importPlugin,
    simpleVars,
    mixins,
    extendRule,
    url({ url: "copy", basePath: path.resolve(import.meta.dirname, "packages/app/src"), assetsPath: "../../" })
  ],
};
