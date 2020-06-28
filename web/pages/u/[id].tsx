import * as React from "react";
import { GetServerSideProps } from "next";

import Header from "components/Header";
import UserProfile from "components/UserProfile";
import { AuthUserProvider } from "components/AuthUserProvider";
import AlertProvider from "components/Alert";

import { fetchUser, fetchMessages, User, Message } from "lib/api";

interface UserPageProps {
  loggedUser: User;
  user: User;
  messages: Array<Message>;
}

const Layout = ({ children }) => (
  <div className="p-8 max-w-2xl lg:max-w-3xl mx-auto">
    <Header />
    {children}
  </div>
);

const UserNotFound = () => (
  <Layout>
    <h1 className="text-center py-12">🤔 Esse usuario não existe 🧐</h1>
  </Layout>
);

export default function UserPage({
  loggedUser,
  user,
  messages,
}: UserPageProps) {
  if (!user) return <UserNotFound />;
  return (
    <AlertProvider>
      <AuthUserProvider user={loggedUser}>
        <Layout>
          <UserProfile user={user} initialMessages={messages} />
        </Layout>
      </AuthUserProvider>
    </AlertProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  // authorization: "Bearer " + tokenId
  const tokenId = req.headers.authorization?.split(" ")[1];
  const userId = params.id as string;

  const loggedUser = tokenId
    ? await require("lib/firebase/admin")
        .userIdFromToken(tokenId)
        .then(fetchUser)
    : null;

  if (userId) {
    const user =
      loggedUser?.id != userId ? await fetchUser(userId) : loggedUser;
    if (!user) return { props: { loggedUser } };
    const messages = await fetchMessages(user.id);
    return {
      props: { loggedUser, user, messages },
    };
  }

  return { props: { loggedUser } };
};
