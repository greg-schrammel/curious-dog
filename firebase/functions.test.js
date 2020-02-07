import { describe } from 'riteway';
import firebaseFunctionsTest from 'firebase-functions-test';
import admin from './admin';
import {
  onCreateQuestion,
  onDeleteAnswer,
  onDeleteQuestion,
  onCreateAnswer,
  onCreateUser
} from './functions';

const test = firebaseFunctionsTest(
  {
    databaseURL: 'https://curiousdog-test.firebaseio.com',
    projectId: 'curiousdog-test',
    storageBucket: 'curiousdog-test.appspot.com'
  },
  './curiousdog-test-firebase.json'
);

const firestore = admin.firestore();
const usersCollection = firestore.collection('users');
const answersCollection = firestore.collection('answers');
const questionsCollection = firestore.collection('questions');

const createUser = (user = {}) => usersCollection.add(user);
const createAnswer = (answer = {}) => answersCollection.add(answer);
const createQuestion = (question = {}) => questionsCollection.add(question);

// Question
describe('onCreateQuestion', async assert => {
  const wrapped = test.wrap(onCreateQuestion);

  const user = { unanswered_count: 0, displayName: 'namenamename' };

  const userId = (await createUser(user)).id;
  const questionSnap = test.firestore.makeDocumentSnapshot(
    { to: userId },
    `questions/someQuestionId`
  );

  await wrapped(questionSnap);
  const actualUser = await usersCollection.doc(userId).get();

  assert({
    given: 'a question to a user',
    should: 'increment user unanswered_count',
    actual: actualUser.data(),
    expected: { ...user, unanswered_count: user.unanswered_count + 1 }
  });
});

describe('onDeleteQuestion', async assert => {
  const wrapped = test.wrap(onDeleteQuestion);

  const user = { unanswered_count: 3, displayName: 'namenamename' };

  const userId = (await createUser(user)).id;
  const questionSnap = test.firestore.makeDocumentSnapshot(
    { to: userId },
    `questions/someQuestionId`
  );

  await wrapped(questionSnap);
  const actualUser = await usersCollection.doc(userId).get();

  assert({
    given: 'a user question was deleted',
    should: 'decrement user unanswered_count',
    actual: actualUser.data(),
    expected: { ...user, unanswered_count: user.unanswered_count - 1 }
  });
});

// Answer
describe('onCreateAnswer', async assert => {
  const wrapped = test.wrap(onCreateAnswer);

  const user = { unanswered_count: 42, displayName: 'namenamename' };

  const userId = (await createUser(user)).id;
  const questionId = (await createQuestion()).id;
  const answer = await createAnswer({
    answer: 'asdasd',
    question: questionId
  });

  await wrapped(await answer.get(), {
    auth: { uid: userId }
  });

  assert({
    given: 'a new answer',
    should: "set the answer 'by' to the current authenticated user id",
    actual: (await answersCollection.doc(answer.id).get()).get('by'),
    expected: userId
  });
  assert({
    given: 'a new answer',
    should: "set its question 'hasAnswer' to true",
    actual: (await questionsCollection.doc(questionId).get()).get('hasAnswer'),
    expected: true
  });
  assert({
    given: 'a new answer',
    should: 'increment unanswered_count from user who answered it',
    actual: (await usersCollection.doc(userId).get()).data(),
    expected: { ...user, unanswered_count: user.unanswered_count + 1 }
  });

  // assert({
  //   given: "the question was not for the current authenticated user",
  //   should: "fail to create the answer",
  //   actual:
  //   expected:
  // });
});

describe('onDeleteAnswer', async assert => {
  const wrapped = test.wrap(onDeleteAnswer);

  const user = { unanswered_count: 1002, displayName: 'namenamename' };

  const questionId = (await createQuestion()).id;
  const userId = (await createUser(user)).id;

  const answerSnap = test.firestore.makeDocumentSnapshot(
    { by: userId, question: questionId },
    `answer/someAnswerId`
  );

  await wrapped(answerSnap);

  assert({
    given: 'an answer was deleted',
    should: 'decrement user unanswered_count from who answered it',
    actual: (await usersCollection.doc(userId).get()).data(),
    expected: { ...user, unanswered_count: user.unanswered_count - 1 }
  });
  assert({
    given: 'an answer was deleted',
    should: 'set its question hasAnswer back to false',
    actual: (await questionsCollection.doc(questionId).get()).get('hasAnswer'),
    expected: false
  });
});

describe('onCreateUser', async assert => {
  const wrapped = test.wrap(onCreateUser);

  const authUser = test.auth.exampleUserRecord();

  await wrapped(authUser);

  const actualUser = await usersCollection.doc(authUser.uid).get();

  assert({
    given: 'a auth user',
    should: 'create a document with auth user uid and info',
    actual: actualUser.exists,
    expected: true
  });
  assert({
    given: 'a auth user',
    should: 'create a document with auth user uid and info',
    actual: actualUser.get('displayName'),
    expected: authUser.displayName
  });
});
