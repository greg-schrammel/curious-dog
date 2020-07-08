import app from "lib/firebase/client";
import "firebase/firestore";
import { User } from "./user";

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

const userMessagesQuery = (userId: User["id"]) =>
  messagesCollection.where("to", "==", userId);

export const unrepliedMessagesQuery = (userId) =>
  userMessagesQuery(userId)
    .where("reply", "==", null)
    .orderBy("lastModifiedAt", "desc");

export const repliedMessagesQuery = (userId) =>
  userMessagesQuery(userId)
    .where("reply.body", ">=", "")
    .orderBy("reply.body")
    .orderBy("lastModifiedAt", "desc");

const getMessages = (s) =>
  s.docs.map((d) => ({ id: d.id, ...d.data(), lastModifiedAt: "" }));

export const fetchRepliedMessages = (userId, limit) =>
  repliedMessagesQuery(userId).limit(limit).get().then(getMessages);

export const fetchMessage = (messageId) =>
  messageId
    ? messagesCollection
        .doc(messageId)
        .get()
        .then(
          (s) => ({ ...s.data(), lastModifiedAt: "" }),
          () => null
        )
        .then((r) => r || null)
    : null;

export const sendMessage = (message, to) =>
  messagesCollection.add({ body: message, to });

export const replyMessage = (messageId: Message["id"], reply: Reply) =>
  messagesCollection.doc(messageId).update({ reply });

export const deleteMessage = (messageId) =>
  messagesCollection.doc(messageId).delete();
