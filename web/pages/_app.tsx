/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import Head from "next/head";

import "resize-observer-polyfill/dist/ResizeObserver.global";

if (typeof window === "undefined") {
  CSS.supports = () => true; // Expo Blur View error
}

const favicon = "/dog-emoji.png";
const title = "CuriousDog";

export default ({ Component, pageProps }) => {
  return (
    <main>
      <Head>
        <title>{title}</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href={favicon} />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com/"
          crossOrigin="true"
        />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </main>
  );
};
