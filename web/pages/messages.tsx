import * as React from "react";
import { GetServerSideProps } from "next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAlert } from "react-alert";
import Popover from "react-popover";
import { FaTwitter, FaEllipsisH } from "react-icons/fa";

import { fetchUser } from "lib/api";

import Header from "components/Header";
import { AuthUserProvider, useAuthUser } from "components/AuthUserProvider";
import { LoginButton, ConfirmButton } from "components/Button";
import useMessages from "components/useMessages";
import Textarea from "components/Textarea";
import AlertProvider from "components/Alert";
import { MenuItem, Menu } from "components/Menu";

export function ReplyField({ onSend }) {
  const [body, setBody] = React.useState("");
  const [shouldTweet, setShouldTweet] = React.useState(true);
  const alert = useAlert();
  const sendReply = (r) =>
    onSend(r).then(
      () => alert.success("Resposta enviada!"),
      () => alert.error("Opa deu algo errado :(")
    );
  return (
    <div className="flex flex-col space-y-4">
      <Textarea
        onChange={(e) => setBody(e.currentTarget.value)}
        value={body}
        placeholder="Responda aqui"
        textLimit={200}
      />
      <div className="flex items-center">
        <FaTwitter
          onClick={() => setShouldTweet(!shouldTweet)}
          className={`ml-auto mr-4 h-6 w-6 ${
            shouldTweet ? "text-twitter" : "text-grey-600"
          }`}
        />
        <ConfirmButton
          onClick={() => sendReply({ body })}
          disabled={body.length > 200}
        >
          Enviar
        </ConfirmButton>
      </div>
    </div>
  );
}

function Message({ message, onClick, isReplying = false, onDelete, onReply }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <button
      type="button"
      className={`flex flex-col space-y-2 p-3 rounded-xl
      ${
        !isReplying &&
        "hover:bg-grey-200 focus:bg-grey-200 active:scale-75 cursor-pointer"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <h2 className="font-medium text-md">{message.body}</h2>
        <Popover
          tipSize={0.01}
          isOpen={isOpen}
          preferPlace="below"
          onOuterAction={() => setIsOpen(false)}
          body={
            <Menu>
              <MenuItem onClick={onDelete} className="py-2 text-red-500">
                Delete
              </MenuItem>
            </Menu>
          }
        >
          <button
            type="button"
            onClick={(e) => {
              setIsOpen(true);
              e.stopPropagation();
            }}
            className="ml-auto cursor-pointer focus:opacity-75"
          >
            <FaEllipsisH className="h-5 w-5 text-grey-600" />
          </button>
        </Popover>
      </div>
      {isReplying && <ReplyField onSend={(r) => onReply(r)} />}
    </button>
  );
}

const NothingHereShareYourProfile = () => {
  const [hasShared, setHasShared] = React.useState(false);
  return (
    <div>
      <span>Nada por aqui, compartilhar seu perfil pode ajudar</span>
      {hasShared ? (
        <TweetProfileButton onTweet={() => setHasShared(true)} />
      ) : (
        <span>Agora é só esperar seus fãs chegarem</span>
      )}
    </div>
  );
};

function UnrepliedMessages({ userId }) {
  const [{ messages, more, hasMore }, { remove, reply }] = useMessages(
    userId,
    null,
    false
  );
  const [replyingTo, setReplyingTo] = React.useState<undefined | string>();
  return (
    <>
      <h2 className="font-bold text-xl pb-6">Suas mensagens não respondidas</h2>
      <InfiniteScroll
        dataLength={messages.length}
        next={more}
        hasMore={hasMore}
        loader={<span>Carregando...</span>}
        endMessage={
          messages.length > 0 ? (
            <span>Vc viu todas!!</span>
          ) : (
            <NothingHereShareYourProfile />
          )
        }
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            onClick={() => setReplyingTo(message.id)}
            onDelete={() => remove(message.id)}
            onReply={(r) => reply(message.id, r)}
            isReplying={replyingTo === message.id}
          />
        ))}
      </InfiniteScroll>
    </>
  );
}

function YouShouldLogin() {
  return (
    <div className="mx-auto py-12 flex flex-col space-y-8">
      <h1 className="text-2xl font-bold text-center">Você não esta logado</h1>
      <LoginButton className="mx-auto" />
    </div>
  );
}

function Me() {
  const me = useAuthUser();
  return (
    <div className="p-8 max-w-2xl lg:max-w-3xl mx-auto">
      <Header />
      {me ? <UnrepliedMessages userId={me.id} /> : <YouShouldLogin />}
    </div>
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

  const loggedUser = tokenId
    ? await require("lib/firebase/admin")
        .userIdFromToken(tokenId)
        .then(fetchUser)
    : null;

  return {
    props: {
      me: loggedUser,
    },
  };
};
