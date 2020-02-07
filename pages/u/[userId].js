import React, { useState, useEffect } from 'react';
import { Flex, Box, Heading } from '@chakra-ui/core';

import Header from 'components/Header';
import Question from 'components/Question';
import ShareYourProfile from 'components/ShareYourProfile';
import UserInfo from 'components/UserInfo';

import { onQuestion, fetchUser, fetchQuestions } from 'lib/api';

function useUserQuestions(userId, initial) {
  const [questions, setQuestions] = useState(initial);
  useEffect(() => userId && onQuestion(userId, setQuestions));
  return questions;
}

function UserPage({ loggedUser, pageUser, questions: seoQuestions = [] }) {
  const questions = useUserQuestions(pageUser?.id, seoQuestions);
  return (
    <>
      <Header loggedUser={loggedUser} />
      <Box padding="1.5rem">
        {!!pageUser ? <UserProfile onAsk={} /> : null /* usuario nao existe crie sua conta */}
      </Box>
    </>
  );
}

UserPage.getInitialProps = async ({ req, asPath }) => {
  if (!req) return;

  const tokenId = req.headers['authorization']?.split(' ')[1];
  const pageUserId = asPath.split('/')[2];

  console.log('token', tokenId);

  const loggedUser = await require('firebase/admin')
    .userIdFromToken(tokenId)
    .then(fetchUser);

  const pageUser = loggedUser?.uid === pageUserId ? loggedUser : await fetchUser(pageUserId);
  const questions = await fetchQuestions(pageUserId, true);

  console.log({ loggedUser, pageUser, questions });

  return { loggedUser, pageUser, questions };
};

export default UserProfile;
