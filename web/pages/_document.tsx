import * as React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import { AppRegistry } from "react-native-web";

// Force Next-generated DOM elements to fill their parent's height
const normalizeNextElements = `
  #__next {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

const name = "curious-dog";

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    AppRegistry.registerComponent(name, () => Main);
    const { getStyleElement } = AppRegistry.getApplication(name);
    const page = renderPage();
    const styles = [
      // eslint-disable-next-line react/no-danger
      <style dangerouslySetInnerHTML={{ __html: normalizeNextElements }} />,
      getStyleElement(),
    ];
    return { ...page, styles: React.Children.toArray(styles) };
  }

  render() {
    return (
      <html lang="pt-br" style={{ height: "100%" }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <body style={{ height: "100%", overflow: "hidden" }}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
