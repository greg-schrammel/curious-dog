import React from "react";
import Page from "layouts/main";
import Header from "components/Header";
import Question from "components/Question";

const Home = () => (
  <Page title="Home">
    <Header />
    <Question />
  </Page>
);

export default Home;
