// const { withExpo } = require("@expo/next-adapter");
const withFonts = require("next-fonts");
const withImages = require("next-images");
const withTM = require("next-transpile-modules")([
  "@expo/vector-icons",
  "react-native-web-hooks",
  "expo-font",
  "@unimodules",
  "react-native-web",
  "expo-blur",
]); // IT CAN'T BE THAT HARD AAAAAAAAAAA need to find a better way to make this work

const nextConfig = {
  enableSvg: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      "react-native$": "react-native-web",
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];
    return config;
  },
  experimental: {
    async headers() {
      return [
        {
          source: "/sw.js",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=43200, immutable",
            },
            {
              key: "Service-Worker-Allowed",
              value: "/",
            },
          ],
        },
      ];
    },
  },
};

module.exports = withTM(withFonts(withImages(nextConfig)));
