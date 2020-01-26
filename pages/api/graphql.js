import { ApolloServer } from "apollo-server-micro";
import { schema } from "../../apollo/schema";

const apolloServer = new ApolloServer({
  schema,
  context(ctx) {
    return ctx;
  }
});

export default apolloServer.createHandler({ path: "/api/graphql" });
