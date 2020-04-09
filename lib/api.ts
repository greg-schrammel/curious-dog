import app from "lib/firebase/client";
import "firebase/firestore";

interface User {
  id: string;
  name: string;
}

interface Question {
  hasAnswer: boolean;
  question: string;
  to: User["id"];
}

const firestore = app.firestore();
const questionsCollection = firestore.collection("questions");

export const ask = ({ question, to }) =>
  questionsCollection.add({
    question,
    to,
  });

export const answer = (questionId, answer) =>
  firestore.collection("answers").add({
    question: questionId,
    answer,
  });

const userQuestionsQuery = (
  userId: User["id"]
): firebase.firestore.Query<Question> =>
  (questionsCollection.where(
    "to",
    "==",
    userId
  ) as unknown) as firebase.firestore.Query<Question>;

export const onQuestion = (
  userId: User["id"],
  onQuestion: (
    newQuestion: Array<firebase.firestore.DocumentChange<Question>>
  ) => void
) => userQuestionsQuery(userId).onSnapshot((q) => onQuestion(q.docChanges()));

export const fetchAllQuestions = (
  userId: User["id"]
): Promise<Array<firebase.firestore.QueryDocumentSnapshot<Question>>> =>
  userQuestionsQuery(userId)
    .get()
    .then((u) => u.docs);

export const fetchQuestions = (
  userId: User["id"],
  { hasAnswer = true, limit = 20 } = {}
) =>
  userQuestionsQuery(userId)
    .where("hasAnswer", "==", true)
    // .limit(limit)
    .get()
    .then((questions) => questions.docs);

export const fetchUser = (userId: User["id"]) =>
  firestore
    .collection("users")
    .doc(userId)
    .get()
    .then((u) => ({ ...u.data(), id: u.id } as User));
