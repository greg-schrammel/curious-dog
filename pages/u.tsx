import * as React from "react";
import { useState, useEffect } from "react";
import { Text, Box, Heading } from "@chakra-ui/core";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import Header from "components/Header";
import ShareYourProfile from "components/ShareYourProfile";
import { UserInfo, AskField, QuestionsList } from "components/UserProfile";

import { onQuestion, fetchUser, fetchQuestions, ask } from "lib/api";

function useUserQuestions(userId, initial) {
  const [questions, setQuestions] = useState(initial);
  useEffect(() => userId && onQuestion(userId, setQuestions));
  return questions;
}

const States = {
  Me: 0,
  UserPage: 1,
  UserNotFound: 2,
};

function UserNotFound() {
  return (
    <Box justify="center" p={8}>
      <Heading textAlign="center">🤔 Esse usuario não existe 🧐</Heading>
    </Box>
  );
}

function Me({ me, questions }) {
  const router = useRouter();
  useEffect(() => {
    router.replace("/me");
  }, []);
  return (
    <>
      <UserInfo user={me} />
      <ShareYourProfile />
      <QuestionsList questions={questions} />
    </>
  );
}

function User({ user, questions }) {
  return (
    <>
      <UserInfo user={user} />
      <AskField onAsk={(question) => ask(question, pageUser.id)} />
      <QuestionsList questions={questions} />
    </>
  );
}

function UserPage({
  state,
  loggedUser,
  pageUser,
  questions: initialQuestions = [],
}) {
  const questions = useUserQuestions(pageUser?.id, initialQuestions);
  return (
    <>
      <Header loggedUser={loggedUser} />
      {state === States.UserNotFound && <UserNotFound />}
      {state === States.Me && <Me me={pageUser} questions={questions} />}
      {state === States.UserPage && (
        <User user={pageUser} questions={questions} />
      )}
    </>
  );
}

// next dinamic routes didn't work idk why see later
export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  // authorization: "Bearer " + tokenId
  const tokenId = req.headers.authorization?.split(" ")[1];
  console.log("token", tokenId);
  const userId = query.userId as string;

  const loggedUser = tokenId
    ? await require("lib/firebase/admin")
        .userIdFromToken(tokenId)
        .then(fetchUser)
    : null;

  if (loggedUser && loggedUser?.id === userId)
    return {
      props: {
        state: States.Me,
        loggedUser,
        pageUser: loggedUser,
        questions: await fetchQuestions(loggedUser.id, { hasAnswer: false }),
      },
    };

  if (userId) {
    const pageUser = await fetchUser(userId);
    if (!pageUser) return { props: { state: States.UserNotFound, loggedUser } };
    const questions = await fetchQuestions(pageUser.id, { limit: 5 });
    return {
      props: { state: States.UserPage, loggedUser, pageUser, questions },
    };
  }

  return { props: { state: States.UserNotFound, loggedUser } };
};

export default UserPage;
