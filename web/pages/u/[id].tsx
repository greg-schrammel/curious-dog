import * as React from "react";
import { GetServerSideProps } from "next";

import { fetchRepliedMessages, Message, fetchMessage } from "lib/message";
import { fetchUser, User } from "lib/user";

import { AuthUserProvider } from "components/AuthUserProvider";
import AlertProvider from "components/Alert";
import Layout from "components/Layout";
import UserNotFound from "components/UserNotFound";
import OpenMessage from "components/OpenMessage";
import UserProfile from "components/UserProfile";
import Meta from "components/Meta";

interface UserPageProps {
  loggedUser: User;
  user: User;
  messages: Array<Message>;
  openMessage: Message;
}

export default function UserPage({
  loggedUser,
  user,
  messages,
  openMessage: message,
}: UserPageProps) {
  const [openMessage, setOpenMessage] = React.useState(message);
  if (!user) return <UserNotFound />;
  return (
    <>
      <Meta
        title={openMessage ? openMessage.body : user.displayName}
        username={user.userName}
        description={
          openMessage ? openMessage.reply.body : "Envie mensagens anonimamente!"
        }
        image={user.photoURL}
        path={`/u/${user.id}${openMessage ? `?m=${openMessage.id}` : ""}`}
      />
      <AlertProvider>
        <AuthUserProvider user={loggedUser}>
          <Layout>
            <UserProfile
              user={user}
              initialMessages={messages}
              onOpenMessage={setOpenMessage}
            />
          </Layout>
          {openMessage && (
            <OpenMessage
              onClose={() => setOpenMessage(null)}
              user={user}
              message={openMessage}
            />
          )}
        </AuthUserProvider>
      </AlertProvider>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  query,
}) => {
  // authorization: "Bearer " + tokenId
  const tokenId = req.headers.authorization?.split(" ")[1];
  const userId = params.id as string;
  const openMessageId = query.m;

  const loggedUser = await require("lib/firebase/admin")
    .userIdFromToken(tokenId)
    .then(fetchUser, () => null); // if it fails the user is null

  if (userId) {
    const user =
      loggedUser?.id !== userId ? await fetchUser(userId) : loggedUser;
    if (!user) return { props: { loggedUser } };
    const messages = await fetchRepliedMessages(user.id, 10);
    // it can be a message thats not replied by the page user, do we want that? for now I don't care
    // if the massage has already been fetched in the above funtion, shouldn't make another request,
    // but it also shouldnt be handled here
    const openMessage = await fetchMessage(openMessageId);
    return {
      props: { loggedUser, user, messages, openMessage },
    };
  }

  return { props: { loggedUser } };
};
