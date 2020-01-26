import React from "react";
import i18n from "utils/i18n";
import { Tag, Image, Text, Flex } from "@chakra-ui/core";

export default function Header({ notAnsweredCount, profilePicSrc }) {
  return (
    <Flex
      align="center"
      justify="space-between"
      height="4rem"
      padding="1rem"
      borderBottom="1px solid"
      borderBottomColor="gray.200"
    >
      <Flex align="center">
        <Image
          data-testid="logo"
          src="/cdn/002-bulldog.svg"
          height="2rem"
          width="2rem"
          marginRight="1rem"
        />
        {!!notAnsweredCount && (
          <Tag size="sm">
            <Text lineHeight="0" data-testid="toAnswerCount">
              {i18n("not answered", notAnsweredCount)}
            </Text>
          </Tag>
        )}
      </Flex>
      <Image
        height="2.5rem"
        width="2.5rem"
        rounded="full"
        border="4px solid peachpuff"
        src={profilePicSrc}
      />
    </Flex>
  );
}
