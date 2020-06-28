import React, { useState } from "react";
import Link from "next/link";
import Popover from "react-popover";

import { logout } from "lib/auth";

import { useAuthUser } from "web/components/AuthUserProvider";
import { LoginWithTwitter } from "./Login";

function AvatarMenu({ photoURL, userId }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      tipSize={0.01}
      isOpen={isOpen}
      preferPlace="below"
      onOuterAction={() => setIsOpen(false)}
      body={
        <div className="flex flex-col rounded-xl bg-white shadow-lg overflow-hidden">
          <Link href="/u/[id]" as={`/u/${userId}`}>
            <a className="px-4 py-1 pt-2 hover:bg-grey-200 active:opacity-75">
              Meu Perfil
            </a>
          </Link>
          <button
            onClick={logout}
            className="px-4 py-1 pb-2 text-red-500 hover:bg-grey-200 active:opacity-75"
          >
            Sair
          </button>
        </div>
      }
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 my-auto rounded-full border-grey-300 focus:border-blue-200 hover:opacity-75 border-4"
      >
        <img src={photoURL} className="h-full rounded-full" />
      </button>
    </Popover>
  );
}

export default function Header() {
  const authUser = useAuthUser();
  return (
    <header className="flex justify-between items-center pb-12">
      <img src="/dog-emoji.png" className="h-12 w-auto" />
      {!!authUser ? (
        <div className="flex items-center">
          <Link href="/messages">
            <a className="mr-4 py-1 px-2 text-sm rounded-10 bg-grey-300 text-grey-600">
              {`${authUser.unrepliedCount} Mensagens`}
            </a>
          </Link>
          <AvatarMenu photoURL={authUser.photoURL} userId={authUser.id} />
        </div>
      ) : (
        <LoginWithTwitter />
      )}
    </header>
  );
}
