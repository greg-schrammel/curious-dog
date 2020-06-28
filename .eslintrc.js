module.exports = {
  extends: ["airbnb-typescript-prettier"],
  rules: {
    "no-restricted-globals": "off",
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
