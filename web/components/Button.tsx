import * as React from "react";
import { FaTwitter } from "react-icons/fa";

import { loginWithTwitter } from "lib/auth";
import { tweetProfile } from "lib/twitter";
import Textarea from "./Textarea";

export function LoginButton({ className = "" }) {
  return (
    <button
      type="button"
      className={`${className} border border-grey-400 rounded-10 hover:shadow-ask active:bg-blue-200 p-2 px-4 flex items-center`}
      onClick={loginWithTwitter}
    >
      <div className="h-5 w-5 text-twitter">
        <FaTwitter size="100%" />
      </div>
      <span className="ml-3">Entrar</span>
    </button>
  );
}

export function PrimaryButton({
  onClick,
  disabled = false,
  children,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-10 bg-black text-white font-semibold py-2 px-8 active:opacity-75
      ${disabled && "cursor-default opacity-50"}
      ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ onClick, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-gray-500 py-2 px-8 active:opacity-75 ${className}`}
    >
      {children}
    </button>
  );
}

export function TweetProfileButton({ onTweet }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tweetText, setTweetText] = React.useState("");
  return (
    <>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="rounded-10 border border-grey-400 py-2 px-8 hover:shadow-ask active:scale-75 focus:bg-grey-200"
      >
        Tweetar perfil
      </button>
      {isEditing && (
        <div className="absolute shadow-ask top-0 m-4 max-w-sm">
          <h1>Escreva algo para seus seguidores</h1>
          <Textarea
            onChange={(e) => setTweetText(e.currentTarget.value)}
            value={tweetText}
            placeholder={'Fala algo tipo "manda umas pergunta ai"'}
            textLimit={200} // the 55 other char goes to link (if u seeing this plz make it right)
          />
          <SecondaryButton onClick={() => setIsEditing(false)}>
            Cancelar
          </SecondaryButton>
          <PrimaryButton onClick={() => tweetProfile(tweetText).then(onTweet)}>
            Enviar
          </PrimaryButton>
        </div>
      )}
    </>
  );
}
