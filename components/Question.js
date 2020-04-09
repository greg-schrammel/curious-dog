import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaTwitter } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import {
  Button,
  Image,
  Box,
  Textarea,
  Stack,
  Heading,
  Text,
  Link,
  Flex,
} from "@chakra-ui/core";

import useEventListener from "@use-it/event-listener";

import i18n from "lib/i18n";

function randomDogAvatar() {
  return "/assets/dogs/008-corgi.svg";
}

function sendAnswer() {
  return new Promise();
}

const questionBox = {
  rounded: "lg",
  backgroundColor: "white",
  padding: "1rem",
  overflow: "hidden",
  margin: "0.5rem",
  flexGrow: 1,
  boxShadow: "0px 2px 8px 2px #E2E8F0",
  maxWidth: "sm",
  w: "xs",
};

const answerArea = {
  border: "none",
  resize: "none",
  focusBorderColor: "none",
  fontSize: "1.1em",
  backgroundColor: "gray.100",
  marginBottom: "1rem",
};

const MotionBox = motion.custom(Box);

const QuestionText = (question) => (
  <Heading
    as="h3"
    data-testid="question"
    size={question.length > 20 ? "lg" : "xl"}
    padding="0.3rem 0"
    margin="0"
  >
    {question}
  </Heading>
);

const DeleteButton = ({ onClick }) => (
  <Box as={IoIosClose} size="1.5rem" onClick={onClick} color="gray.500" />
);

function QuestionHeader({
  question,
  from: { avatar, name },
  onDeleteQuestion,
}) {
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
        <DeleteButton onClick={onDeleteQuestion} />
      </Flex>
      <QuestionText question={question} />
    </>
  );
}

const TwitterIcon = ({ onClick, isActive }) => (
  <Box as={FaTwitter} size="1.5rem" color={isActive} onClick={onClick} />
);

const SendButton = ({ onClick }) => (
  <Button rounded="lg" onClick={onClick}>
    Enviar
  </Button>
);

function AnswerTextarea({ onSendAnswer }) {
  const [answer, setAnswer] = useState("");
  const [shouldShareOnTwitter, setSharingOnTwitter] = useState(true);

  const answerFieldRef = useRef();
  useEffect(() => {
    ref.current?.focus();
  }, [ref.current]);

  return (
    <>
      <Textarea
        ref={answerFieldRef}
        value={answer}
        placeholder={i18n("write_answer")}
        onChange={(e) => setAnswer(e.target.value)}
        {...answerArea}
      />
      <Stack isInline isReversed spacing="1rem">
        <SendButton
          onClick={() => onSendAnswer(answer, shouldShareOnTwitter)}
        />
        <TwitterIcon
          onClick={() => setSharingOnTwitter(!shouldShareOnTwitter)}
          isActive={shouldShareOnTwitter}
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
  question,
  from = {
    avatar: randomDogAvatar(),
    name: i18n("anonymous"),
  },
}) {
  const [isOpen, setIsOpen] = useState(false);

  const boxRef = useRef();
  useEventListener("pointerup", (e) => {
    if (!boxRef.current?.contains(e.target)) setShowingAnswerField(false);
  });

  return (
    <MotionBox
      onTap={() => setIsOpen(true)}
      ref={boxRef}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...questionBox}
    >
      <QuestionHeader question={question} from={from} onRemove={() => {}} />
      {isOpen && (
        <AnswerTextarea onSendAnswer={(answer) => sendAnswer(answer)} />
      )}
    </MotionBox>
  );
}
