import Twitter from "twit";
import admin, { userIdFromToken } from "lib/firebase/admin";
import { NextApiRequest, NextApiResponse } from "next";

const usersCollection = admin.firestore().collection("users");

export default async (
  { body, headers }: NextApiRequest,
  res: NextApiResponse
) => {
  // if (method !== "POST") return;
  const tokenId = headers.authorization?.split(" ")[1];

  const userId = await userIdFromToken(tokenId);
  const credentials = await usersCollection
    .doc(userId)
    .collection("credentials")
    .doc("twitter")
    .get()
    .then((s) => s.data());

  const twitter = new Twitter({
    consumer_key: process.env.TWITTER_KEY,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: credentials.twitter.token,
    access_token_secret: credentials.twitter.secret,
  });

  const tr = await new Promise((r) =>
    twitter.post("statuses/update", { status: body }, (err, data, response) =>
      r({ err, data, response })
    )
  );
  return res.status(tr.response.statusCode).json(tr);
};
