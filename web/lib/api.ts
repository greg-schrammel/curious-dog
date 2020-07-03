import app from "lib/firebase/client";
import "firebase/firestore";

export interface User {
  id: string;
  displayName: string;
  userName: string;
  photoURL: string;
  unrepliedCount: number;
}

export interface Reply {
  body: string;
  image: string;
}

export interface Message {
  id: string;
  body: string;
  to: User["id"];
  reply?: Reply;
  lastModifiedAt: Date;
}

const firestore = app.firestore();
const messagesCollection = firestore.collection("messages");

export const sendMessage = (message, to) =>
  messagesCollection.add({ body: message, to });

export const replyMessage = (messageId: Message["id"], reply: Reply) =>
  messagesCollection.doc(messageId).update({ reply });

export const deleteMessage = (messageId) =>
  messagesCollection.doc(messageId).delete();

const userMessagesQuery = (userId: User["id"]) =>
  messagesCollection.where("to", "==", userId);

const getMessages = (s) =>
  s.docs.map((d) => ({ id: d.id, ...d.data(), lastModifiedAt: "" }));

const messagesQuery = (userId) =>
  userMessagesQuery(userId)
    .where("reply", "==", null)
    .orderBy("lastModifiedAt", "desc");
const repliesQuery = (userId) =>
  userMessagesQuery(userId)
    .where("reply.body", ">=", "")
    .orderBy("reply.body")
    .orderBy("lastModifiedAt", "desc");

export const fetchMessages = (
  userId: User["id"],
  { isReplied = true, startAfter = undefined, limit = 20 } = {}
): Promise<Array<Message>> => {
  const q = isReplied ? repliesQuery : messagesQuery;
  if (startAfter)
    return q(userId)
      .startAfter(startAfter)
      .limit(limit)
      .get()
      .then(getMessages);
  return q(userId).limit(limit).get().then(getMessages);
};

export const fetchUser = (userId: User["id"]) =>
  firestore
    .collection("users")
    .doc(userId)
    .get()
    .then((u) => ({ ...u.data(), id: u.id } as User));

export const observeUser = (userId: User["id"], onUser) =>
  firestore
    .collection("users")
    .doc(userId)
    .onSnapshot((u) => onUser({ ...u.data(), id: u.id } as User));
