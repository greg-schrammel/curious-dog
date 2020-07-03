import * as React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAlert } from "react-alert";

import { sendMessage } from "lib/api";
import { useAuthUser } from "components/AuthUserProvider";
import useMessages from "components/useMessages";
import { ConfirmButton } from "components/Button";
import Textarea from "components/Textarea";

const Reply = ({ message, reply }) => (
  <div className="flex flex-col space-y-1 py-5">
    <h3 className="font-medium text-lg">{message}</h3>
    <p className="text-md">{reply}</p>
  </div>
);

export function LastReplies({ messages, onNext, hasMore }) {
  return (
    <div>
      <h2 className="font-bold text-lg pb-4">Ultimas Respostas</h2>
      <InfiniteScroll
        dataLength={messages.length}
        next={onNext}
        hasMore={hasMore}
        loader={<span>Carregando...</span>}
        endMessage={
          messages.length > 0 ? (
            <span>Vc viu todas!!</span>
          ) : (
            <span>Não tem nada aqui :/</span>
          )
        }
      >
        {messages.map((message) => (
          <Reply
            key={message.id}
            message={message.body}
            reply={message.reply.body}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export function AskField({ onSend }) {
  const [message, setMessage] = React.useState("");
  const alert = useAlert();
  const send = (msg) => {
    onSend(msg).then(
      () => alert.success("Mensagem enviada!"),
      () => alert.error("Opa deu algo errado :(")
    );
    setMessage("");
  };
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="font-semibold text-lg">Envie algo anonimamente</h1>
      <Textarea
        textLimit={200}
        onChange={(e) => setMessage(e.currentTarget.value)}
        placeholder="Digite algo aqui!!!!!!!!!!!"
        value={message}
      />
      <ConfirmButton
        onClick={() => send(message)}
        disabled={message.length === 0 || message.length > 200}
        className="ml-auto"
      >
        Enviar
      </ConfirmButton>
    </div>
  );
}

const ShareProfile = () => (
  <div>
    <button
      type="button"
      onClick={() => null}
      className="rounded-10 border border-grey-400 py-2 px-8 active:scale-75 hover:shadow-ask focus:bg-grey-200"
    >
      Tweetar perfil
    </button>
  </div>
);

export function UserInfo({ user }) {
  return (
    <div className="pb-0 sm:pb-8 flex items-center justify-between flex-wrap">
      <div className="pb-8 sm:pb-0 flex flex-no-wrap items-center">
        <img
          alt="profile"
          src={user.photoURL}
          className="h-12 rounded-full mr-6"
        />
        <div className="flex flex-col justify-center">
          <h1 className="font-bold text-2xl">{user.displayName}</h1>
          <span className="text-md text-grey-600">{user.userName}</span>
        </div>
      </div>
      <ShareProfile />
    </div>
  );
}

export default function UserProfile({ user, initialMessages }) {
  const authUser = useAuthUser();
  const [{ messages, more, hasMore }] = useMessages(user.id, initialMessages);
  return (
    <div className="space-y-8">
      <UserInfo user={user} />
      {authUser?.id !== user.id && (
        <AskField onSend={(msg) => sendMessage(msg, user.id)} />
      )}
      <LastReplies messages={messages} onNext={more} hasMore={hasMore} />
    </div>
  );
}
