import * as admin from "firebase-admin";

export default admin.apps[0] || admin.initializeApp(); // get credentials from env

export const userIdFromToken = (tokenId) => {
  if (!tokenId) return Promise.reject(new Error("no token"));
  return admin
    .auth()
    .verifyIdToken(tokenId)
    .then(({ uid }) => uid);
};
