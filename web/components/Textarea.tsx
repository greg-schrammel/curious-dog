import * as React from "react";
import TextareaAutosize from "react-autosize-textarea";

export default function Textarea({
  onChange,
  value,
  placeholder,
  textLimit,
  className = "rounded-2xl bg-white shadow-ask",
}) {
  const hasTextOverflow = value.length > textLimit;
  return (
    <div className={`p-4 pb-0 ${className}`}>
      <TextareaAutosize
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        className="w-full resize-none focus:outline-none placeholder-grey-600"
        rows={3}
      />
      <div
        className={`flex justify-end items-center text-grey-600 text-sm pb-3 font-medium
        ${hasTextOverflow && "text-red-500"}`}
      >
        {value.length}/{textLimit}
      </div>
    </div>
  );
}
