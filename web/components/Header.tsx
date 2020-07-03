import React, { useState } from "react";
import Link from "next/link";
import Popover from "react-popover";

import { logout } from "lib/auth";

import { useAuthUser } from "components/AuthUserProvider";
import { LoginButton } from "components/Button";
import { MenuItem, Menu } from "components/Menu";

function AvatarMenu({ photoURL, userId }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      tipSize={0.01}
      isOpen={isOpen}
      preferPlace="below"
      onOuterAction={() => setIsOpen(false)}
      body={
        <Menu>
          <Link href="/u/[id]" as={`/u/${userId}`}>
            <MenuItem className="pt-2">Meu Perfil</MenuItem>
          </Link>
          <MenuItem onClick={logout} className="pb-2 text-red-500">
            Sair
          </MenuItem>
        </Menu>
      }
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 my-auto rounded-full border-grey-300 focus:border-purple-200 hover:opacity-75 border-4"
      >
        <img src={photoURL} alt="profile" className="h-full rounded-full" />
      </button>
    </Popover>
  );
}

export default function Header() {
  const authUser = useAuthUser();
  return (
    <header className="flex justify-between items-center pb-12">
      <img src="/dog-emoji.png" alt="dog emoji" className="h-12 w-auto" />
      {authUser ? (
        <div className="flex items-center">
          <Link href="/messages">
            <button
              type="button"
              className="mr-4 py-1 px-2 text-sm rounded-10 bg-grey-300 text-grey-600 active:scale-90 focus:shadow-ask focus:scale-110"
            >
              {`${authUser.unrepliedCount} Mensagens`}
            </button>
          </Link>
          <AvatarMenu photoURL={authUser.photoURL} userId={authUser.id} />
        </div>
      ) : (
        <LoginButton />
      )}
    </header>
  );
}
