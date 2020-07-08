import * as React from "react";
import Head from "next/head";

const { URL } = process.env;

export default ({
  title,
  description,
  username,
  image = "",
  path,
  keywords = "",
}) => (
  <Head>
    <meta name="twitter:site" content="@O_Super_Gregory" />
    <meta name="twitter:creator" content={username} />
    {/* <meta
      name="twitter:card"
      content={image ? "summary_large_image" : "summary"}
    /> */}
    {image && <meta property="og:image" content={image} />}
    {title && <meta name="og:title" content={title} />}
    {path && <meta name="og:url" content={`${URL}${path}`} />}
    {description && <meta name="description" content={description} />}
    {description && <meta name="og:description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}
  </Head>
);
