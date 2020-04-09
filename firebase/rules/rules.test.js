const fs = require("fs");
const { describe } = require("riteway");
const { initializeTestApp, loadFirestoreRules } = require("@firebase/testing");

const makeFirestoreInstance = async (auth, data) => {
  const projectId = `ihaaa${Math.round(Math.random() * 1000)}`;
  const app = initializeTestApp({
    projectId,
    auth,
  });

  const firestore = app.firestore();
  if (data)
    await Promise.all(
      Object.entries(data).map(([key, value]) => firestore.doc(key).set(value))
    );

  await loadFirestoreRules({
    projectId,
    rules: fs.readFileSync("./rules/firestore.rules"),
  });

  return firestore;
};

const isDenied = async (fn, ...args) =>
  fn(...args)
    .then(() => false)
    .catch(() => true);

describe("Users Rules", async (assert) => {
  {
    const firestore = await makeFirestoreInstance();
    const listUsers = () => firestore.collection("users").get();
    const createUser = () => firestore.collection("users").add({});

    assert({
      given: "list users",
      should: "allow",
      actual: await isDenied(listUsers),
      expected: false,
    });

    assert({
      given: "create a user",
      should: "allow",
      actual: await isDenied(createUser),
      expected: false,
    });
  }
  {
    const someUserId = "idOfSomeUserUhul";
    const authUserId = "anotherUserId";
    const firestore = await makeFirestoreInstance(
      { uid: authUserId },
      { [`users/${someUserId}`]: {}, [`users/${authUserId}`]: {} }
    );
    const updateUser = (uid) =>
      firestore
        .collection("users")
        .doc(uid)
        .update({ displayName: "dsada" });

    assert({
      given: "write to a user diferent from auth",
      should: "not allow",
      actual: await isDenied(updateUser, someUserId),
      expected: true,
    });
    assert({
      given: "write to same user of auth",
      should: "allow",
      actual: await isDenied(updateUser, authUserId),
      expected: false,
    });
  }
});

describe("Questions Rules", async (assert) => {
  const id_of_someQuestion = "id_of_someQuestion";
  const id_of_questionWithAddressee = "id_of_questionWithAddressee";
  const id_of_questionWithAnswer = "id_of_questionWithAnswer";
  const authUserId = "authUserId";
  {
    const firestore = await makeFirestoreInstance(
      { uid: authUserId },
      {
        [`questions/${id_of_questionWithAddressee}`]: {
          to: authUserId,
          hasAnswer: false,
        },
        [`questions/${id_of_someQuestion}`]: { hasAnswer: false },
        [`questions/${id_of_questionWithAnswer}`]: { hasAnswer: true },
      }
    );

    const questionsCollection = firestore.collection("questions");
    const createQuestion = () => questionsCollection.add({});
    const updateQuestion = (id) =>
      questionsCollection.doc(id).update({ to: "dsada" });
    const deleteQuestion = (id) => questionsCollection.doc(id).delete();
    const getQuestion = (id) => questionsCollection.doc(id).get();

    assert({
      given: "read a question not answered and not for the auth user",
      should: "not allow",
      actual: await isDenied(getQuestion, id_of_someQuestion),
      expected: true,
    });
    assert({
      given: "read a question answered and not for the auth user",
      should: "allow",
      actual: await isDenied(getQuestion, id_of_questionWithAnswer),
      expected: false,
    });
    assert({
      given: "read a question not answered but for the auth user",
      should: "allow",
      actual: await isDenied(getQuestion, id_of_questionWithAddressee),
      expected: false,
    });
    assert({
      given: "create a question",
      should: "allow",
      actual: await isDenied(createQuestion),
      expected: false,
    });
    assert({
      given: "update question",
      should: "not allow",
      actual: await isDenied(updateQuestion, id_of_someQuestion),
      expected: true,
    });
    assert({
      given: "delete question",
      should: "not allow",
      actual: await isDenied(deleteQuestion, id_of_someQuestion),
      expected: true,
    });
    assert({
      given: "delete question with auth as addressee",
      should: "allow",
      actual: await isDenied(deleteQuestion, id_of_questionWithAddressee),
      expected: false,
    });
  }
  {
    const userId = "greg";
    const questionsCollection = (
      await makeFirestoreInstance(
        { uid: "adasdas" },
        {
          [`questions/${id_of_someQuestion}`]: {
            to: userId,
            hasAnswer: false,
          },
          [`questions/${id_of_someQuestion + "adsad"}`]: {
            to: userId,
            hasAnswer: false,
          },
        }
      )
    ).collection("questions");

    const query = (to) =>
      questionsCollection
        .where("to", "==", to)
        .where("hasAnswer", "==", true)
        .get();

    assert({
      given: "get when there is no question answered and its not the addressee",
      should: "allow",
      actual: await isDenied(query, userId),
      expected: false,
    });
  }
});

describe("Answers Rules", async (assert) => {
  const authUserId = "someUserId";
  const questionToAuthUserId = "questionToAuthUserId";

  const firestore = await makeFirestoreInstance(
    { uid: authUserId },
    { [`questions/${questionToAuthUserId}`]: { to: authUserId } }
  );

  const listAnswers = () => firestore.collection("answers").get();
  const createAnswer = () => firestore.collection("answers").add({});

  assert({
    given: "list answers",
    should: "allow",
    actual: await isDenied(listAnswers),
    expected: false,
  });
  assert({
    given: "create answer for question to auth user",
    should: "allow",
    actual: await isDenied(createAnswer, { question: questionToAuthUserId }),
    expected: true,
  });
  assert({
    given: "create answer for question NOT to auth user",
    should: "NOT allow",
    actual: await isDenied(createAnswer),
    expected: true,
  });
});
