const functions = require("firebase-functions");
const admin = require("firebase-admin");

const app = admin.apps[0] || admin.initializeApp();
const firestore = app.firestore();

// creates a document in firestore to store extra data about the user
exports.onCreateUser = functions.auth.user().onCreate((user) =>
  firestore.collection("users").doc(user.uid).set(
    {
      displayName: user.displayName,
      photoURL: user.photoURL,
      unrepliedCount: 0,
    },
    { merge: true }
  )
);

const getUserDoc = (userId) => firestore.collection("users").doc(userId);

const updateUserUnrepliedCount = async (userId, howMuch) => {
  const userDoc = await getUserDoc(userId);
  const userUnrepliedCount = (await userDoc.get()).get("unrepliedCount");
  return userDoc.update({ unrepliedCount: userUnrepliedCount + howMuch });
};

exports.onUpdateMessage = functions.firestore
  .document("messages/{messageId}")
  .onUpdate(({ before, after }) => {
    if (!before.get("reply") && after.get("reply"))
      updateUserUnrepliedCount(before.get("to"), -1);
    return after.ref.set(
      { lastModifiedAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
  });

exports.onCreateMessage = functions.firestore
  .document("messages/{messageId}")
  .onCreate((message) =>
    Promise.all([
      message.ref.set(
        {
          reply: null,
          lastModifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      ),
      updateUserUnrepliedCount(message.get("to"), +1),
    ])
  );

exports.onDeleteMessage = functions.firestore
  .document("messages/{messageId}")
  .onDelete(async (message) => {
    if (!message.get("reply"))
      await updateUserUnrepliedCount(message.get("to"), -1);
  });
