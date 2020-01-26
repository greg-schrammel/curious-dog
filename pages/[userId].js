import React from "react";
import {
  Flex,
  Text,
  Image,
  Box,
  Textarea,
  Button,
  Heading
} from "@chakra-ui/core";

import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import Header from "components/Header";
import Question from "components/Question";
import withApollo from "lib/withApollo";

const myPic =
  "https://pbs.twimg.com/profile_images/1212179476307726343/5-soKW6T_400x400.jpg";

// fnADi4OpTrACFEAnfpicAssQzi2VvX_4mmLzP-0S

function UserProfile({ userId }) {
  const profile_pic = myPic;
  const displayName = userId ?? "greg";
  const userName = "@O_Super_Gregory";

  return (
    <>
      <Flex flexWrap="wrap" spacing="1rem" padding="1rem">
        <Box padding="1rem" width="md">
          <Flex align="center" justify="space-between" marginBottom="2rem">
            <Flex direction="column">
              <Text as="span" fontSize="xl" fontWeight="bold" isTruncated>
                {displayName}
              </Text>
              <Text color="gray.600">{userName}</Text>
            </Flex>
            <Image
              height="3rem"
              width="3rem"
              rounded="full"
              border="4px solid peachpuff"
              src={profile_pic}
            />
          </Flex>
          <Flex
            justifyContent="space-between"
            align="center"
            direction="row"
            marginBottom="0.5rem"
          >
            <Text fontWeight="bold" isTruncated>
              Faça uma pergunta anônima
            </Text>
            <Button
              rounded="full"
              fontWeight="bold"
              color="white"
              bg="black"
              height="2rem"
              onClick={() => {}}
            >
              Enviar
            </Button>
          </Flex>
          <Textarea
            border="none"
            resize="none"
            focusBorderColor="none"
            backgroundColor="gray.100"
            placeholder="não vem xinga o cara o crl"
          />
        </Box>
        <Heading as="h4">Ultimas respondidas</Heading>
        <Question />
        <Question />
        <Question />
        <Question />
        <Question />
      </Flex>
      <Box position="absulute" bottom="2rem" margin="0 auto">
        <Text>Crie sua conta</Text>
      </Box>
    </>
  );
}
export default withApollo(UserProfile);
