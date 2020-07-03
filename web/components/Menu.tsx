import * as React from "react";

export const MenuItem = ({ className = "", children, onClick = undefined }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-1 hover:bg-grey-200 focus:bg-grey-200 active:opacity-75 ${className}`}
  >
    {children}
  </button>
);

export const Menu = ({ className = "", children }) => (
  <div
    className={`flex flex-col rounded-xl bg-white shadow-ask overflow-hidden ${className}`}
  >
    {children}
  </div>
);
