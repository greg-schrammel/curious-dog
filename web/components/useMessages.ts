import * as React from "react";
import {
  Message,
  deleteMessage,
  replyMessage,
  Reply,
  unrepliedMessagesQuery,
  repliedMessagesQuery,
} from "lib/message";

const getData = (s) => s.docs.map((d) => ({ id: d.id, ...d.data() }));

export function usePagination(query, initial: Array<Message>) {
  const cursor = React.useRef(initial && initial[initial.length - 1]);
  const next = async (howMuch = 10) => {
    const queryResult = await (cursor.current
      ? query.startAfter(cursor.current)
      : query
    )
      .limit(howMuch)
      .get()
      .then(getData);
    cursor.current = queryResult[howMuch - 1];
    return queryResult;
  };
  return next;
}

export default function useMessages(
  userId,
  initial,
  { isReplied = false } = {}
) {
  const query = isReplied
    ? repliedMessagesQuery(userId)
    : unrepliedMessagesQuery(userId);
  const next = usePagination(query, initial);
  const [messages, setMessages] = React.useState<Message[]>(initial || []);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(initial && initial.length !== 0);
  const more = (howMuch = 10) => {
    next(howMuch).then((msgs) => {
      setMessages(msgs);
      setIsLoading(false);
      setHasMore(!!msgs[howMuch - 1]);
    });
  };
  React.useEffect(() => {
    if (!initial) more();
    else setIsLoading(false);
  }, []);
  const filterMsg = (msgId) => messages.filter((m) => m.id !== msgId);
  const remove = (msgId) =>
    deleteMessage(msgId).then(() => setMessages(filterMsg(msgId)));
  const reply = (msgId, r: Reply) =>
    replyMessage(msgId, r).then(() => setMessages(filterMsg(msgId)));
  return [
    { messages, more, hasMore, isLoading },
    { remove, reply },
  ];
}
