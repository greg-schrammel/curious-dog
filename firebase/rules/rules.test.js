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

const isAllowed = async (fn, ...args) =>
  fn(...args)
    .then(() => true)
    .catch(() => false);

describe("Users Rules", async (assert) => {
  {
    const firestore = await makeFirestoreInstance();
    const listUsers = () => firestore.collection("users").get();
    const createUser = () => firestore.collection("users").add({});

    assert({
      given: "list users",
      should: "allow",
      actual: await isAllowed(listUsers),
      expected: true,
    });

    assert({
      given: "create a user",
      should: "allow",
      actual: await isAllowed(createUser),
      expected: true,
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
      firestore.collection("users").doc(uid).update({ displayName: "dsada" });

    assert({
      given: "write to a user diferent from auth",
      should: "not allow",
      actual: await isAllowed(updateUser, someUserId),
      expected: false,
    });
    assert({
      given: "write to same user of auth",
      should: "allow",
      actual: await isAllowed(updateUser, authUserId),
      expected: true,
    });
  }
});

describe("Messages Rules", async (assert) => {
  const idOfSomeMessage = "idOfSomeMessage";
  const idOfMessageToAuthUser = "idOfMessageToAuthUser";
  const idOfMessageWithReply = "idOfMessageWithReply";
  const idOfMessageWithReplyAndToAuthUser = "idOfMessageWithReplyAndToAuthUser";
  const authUserId = "authUserId";

  const makeValidMessage = (msg) => ({ to: "sdad", body: "dsad", ...msg });
  const firestore = await makeFirestoreInstance(
    { uid: authUserId },
    {
      [`messages/${idOfMessageToAuthUser}`]: makeValidMessage({
        to: authUserId,
        reply: null,
      }),
      [`messages/${idOfSomeMessage}`]: makeValidMessage(),
      [`messages/${idOfMessageWithReply}`]: makeValidMessage({
        reply: { body: "dasdasd" },
      }),
      [`messages/${idOfMessageWithReplyAndToAuthUser}`]: makeValidMessage({
        reply: { body: "dasdasd" },
        to: authUserId,
      }),
    }
  );

  const messagesCollection = firestore.collection("messages");
  const createMessage = (msg) => messagesCollection.add(msg);
  const updateMessageBody = (id) =>
    messagesCollection.doc(id).update({ body: "dsada" });
  const updateMessageReply = (id) =>
    messagesCollection.doc(id).update({ reply: { body: "aaaa" } });
  const deleteMessage = (id) => messagesCollection.doc(id).delete();
  const getMessage = (id) => messagesCollection.doc(id).get();

  assert({
    given: "read a message not replied and not for the auth user",
    should: "not allow",
    actual: await isAllowed(getMessage, idOfSomeMessage),
    expected: false,
  });
  assert({
    given: "read a message replied and not for the auth user",
    should: "allow",
    actual: await isAllowed(getMessage, idOfMessageWithReply),
    expected: true,
  });
  assert({
    given: "read a message not replied but for the auth user",
    should: "allow",
    actual: await isAllowed(getMessage, idOfMessageToAuthUser),
    expected: true,
  });
  assert({
    given: "create a message with body and to",
    should: "allow",
    actual: await isAllowed(createMessage, makeValidMessage()),
    expected: true,
  });
  assert({
    given: "create a message without body",
    should: "not allow",
    actual: await isAllowed(createMessage, { to: "dasdas" }),
    expected: false,
  });
  assert({
    given: "update message body",
    should: "not allow",
    actual: await isAllowed(updateMessageBody, idOfSomeMessage),
    expected: false,
  });
  assert({
    given: "add reply to message to you",
    should: "allow",
    actual: await isAllowed(updateMessageReply, idOfMessageToAuthUser),
    expected: true,
  });
  assert({
    given: "add reply to message not to you",
    should: "not allow",
    actual: await isAllowed(updateMessageReply, idOfSomeMessage),
    expected: false,
  });
  assert({
    given: "change message reply",
    should: "not allow",
    actual: await isAllowed(
      updateMessageReply,
      idOfMessageWithReplyAndToAuthUser
    ),
    expected: false,
  });
  assert({
    given: "delete message not for you",
    should: "not allow",
    actual: await isAllowed(deleteMessage, idOfSomeMessage),
    expected: false,
  });
  assert({
    given: "delete message for you",
    should: "allow",
    actual: await isAllowed(deleteMessage, idOfMessageToAuthUser),
    expected: true,
  });
});
