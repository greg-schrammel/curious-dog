const tweet = (body) => fetch("/api/tweet", { method: "POST", body });
export const tweetProfile = (text) => tweet(text);
