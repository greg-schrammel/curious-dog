const path = require("path");

module.exports = {
  mode: "production",
  entry: "./sw.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "sw.js",
  },
  module: {
    rules: [
      {
        test: /sw\.js?$/,
        loader: "babel-loader",
      },
    ],
  },
  target: "webworker",
  stats: "errors-only",
};
