import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider, CSSReset } from '@chakra-ui/core';
import i18n from 'lib/i18n';

const favicon = '/dog-emoji.png';
const title = 'CuriousDog';

export default ({ Component, pageProps }) => {
  return (
    <main>
      <Head>
        <title>{title}</title>
        <meta name="description" content={i18n('seo description')} />
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
