import * as React from "react";

export function ConfirmButton({
  onClick,
  disabled = false,
  children,
  className = "",
}) {
  return (
    <button
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
