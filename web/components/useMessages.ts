import * as React from "react";
import {
  Message,
  fetchMessages,
  deleteMessage,
  replyMessage,
  Reply,
} from "lib/api";

const limit = 20;

export default function useMessages(
  userId,
  initial: Array<Message>,
  isReplied = true
) {
  const [messages, setMessages] = React.useState(initial || []);
  const cursor = React.useRef(initial && initial[limit - 1]);
  const [hasMore, setHasMore] = React.useState(
    !initial || initial.length !== 0 // if initial is an empty array, there is no more
  );
  const more = async () => {
    const msgs = await fetchMessages(userId, {
      startAfter: cursor.current,
      isReplied,
      limit,
    });
    cursor.current = msgs[msgs.length - 1];
    setHasMore(!!cursor.current);
    setMessages(msgs);
  };
  React.useEffect(() => {
    if (!initial) more();
  }, []);
  const filterMsg = (msgId) => messages.filter((m) => m.id !== msgId);
  const remove = (msgId) =>
    deleteMessage(msgId).then(() => setMessages(filterMsg(msgId)));
  const reply = (msgId, r: Reply) =>
    replyMessage(msgId, r).then(() => setMessages(filterMsg(msgId)));
  return [
    { messages, more, hasMore },
    { remove, reply },
  ];
}
