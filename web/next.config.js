const config = {
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

module.exports = config;
