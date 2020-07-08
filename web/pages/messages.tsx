import * as React from "react";
import { GetServerSideProps } from "next";
import { useAlert } from "react-alert";
import Popover from "react-popover";
import { FontAwesome5 } from "@expo/vector-icons";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import { useHover, useFocus } from "react-native-web-hooks";

import { fetchUser } from "lib/user";
import tweet from "lib/twitter";

import { AuthUserProvider, useAuthUser } from "components/AuthUserProvider";
import useMessages from "components/useMessages";
import Textarea from "components/Textarea";
import AlertProvider from "components/Alert";
import { MenuItem, Menu } from "components/Menu";
import { Colors, Typography } from "theme";
import ShareButton from "components/ShareButton";
import { LoginWithTwitterButton } from "components/LoginWithTwitterButton";
import Layout from "components/Layout";

export function ReplyField({ onSend }) {
  const [body, setBody] = React.useState("");
  const [shouldTweet, setShouldTweet] = React.useState(true);
  return (
    <View>
      <Textarea
        onChangeText={setBody}
        value={body}
        placeholder="Responda aqui"
        textLimit={200}
        style={{ marginVertical: 16 }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() => setShouldTweet(!shouldTweet)}
          style={{ marginRight: 24 }}
        >
          <FontAwesome5
            name="twitter"
            size={24}
            color={shouldTweet ? Colors.twitter : Colors.grey[600]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSend({ body }, shouldTweet)}
          style={{
            borderRadius: 10,
            backgroundColor: Colors.black,
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}
        >
          <Text style={[Typography.body, { color: Colors.white }]}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Message({ message, onDelete }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef();
  const isHovered = useHover(ref);
  const isFocused = useFocus(ref);
  return (
    <View
      ref={ref}
      style={{
        padding: 12,
        marginVertical: 4,
        backgroundColor:
          isHovered || isFocused ? Colors.grey[300] : Colors.white,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={Typography.subheader}>{message.body}</Text>
        <Popover
          tipSize={0.01}
          isOpen={isOpen}
          preferPlace="below"
          onOuterAction={() => setIsOpen(false)}
          body={
            <Menu>
              <MenuItem onPress={onDelete}>
                <Text style={[Typography.body, { color: Colors.red[500] }]}>
                  Delete
                </Text>
              </MenuItem>
            </Menu>
          }
        >
          <TouchableOpacity onPress={() => setIsOpen(true)}>
            <FontAwesome5 name="ellipsis-h" size={20} color={Colors.black} />
          </TouchableOpacity>
        </Popover>
      </View>
    </View>
  );
}

const NothingHereShareYourProfile = () => {
  const [hasShared, setHasShared] = React.useState(false);
  return (
    <View>
      <Text style={[Typography.body, { paddingVertical: 16 }]}>
        Nada por aqui, compartilhar seu perfil pode ajudar
      </Text>
      {hasShared ? (
        <Text style={Typography.body}>
          Agora é só esperar seus fãs chegarem
        </Text>
      ) : (
        <ShareButton onShared={() => setHasShared(true)} />
      )}
    </View>
  );
};

function UnrepliedMessages({ userId }) {
  const [
    { messages, more, hasMore, isLoading },
    { remove, reply },
  ] = useMessages(userId, null, { isReplied: false });
  const [replyingTo, setReplyingTo] = React.useState<undefined | string>();
  const alert = useAlert();
  const sendReply = (message, r, shouldTweet) =>
    reply(message.id, r).then(
      () => {
        alert.success("Resposta enviada!");
        if (shouldTweet)
          tweet(`${message.body} — ${r.body}
        ${window.location.hostname}/u/${message.to}?m=${message.id}`);
      },
      () => alert.error("Opa deu algo errado :(")
    );
  return (
    <>
      <Text style={[Typography.largeHeader, { paddingBottom: 16 }]}>
        Suas mensagens não respondidas
      </Text>
      {messages.length > 0 || isLoading ? (
        <FlatList
          contentContainerStyle={{
            flex: 1,
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
          onEndReachedThreshold={0.2}
          onEndReached={() => more(5)}
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
                    paddingVertical: 32,
                    margin: "auto",
                    color: Colors.grey[600],
                  },
                ]}
              >
                Isso é tudo
              </Text>
            )
          }
          data={messages}
          keyExtractor={(message) => message.id}
          renderItem={({ item: message }) =>
            replyingTo !== message.id ? (
              <TouchableOpacity
                key={message.id}
                onPress={() => setReplyingTo(message.id)}
              >
                <Message
                  message={message}
                  onDelete={() => remove(message.id)}
                />
              </TouchableOpacity>
            ) : (
              <View key={message.id} style={{ padding: 12 }}>
                <Message
                  message={message}
                  onDelete={() => remove(message.id)}
                />
                <ReplyField
                  onSend={(r, shouldTweet) =>
                    sendReply(message, r, shouldTweet)
                  }
                />
              </View>
            )
          }
        />
      ) : (
        <NothingHereShareYourProfile />
      )}
    </>
  );
}

function YouShouldLogin() {
  return (
    <View style={{ alignItems: "center", paddingVertical: 32 }}>
      <Text style={[Typography.header, { paddingBottom: 16 }]}>
        Você não esta logado
      </Text>
      <LoginWithTwitterButton />
    </View>
  );
}

function Me() {
  const me = useAuthUser();
  return (
    <Layout>
      {me ? <UnrepliedMessages userId={me.id} /> : <YouShouldLogin />}
    </Layout>
  );
}

export default ({ me }) => {
  return (
    <AlertProvider>
      <AuthUserProvider user={me}>
        <Me />
      </AuthUserProvider>
    </AlertProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // authorization: "Bearer " + tokenId
  const tokenId = req.headers.authorization?.split(" ")[1];

  const loggedUser = await require("lib/firebase/admin")
    .userIdFromToken(tokenId)
    .then(fetchUser, () => null); // if it fails the user is null

  return {
    props: {
      me: loggedUser,
    },
  };
};
