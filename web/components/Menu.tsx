import * as React from "react";
import { View, TouchableOpacityProps, TouchableOpacity } from "react-native";
import { Shadow, Colors } from "theme";

import { useHover, useFocus } from "react-native-web-hooks";

export const MenuItem = ({
  style,
  ...props
}: TouchableOpacityProps & { children: React.ReactElement }) => {
  const ref = React.useRef();
  const isHovered = useHover(ref);
  const isFocused = useFocus(ref);
  return (
    <TouchableOpacity
      ref={ref}
      style={[
        { paddingHorizontal: 16, paddingVertical: 8, alignItems: "center" },
        (isHovered || isFocused) && { backgroundColor: Colors.grey[200] },
        style,
      ]}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  );
};

export const Menu = ({ children }) => (
  <View
    style={[
      Shadow.large,
      { borderRadius: 16, overflow: "hidden", backgroundColor: Colors.white },
    ]}
  >
    {children}
  </View>
);
