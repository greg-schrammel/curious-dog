import * as React from "react";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import { View, Text, TouchableOpacity } from "react-native";
import { Shadow, Colors, Typography } from "theme";

const AlertTemplate = ({ style, options: { type }, message, close }) => (
  <View
    style={[
      style,
      Shadow.large,
      {
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 32,
        justifyContent: "space-between",
        flexDirection: "row",
        width: "100%",
        maxWidth: 768,
      },
      type === "success" && { backgroundColor: Colors.green[500] },
      type === "error" && { backgroundColor: Colors.red[500] },
    ]}
  >
    <Text style={[Typography.body, { color: Colors.white }]}>{message}</Text>
    <TouchableOpacity onPress={close}>
      <Text
        style={[Typography.body, { color: Colors.white, fontWeight: "600" }]}
      >
        Fechar
      </Text>
    </TouchableOpacity>
  </View>
);

export { useAlert } from "react-alert";

export default ({ children }) => (
  <AlertProvider
    template={AlertTemplate}
    position={positions.BOTTOM_CENTER}
    timeout={5000}
    offset="32px"
    transition={transitions.SCALE}
  >
    {children}
  </AlertProvider>
);
