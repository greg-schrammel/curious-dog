import * as React from "react";
import { FontAwesome5 } from "@expo/vector-icons";

import { loginWithTwitter } from "lib/auth";
import { Colors, Typography } from "theme";
import { TouchableHighlight, Text, View } from "react-native";
import { useHover, useFocus } from "react-native-web-hooks";

export function LoginWithTwitterButton() {
  const ref = React.useRef(null);
  const isHovered = useHover(ref);
  const isFocused = useFocus(ref);
  return (
    <TouchableHighlight
      ref={ref}
      style={{
        borderRadius: 10,
        borderColor: isFocused || isHovered ? Colors.twitter : Colors.grey[400],
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 16,
      }}
      underlayColor={Colors.twitterLight}
      onPress={loginWithTwitter}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <FontAwesome5 name="twitter" size={20} color={Colors.twitter} />
        <Text style={[Typography.body, { marginLeft: 8 }]}>Entrar</Text>
      </View>
    </TouchableHighlight>
  );
}
