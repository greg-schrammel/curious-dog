import React from "react";
import { Flex } from "@chakra-ui/core";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import Header from "components/Header";
import Question from "components/Question";
import ShareYourProfile from "components/ShareYourProfile";
import withApollo from "lib/withApollo";

const myPic =
  "https://pbs.twimg.com/profile_images/1212179476307726343/5-soKW6T_400x400.jpg";

// const Home_Query = gql``;

// fnADi4OpTrACFEAnfpicAssQzi2VvX_4mmLzP-0S

function Home() {
  // const { data, loading, error } = useQuery(Home_Query);
  return (
    <>
      <Header notAnsweredCount={0} profilePicSrc={myPic} />
      <Flex flexWrap="wrap" height="100%" padding="0.5rem">
        <ShareYourProfile />
        <Question />
        <Question />
        <Question />
      </Flex>
    </>
  );
}
export default withApollo(Home);
