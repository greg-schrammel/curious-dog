import React from 'react';
import { FaTwitter } from 'react-icons/fa';
import { Box, Stack, Heading, Text, Button } from '@chakra-ui/core';

import i18n from 'lib/i18n';

export default function ShareYourProfile({ tweetProfile }) {
  return (
    <Stack
      rounded="lg"
      padding="1rem"
      overflow="hidden"
      margin="0.5rem"
      flexGrow={1}
      align="center"
      maxWidth="xl"
    >
      <Heading size="lg" margin="0">
        {i18n('you dont have any questions')}
      </Heading>
      <Text margin="0" fontSize="3rem">
        😔😭😭😢😭
      </Text>
      <Heading size="sm" color="gray.600" margin="0">
        {i18n('maybe sharing your profile will help')}
      </Heading>
      <Button
        marginTop="0.5rem"
        rounded="full"
        backgroundColor="#1da1f2"
        width="50%"
        justifyContent="space-evenly"
        onClick={tweetProfile}
      >
        <Stack isInline align="center" lineHeight="0">
          <Box as={FaTwitter} color="white" size="1.3rem" />
          <Text color="white" fontWeight="bold">
            Tweet
          </Text>
        </Stack>
      </Button>
    </Stack>
  );
}
