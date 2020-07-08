import * as React from "react";

import { View, Text, Image } from "react-native";

import ShareProfileButton from "components/ShareButton";
import { Typography, Colors } from "theme";

export function UserInfo({ user }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "nowrap",
      }}
    >
      <Image
        accessibilityLabel="profile"
        source={user.photoURL}
        style={{ borderRadius: 1000, marginRight: 24, height: 48, width: 48 }}
      />
      <View>
        <Text style={[Typography.header, { paddingBottom: 8 }]}>
          {user.displayName}
        </Text>
        <Text style={[Typography.body, { color: Colors.grey[600] }]}>
          {user.userName}
        </Text>
      </View>
    </View>
  );
}
