const withOffline = require("next-offline");

const config = {
  poweredByHeader: false,
  // generateInDevMode: true,
  workboxOpts: {
    importScripts: ["/firebase-sw.js"],
    swDest: "static/service-worker.js",
  },
  webpack: (config, { isServer, webpack }) => {
    config.output.globalObject = `self`;
    // shouldn't bundle server modules
    if (!isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({ resourceRegExp: /firebase-admin/ })
      );
      config.externals = ["child_process"];
    }
    return {
      ...config,
      entry: () =>
        config.entry().then((entry) => ({
          ...entry,
          "static/firebase-sw.js": "./lib/firebase/sw.js",
        })),
    };
  },
  // experimental: {
  //   async rewrites() {
  //     return [{ source: "/u/:id", destination: "/u?user=:id" }];
  //   },
  // },
};

module.exports = withOffline(config);
