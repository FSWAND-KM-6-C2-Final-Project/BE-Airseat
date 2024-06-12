import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  {
    ignores: ["public/*"],
  },
  { languageOptions: { globals: globals.browser } },
];
