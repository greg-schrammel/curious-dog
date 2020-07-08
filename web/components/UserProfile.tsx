import * as React from "react";
import { View } from "react-native";

import { sendMessage } from "lib/message";

import { useAuthUser } from "components/AuthUserProvider";
import { UserInfo } from "components/UserInfo";
import ShareButton from "components/ShareButton";
import { SendMessageField } from "components/SendMessageField";
import { LastReplies } from "components/LastReplies";

export default function UserProfile({ user, initialMessages, onOpenMessage }) {
  const authUser = useAuthUser();
  return (
    <>
      <View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            flexDirection: "row",
            paddingBottom: 32,
          }}
        >
          <UserInfo user={user} />
          <View style={{ paddingVertical: 24 }}>
            <ShareButton />
          </View>
        </View>
        {authUser?.id !== user.id && (
          <View style={{ paddingBottom: 32 }}>
            <SendMessageField onSend={(msg) => sendMessage(msg, user.id)} />
          </View>
        )}
        <LastReplies
          user={user}
          onPressMessage={onOpenMessage}
          initialMessages={initialMessages}
        />
      </View>
    </>
  );
}
