import React from 'react';
import { Flex, Text, Image, Box, Textarea, Button } from '@chakra-ui/core';

export function QuestionsList({ questions }) {
  return (
    <>
      <Heading as="h5" size="sm" marginTop="1rem">
        Ultimas respondidas // Novas Perguntas
      </Heading>
      <Flex flexWrap="wrap">
        {questions.map(({ question }) => (
          <Question key={question.id} question={question} />
        ))}
      </Flex>
    </>
  );
}

export function AskField({ onSubmit }) {
  const [question, setQuestion] = useState('');
  return (
    <Box>
      <Flex justifyContent="space-between" align="center" direction="row">
        <Text fontWeight="bold" isTruncated>
          Faça uma pergunta anônima
        </Text>
        <Button
          rounded="full"
          fontWeight="bold"
          color="white"
          bg="black"
          height="2rem"
          onClick={() => onSubmit(answer)}
        >
          Enviar
        </Button>
      </Flex>
      <Textarea
        marginTop="0.5rem"
        border="none"
        resize="none"
        focusBorderColor="none"
        backgroundColor="gray.100"
        placeholder="não vem xinga o cara o crl"
        value={question}
        onChange={e => setQuestion(e.target.value)}
      />
    </Box>
  );
}

export function UserInfo({ displayName, userName, photoURL }) {
  return (
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
        src={photoURL}
      />
    </Flex>
  );
}
