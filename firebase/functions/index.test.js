const { describe } = require("riteway");
const firebaseFunctionsTest = require("firebase-functions-test");
const admin = require("firebase-admin");
const { onCreateMessage, onDeleteMessage, onCreateUser } = require(".");

const test = firebaseFunctionsTest(
  {
    databaseURL: "https://curiousdog-test.firebaseio.com",
    projectId: "curiousdog-test",
    storageBucket: "curiousdog-test.appspot.com",
  },
  "./curiousdog-test-firebase.json"
);

const app = admin.apps[0] || admin.initializeApp();
const firestore = app.firestore();

const usersCollection = firestore.collection("users");
const messagesCollection = firestore.collection("messages");

const createUser = (user = {}) => usersCollection.add(user);

// Message
describe("onCreateMessage", async (assert) => {
  const wrapped = test.wrap(onCreateMessage);

  const user = { unrepliedCount: 0, displayName: "namenamename" };
  const userId = (await createUser(user)).id;

  const message = { to: userId, body: "asda" };
  const messageId = "someMessageId";

  const messageSnap = test.firestore.makeDocumentSnapshot(
    message,
    `messages/${messageId}`
  );

  await wrapped(messageSnap);

  const actualUser = await usersCollection.doc(userId).get();

  assert({
    given: "a message to a user",
    should: "increment user unrepliedCount",
    actual: actualUser.data(),
    expected: { ...user, unrepliedCount: user.unrepliedCount + 1 },
  });
});

describe("onDeleteMessage", async (assert) => {
  const deleteMessage = test.wrap(onDeleteMessage);

  const user = { unrepliedCount: 3, displayName: "namenamename" };
  const messageId = "someMessageId";

  const userId = (await createUser(user)).id;

  const messageSnap = test.firestore.makeDocumentSnapshot(
    { to: userId, body: "sads", reply: null },
    `messages/${messageId}`
  );

  await deleteMessage(messageSnap);
  const actualUser = await usersCollection.doc(userId).get();

  assert({
    given: "a message was deleted",
    should: "decrement user unrepliedCount",
    actual: actualUser.data(),
    expected: { ...user, unrepliedCount: user.unrepliedCount - 1 },
  });
});

describe("onCreateUser", async (assert) => {
  const wrapped = test.wrap(onCreateUser);

  const authUser = test.auth.exampleUserRecord();

  await wrapped(authUser);

  const actualUser = await usersCollection.doc(authUser.uid).get();

  // assert({
  //   given: "a auth user",
  //   should: "create a document with auth user uid and info",
  //   actual: actualUser,
  //   expected: {
  //     authUser:
  //   },
  // });
  assert({
    given: "a auth user",
    should: "create a document with auth user uid and info",
    actual: actualUser.get("displayName"),
    expected: authUser.displayName,
  });
});
