import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaTwitter } from "react-icons/fa";
import { MdSend, MdMoreVert } from "react-icons/md";
import {
  Avatar,
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

import questionMachine from "components/questionMachine";

import useOutsideObserver from "hooks/useOutsideObserver";
import useFocus from "hooks/useFocus";

import i18n from "utils/i18n";

function randomDogAvatar() {
  return "/cdn/008-corgi.svg";
}

function QuestionHeader({ from }) {
  return (
    <Flex height="3rem" justify="space-between">
      <Stack isInline>
        <Avatar src={from?.avatar ?? randomDogAvatar()} />
        <Text paddingLeft="1rem" alignSelf="center">
          <Link fontWeight="bold">{from?.name ?? i18n("anonymous")}</Link>
          {" perguntou"}
        </Text>
      </Stack>
    </Flex>
  );
}

function QuestionBody({ question }) {
  return (
    <Heading size={question.length > 20 ? "lg" : "xl"} padding="0.6rem 0">
      {question}
    </Heading>
  );
}

function Loader() {
  return <div></div>;
}

function SuccessMessage() {
  return <div></div>;
}

function FailureMessage() {
  return <div></div>;
}

const questionBox = {
  borderWidth: "12px",
  rounded: "lg",
  maxW: "sm",
  boxShadow: "0px 3px 21px 0px #dbdbdb",
  padding: "1rem",
  margin: "1rem",
  overflow: "hidden"
};

const answerArea = {
  border: "none",
  outline: "none",
  resize: "none",
  padding: "0",
  focusBorderColor: "none",
  fontSize: "1.2em"
};

export default function Question({ question = "eai td? ", from }) {
  const [state, send] = useMachine(questionMachine);

  const boxRef = useRef();
  useOutsideObserver(boxRef, () => send("cancel"));

  const answerFieldRef = useFocus(state.matches("answering"), [state.value]);

  const [answer, setAnswer] = useState();

  function onIdleTap() {
    if (state.matches("idle")) send("answer");
  }

  const QuestionState = {
    idle: () => (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onTap={onIdleTap}
      >
        <Box ref={boxRef} {...questionBox}>
          <QuestionHeader from={from} />
          <QuestionBody question={question} />
        </Box>
      </motion.div>
    ),
    answering: () => (
      <motion.div
        initial={{ size: 0.1 }}
        animate={{ size: 1 }}
        transition={{ duration: 2 }}
      >
        <Box ref={boxRef} {...questionBox}>
          <QuestionHeader from={from} />
          <QuestionBody question={question} />
          <Textarea
            ref={answerFieldRef}
            value={answer}
            placeholder={i18n("write_answer")}
            onChange={e => setAnswer(e.target.value)}
            {...answerArea}
          />
          <Stack isInline isReversed>
            <Box
              as={MdSend}
              size="1.5rem"
              color="#ffa600"
              onClick={() => send("sendAnswer")}
              paddingLeft="1rem"
            />
            <Box
              as={FaTwitter}
              size="1.5rem"
              color={state.context.shouldShareOnTwitter ? "#1da1f2" : "grey"}
              onClick={() => send("toggleShareOnTwitter")}
            />
          </Stack>
        </Box>
      </motion.div>
    ),
    sending: () => (
      <Box {...questionBox}>
        <QuestionHeader from={from} />
        <QuestionBody question={question} />
        <Textarea value={answer} {...answerArea} />
        <Progress hasStripe color="orange" value={64} margin="-1rem" />
      </Box>
    ),
    success: () => (
      <motion.div animate={{ opacity: 0 }} transition={{ duration: 1 }}>
        <Box {...questionBox}>
          <QuestionHeader from={from} />
          <QuestionBody question={question} />
          <Textarea value={answer} {...answerArea} />
        </Box>
      </motion.div>
    ),
    failure: () => (
      <Box {...questionBox} ref={boxRef}>
        <FailureMessage />
      </Box>
    )
  }[state.value];

  return <QuestionState />;
}
