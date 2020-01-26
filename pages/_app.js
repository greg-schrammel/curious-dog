import React from "react";
import Head from "next/head";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";

const dogEmoji =
  "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/dog-face_1f436.png";

const favicon = dogEmoji;
const title = "CuriousDog";

export default ({ Component, pageProps }) => {
  return (
    <main>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href={favicon}></link>
      </Head>
      <ThemeProvider>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </main>
  );
};
