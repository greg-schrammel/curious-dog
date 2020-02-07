import firebase from '../firebase/app';
import 'firebase/firestore';

const firestore = firebase.firestore();
const questionsCollection = firestore.collection('questions');
export const ask = ({ question, to }) =>
  questionsCollection.add({
    question,
    to
  });

export const answer = (questionId, answer) =>
  firestore.collection('answers').add({
    question: questionId,
    answer
  });

const userQuestionsQuery = userId => questionsCollection.where('to', '==', userId);

export const onQuestion = (userId, onQuestion) =>
  userQuestionsQuery(userId).onSnapshot(q => onQuestion(q.docChanges()));

export const fetchAllQuestions = userId =>
  userQuestionsQuery(userId)
    .get()
    .then(u => u.docs);

export const fetchQuestions = (userId, hasAnswer) =>
  userQuestionsQuery(userId)
    .where('hasAnswer', '==', hasAnswer)
    .limit(20)
    .get()
    .then(questions => questions.docs);

export const fetchUser = userId =>
  firestore
    .collection('users')
    .doc(userId)
    .get()
    .then(u => !!u.data() && { ...u.data(), id: userId });
