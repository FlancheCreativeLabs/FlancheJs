/**
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 */

var config = module.exports;

config["FlancheJs tests"] = {
  env: "browser",        // or "node"
  rootPath: "../",
  sources: [
    "dist/FlancheJs.debug.js"    // Paths are relative to config file
  ],
  tests: [
    "test/test-*.js"
  ]
};