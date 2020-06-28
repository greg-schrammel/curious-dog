import * as React from "react";
import { FaTwitter } from "react-icons/fa";

import { loginWithTwitter } from "lib/auth";

export function LoginWithTwitter() {
  return (
    <button
      className="bg-twitter rounded-full text-white hover:opacity-75 p-2 px-4 flex items-center"
      onClick={loginWithTwitter}
    >
      <div className="h-5 w-5">
        <FaTwitter size="100%" />
      </div>
      <span className="ml-3">Entrar</span>
    </button>
  );
}
