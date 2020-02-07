import fs from 'fs';
import { describe } from 'riteway';
import { initializeTestApp, loadFirestoreRules } from '@firebase/testing';

const makeFirestoreInstance = async (auth, data) => {
  const projectId = `ihaaa${Math.round(Math.random() * 1000)}`;
  const app = initializeTestApp({
    projectId,
    auth
  });

  const firestore = app.firestore();
  if (data)
    await Promise.all(Object.entries(data).map(([key, value]) => firestore.doc(key).set(value)));

  await loadFirestoreRules({
    projectId,
    rules: fs.readFileSync('./firebase/firestore.rules')
  });

  return firestore;
};

const isDenied = async (fn, ...args) =>
  fn(...args)
    .then(() => false)
    .catch(() => true);

describe('Users Rules', async assert => {
  {
    const firestore = await makeFirestoreInstance();
    const listUsers = () => firestore.collection('users').get();
    const createUser = () => firestore.collection('users').add({});

    assert({
      given: 'list users',
      should: 'allow',
      actual: await isDenied(listUsers),
      expected: false
    });

    assert({
      given: 'create a user',
      should: 'allow',
      actual: await isDenied(createUser),
      expected: false
    });
  }
  {
    const someUserId = 'idOfSomeUserUhul';
    const authUserId = 'anotherUserId';
    const firestore = await makeFirestoreInstance(
      { uid: authUserId },
      { [`users/${someUserId}`]: {}, [`users/${authUserId}`]: {} }
    );
    const updateUser = uid =>
      firestore
        .collection('users')
        .doc(uid)
        .update({ displayName: 'dsada' });

    assert({
      given: 'write to a user diferent from auth',
      should: 'not allow',
      actual: await isDenied(updateUser, someUserId),
      expected: true
    });
    assert({
      given: 'write to same user of auth',
      should: 'allow',
      actual: await isDenied(updateUser, authUserId),
      expected: false
    });
  }
});

describe('Questions Rules', async assert => {
  const someQuestionId = 'someQuestionId';
  const questionWithAddresseeId = 'questionWithAddresseeId';
  const questionWithAnswerId = 'questionWithAnswerId';
  const authUserId = 'authUserId';

  const firestore = await makeFirestoreInstance(
    { uid: authUserId },
    {
      [`questions/${questionWithAddresseeId}`]: { to: authUserId, hasAnswer: false },
      [`questions/${someQuestionId}`]: { hasAnswer: false },
      [`questions/${questionWithAnswerId}`]: { hasAnswer: true }
    }
  );

  const questionsCollection = firestore.collection('questions');
  const createQuestion = () => questionsCollection.add({});
  const updateQuestion = id => questionsCollection.doc(id).update({ to: 'dsada' });
  const deleteQuestion = id => questionsCollection.doc(id).delete();
  const getQuestion = id => questionsCollection.doc(id).get();

  assert({
    given: 'read a question not answered and not for the auth user',
    should: 'not allow',
    actual: await isDenied(getQuestion, someQuestionId),
    expected: true
  });
  assert({
    given: 'read a question answered but not for the auth user',
    should: 'allow',
    actual: await isDenied(getQuestion, questionWithAnswerId),
    expected: false
  });
  assert({
    given: 'read a question not answered but for the auth user',
    should: 'allow',
    actual: await isDenied(getQuestion, questionWithAddresseeId),
    expected: false
  });
  assert({
    given: 'create a question',
    should: 'allow',
    actual: await isDenied(createQuestion),
    expected: false
  });
  assert({
    given: 'update question',
    should: 'not allow',
    actual: await isDenied(updateQuestion, someQuestionId),
    expected: true
  });
  assert({
    given: 'delete question',
    should: 'not allow',
    actual: await isDenied(deleteQuestion, someQuestionId),
    expected: true
  });
  assert({
    given: 'delete question with auth as addressee',
    should: 'allow',
    actual: await isDenied(deleteQuestion, questionWithAddresseeId),
    expected: false
  });
});

describe('Answers Rules', async assert => {
  const authUserId = 'someUserId';
  const questionToAuthUserId = 'questionToAuthUserId';

  const firestore = await makeFirestoreInstance(
    { uid: authUserId },
    { [`questions/${questionToAuthUserId}`]: { to: authUserId } }
  );

  const listAnswers = () => firestore.collection('answers').get();
  const createAnswer = () => firestore.collection('answers').add({});

  assert({
    given: 'list answers',
    should: 'allow',
    actual: await isDenied(listAnswers),
    expected: false
  });
  assert({
    given: 'create answer for question to auth user',
    should: 'allow',
    actual: await isDenied(createAnswer, { question: questionToAuthUserId }),
    expected: true
  });
  assert({
    given: 'create answer for question NOT to auth user',
    should: 'NOT allow',
    actual: await isDenied(createAnswer),
    expected: true
  });
});
