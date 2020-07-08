/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import NextLink from "next/link";

const Anchor = React.forwardRef(
  (
    {
      onClick,
      children,
      ...props
    }: {
      children: React.ReactElement;
      onClick?: () => void;
    },
    ref
  ) => React.cloneElement(children, { onPress: onClick, ...props })
);

const Link = ({ children, href, as = undefined }) => (
  <NextLink href={href} as={as} passHref>
    <Anchor>{children}</Anchor>
  </NextLink>
);

export default Link;
