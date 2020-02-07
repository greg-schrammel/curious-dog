const withOffline = require("next-offline");

const config = {
  poweredByHeader: false,
  generateInDevMode: true,
  workboxOpts: {
    importScripts: ["/sw.js"],
    swDest: "static/service-worker.js"
  },
  webpack: (config, { isServer, webpack }) => {
    config.output.globalObject = `self`;
    // shouldn't bundle server modules https://arunoda.me/blog/ssr-and-server-only-modules
    if (!isServer)
      config.plugins.push(new webpack.IgnorePlugin(/firebase-admin/));
    return {
      ...config,
      entry: () =>
        config
          .entry()
          .then(entry => ({ ...entry, "static/sw.js": "./firebase/sw.js" }))
    };
  }
};

module.exports = withOffline(config);
