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

export function usePagination(
  query,
  initial: Array<Message>
): [(howMuch: number) => Promise<Message[]>, boolean] {
  const cursor = React.useRef(initial && initial[initial.length - 1]);
  const [hasMore, setHasMore] = React.useState(
    !initial || initial.length !== 0 // if initial is an empty array, there is no more
  );
  const next = async (howMuch = 10) => {
    if (!hasMore) return [];
    const queryResult = await (cursor.current
      ? query.startAfter(cursor.current)
      : query
    )
      .limit(howMuch)
      .get()
      .then(getData);
    cursor.current = queryResult[howMuch - 1];
    setHasMore(!!cursor.current);
    return queryResult;
  };
  return [next, hasMore];
}

export default function useMessages(
  userId,
  initial,
  { isReplied = true } = {}
) {
  const query = isReplied
    ? repliedMessagesQuery(userId)
    : unrepliedMessagesQuery(userId);
  const [next, hasMore] = usePagination(query, initial);
  const [messages, setMessages] = React.useState<Message[]>(initial || []);
  const [isLoading, setIsLoading] = React.useState(true);
  const more = (howMuch = 10) =>
    next(howMuch).then((msgs) => {
      setMessages([...msgs, ...messages]);
      setIsLoading(false);
    });
  React.useEffect(() => {
    if (!initial) more(10);
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
