import * as admin from "firebase-admin";

export default admin?.apps[0] || admin?.initializeApp(); // get credentials from env

export const userIdFromToken = (tokenId) =>
  admin
    .auth()
    .verifyIdToken(tokenId)
    .then(({ uid }) => console.log(1) || uid);
