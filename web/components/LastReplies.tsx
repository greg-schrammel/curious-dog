import * as React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

import { Typography, Colors } from "theme";
import { Message } from "lib/message";
import useMessages from "./useMessages";

export const Reply = ({ message }: { message: Message }) => (
  <View style={{ paddingVertical: 16 }}>
    <Text style={[Typography.subheader, { paddingBottom: 8 }]}>
      {message.body}
    </Text>
    <Text style={Typography.body}>{message.body}</Text>
  </View>
);

export function LastReplies({ onPressMessage, initialMessages, user }) {
  const [{ messages, more, hasMore, isLoading }] = useMessages(
    user.id,
    initialMessages
  );
  return (
    <View>
      <Text style={[Typography.header, { paddingBottom: 16 }]}>
        Ultimas Respostas
      </Text>
      {messages.length > 0 || isLoading ? (
        <FlatList
          contentContainerStyle={{ height: "100%", width: "100%" }}
          onEndReachedThreshold={0.2}
          onEndReached={() => more(10)}
          ListFooterComponent={() =>
            hasMore ? (
              <Text style={[Typography.body, { paddingVertical: 16 }]}>
                Carregando...
              </Text>
            ) : (
              <Text
                style={[
                  Typography.small,
                  {
                    paddingVertical: 16,
                    margin: "auto",
                    color: Colors.grey[600],
                  },
                ]}
              >
                Vc viu todas!!
              </Text>
            )
          }
          data={messages}
          keyExtractor={(message) => message.id}
          renderItem={({ item: message }) => (
            <TouchableOpacity
              key={message.id}
              onPress={() => onPressMessage(message)}
            >
              <Reply message={message} />
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text
          style={[
            Typography.body,
            {
              paddingVertical: 16,
              color: Colors.grey[600],
            },
          ]}
        >
          Não tem nada aqui :/
        </Text>
      )}
    </View>
  );
}
