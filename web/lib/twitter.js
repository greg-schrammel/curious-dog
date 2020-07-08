const tweet = (body) => fetch("/api/tweet", { method: "POST", body });
export default tweet;
