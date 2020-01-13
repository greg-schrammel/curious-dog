import Head from "next/head";
import { ThemeProvider } from "@chakra-ui/core";

export default ({ title, favicon, children }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />>
      <link
        rel="icon"
        href={
          favicon ??
          "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/dog-face_1f436.png"
        }
      ></link>
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap"
        rel="stylesheet"
      ></link>
    </Head>
    <style jsx global>{`
      * {
        margin: 0;
        font-family: "Roboto", sans-serif;
      }
    `}</style>
    <ThemeProvider>{children}</ThemeProvider>
  </>
);
