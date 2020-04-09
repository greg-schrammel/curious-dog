import React, { useState } from "react";
import i18n from "lib/i18n";
import {
  Tag,
  Image,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
} from "@chakra-ui/core";

import { LoginWithTwitter } from "components/Login";

function ProfileMenu({ profilePicSrc, userId }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Menu isOpen={isOpen}>
      <MenuButton
        as={Image}
        src={profilePicSrc}
        onClick={() => setIsOpen(!isOpen)}
        height="2.5rem"
        width="2.5rem"
        rounded="full"
        border="4px solid peachpuff"
      />
      <MenuList>
        <MenuGroup title="Profile">
          <MenuItem>Meu perfil</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}

export default function Header({ loggedUser }) {
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
          src="/assets/dogs/002-bulldog.svg"
          height="2rem"
          width="2rem"
          marginRight="1rem"
        />
        {!!loggedUser?.unanswered_count && (
          <Tag size="sm">
            {i18n("not answered", loggedUser.unanswered_count)}
          </Tag>
        )}
      </Flex>
      {!!loggedUser ? (
        <ProfileMenu src={photoURL} userId={userId} />
      ) : (
        <LoginWithTwitter />
      )}
    </Flex>
  );
}
