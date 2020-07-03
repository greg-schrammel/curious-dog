import * as React from "react";
import { transitions, positions, Provider as AlertProvider } from "react-alert";

const AlertTemplate = ({ style, options: { type }, message, close }) => (
  <div
    style={style}
    className={`rounded-xl py-3 px-4 w-full mx-4 shadow-xl text-white flex justify-between max-w-md
    ${type === "success" && "bg-green-500"}
    ${type === "error" && "bg-red-500"}`}
  >
    <span>{message}</span>
    <button type="button" className="font-medium" onClick={close}>
      Fechar
    </button>
  </div>
);

export default ({ children }) => (
  <AlertProvider
    template={AlertTemplate}
    position={positions.BOTTOM_CENTER}
    timeout={5000}
    offset="30px"
    transition={transitions.SCALE}
  >
    {children}
  </AlertProvider>
);
