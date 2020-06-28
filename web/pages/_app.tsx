import * as React from "react";
import Head from "next/head";

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
      <style jsx global>
        {`
          @import "tailwindcss/base";
          @import "tailwindcss/components";
          @import "tailwindcss/utilities";

          html {
            font-family: "Inter", sans-serif;
          }

          button:focus {
            outline: 0; /* WORK ON ACESSIBILITY LATER */
          }
        `}
      </style>
    </main>
  );
};
