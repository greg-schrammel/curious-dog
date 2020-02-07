const functions = require('firebase-functions');
const admin = require('./admin').default;

const firestore = admin.firestore();

// creates a document in firestore to store extra data about the user
exports.onCreateUser = functions.auth.user().onCreate(user =>
  firestore
    .collection('users')
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      photoURL: user.photoURL,
      unanswered_count: 0
    })
);

const setQuestionHasAnswer = (questionId, hasAnswer) =>
  firestore.doc(`questions/${questionId}`).update({ hasAnswer });

const getUserDoc = userId => firestore.collection('users').doc(userId);

const updateUserUnansweredCount = async (userId, howMuch) => {
  const userDoc = await getUserDoc(userId);
  const userUnansweredCount = (await userDoc.get()).get('unanswered_count');
  return userDoc.update({ unanswered_count: userUnansweredCount + howMuch });
};

// adds a 'by' to the answer with the user uid that answered it
// and sets hasAnswer to true in the question
// just to be easier to query after
exports.onCreateAnswer = functions.firestore
  .document('answers/{answerId}')
  .onCreate((answer, ctx) =>
    answer.ref
      .set({ by: ctx.auth.uid }, { merge: true })
      .then(() =>
        Promise.all([
          setQuestionHasAnswer(answer.get('question'), true),
          updateUserUnansweredCount(ctx.auth.uid, +1)
        ])
      )
  );

exports.onDeleteAnswer = functions.firestore
  .document('answers/{answerId}')
  .onDelete(answer =>
    Promise.all([
      updateUserUnansweredCount(answer.get('by'), -1),
      setQuestionHasAnswer(answer.get('question'), false)
    ])
  );

exports.onDeleteQuestion = functions.firestore
  .document('questions/{questionId}')
  .onDelete(question => updateUserUnansweredCount(question.get('to'), -1));

// increments the user unanswered_count
// thats for tracking how many unanswered questions a user has
// without having to query all questions everytime
// TODO: find better way to track - is it that expansive to query?
exports.onCreateQuestion = functions.firestore
  .document('questions/{questionId}')
  .onCreate(question => updateUserUnansweredCount(question.get('to'), +1));

// TODO: send notification on new question, already has a service worker
