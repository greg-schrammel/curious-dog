import app from "lib/firebase/client";
import "firebase/firestore";

export interface User {
  id: string;
  displayName: string;
  userName: string;
  photoURL: string;
  unrepliedCount: number;
}

const firestore = app.firestore();

export const fetchUser = (userId: User["id"]) =>
  userId
    ? firestore
        .collection("users")
        .doc(userId)
        .get()
        .then((u) => ({ ...u.data(), id: u.id } as User))
        .then((r) => r || null)
    : null;

export const observeUser = (userId: User["id"], onUser) =>
  firestore
    .collection("users")
    .doc(userId)
    .onSnapshot((u) => onUser({ ...u.data(), id: u.id } as User));
