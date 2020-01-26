import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaTwitter } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import {
  Image,
  Box,
  Textarea,
  Stack,
  Heading,
  Text,
  Link,
  Progress,
  Flex
} from "@chakra-ui/core";

import { useMachine } from "hooks/useMachine"; // TODO: the npm package is not working, I copied the code from the repo and it works
import useEventListener from "@use-it/event-listener";
import useFocusOnRender from "hooks/useFocusOnRender";

import questionMachine from "components/questionMachine";

import i18n from "utils/i18n";

function randomDogAvatar() {
  return "/cdn/008-corgi.svg";
}

const questionBox = {
  rounded: "lg",
  backgroundColor: "white",
  padding: "1rem",
  overflow: "hidden",
  margin: "0.5rem",
  flexGrow: 1,
  boxShadow: "0px 2px 8px 2px #E2E8F0"
};

const answerArea = {
  border: "none",
  resize: "none",
  focusBorderColor: "none",
  fontSize: "1.1em",
  backgroundColor: "gray.100",
  marginBottom: "1rem"
};

const MotionBox = motion.custom(Box);

function QuestionHeader({ question, from: { avatar, name, link }, onRemove }) {
  return (
    <>
      <Flex height="3rem" justify="space-between">
        <Stack isInline>
          <Image rounded="full" height="3rem" src={avatar} />
          <Text paddingLeft="1rem" alignSelf="center">
            <Link data-testid="name" fontWeight="bold">
              {name}
            </Link>
            {" " + i18n("asked")}
          </Text>
        </Stack>
        <Box
          as={IoIosClose}
          size="1.5rem"
          onClick={onRemove}
          color="gray.500"
        />
      </Flex>
      <Heading
        as="h3"
        data-testid="question"
        size={question.length > 20 ? "lg" : "xl"}
        padding="0.3rem 0"
        margin="0"
      >
        {question}
      </Heading>
    </>
  );
}

function AnswerTextarea({
  onSendAnswer,
  shouldShareOnTwitter,
  toggleShareOnTwitter
}) {
  const [answer, setAnswer] = useState();

  const answerFieldRef = useRef();
  useFocusOnRender(answerFieldRef);

  return (
    <>
      <Textarea
        ref={answerFieldRef}
        value={answer}
        placeholder={i18n("write_answer")}
        onChange={e => setAnswer(e.target.value)}
        {...answerArea}
      />
      <Stack isInline isReversed spacing="1rem">
        <Box as={FiSend} size="1.5rem" onClick={() => onSendAnswer(answer)} />
        <Box
          as={FaTwitter}
          size="1.5rem"
          color={shouldShareOnTwitter ? "#1da1f2" : "grey"}
          onClick={toggleShareOnTwitter}
        />
        <Text
          as="span"
          color="gray.400"
          display="inline-flex"
          alignItems="center"
        >
          {i18n("tweet your answer")}
        </Text>
      </Stack>
    </>
  );
}

export default function Question({
  question = "eai td? ",
  from = {
    avatar: randomDogAvatar(),
    name: i18n("anonymous")
  }
}) {
  const [state, send] = useMachine(questionMachine);

  const boxRef = useRef();
  useEventListener(
    "pointerup",
    e => !boxRef.current?.contains(e.target) && send("cancel")
  );

  return (
    <MotionBox
      onTap={() => send("answer")}
      ref={boxRef}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...questionBox}
    >
      <QuestionHeader question={question} from={from} onRemove={() => {}} />
      {!state.matches("idle") && (
        <AnswerTextarea
          shouldShareOnTwitter={state.context.shouldShareOnTwitter}
          toggleShareOnTwitter={() => send("toggleShareOnTwitter")}
          onSendAnswer={answer => send({ type: "sendAnswer", answer })}
        />
      )}
      {state.matches("sending") && (
        <Progress hasStripe color="orange" value={64} margin="-1rem" />
      )}
    </MotionBox>
  );
}
