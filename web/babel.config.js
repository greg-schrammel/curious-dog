// module.exports = { presets: ["@expo/next-adapter/babel"] };

module.exports = {
  presets: ["next/babel"],
  plugins: [["react-native-web", { commonjs: true }]],
};
