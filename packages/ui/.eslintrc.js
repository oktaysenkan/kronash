const path = require("path");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.resolve(__dirname, "./tsconfig.lint.json"),
  },
  rules: {
    "no-redeclare": "off",
  },
};
