import * as React from "react";
import Head from "next/head";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";

const favicon = "/dog-emoji.png";
const title = "CuriousDog";

export default ({ Component, pageProps }) => {
  return (
    <main>
      <Head>
        <title>{title}</title>
        <link rel="manifest" href="/manifest.json"></link>
        <link rel="icon" href={favicon}></link>
      </Head>
      <ThemeProvider>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </main>
  );
};
