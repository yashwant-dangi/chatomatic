const { GraphQLServer, PubSub } = require("graphql-yoga");

const messages = {};

const typeDefs = `
type Message {
    id: ID!
    user: String!
    content: String!
}
type Query {
    messages: [Message!]
}
type Mutation {
    postMessage(user: String!, content: String!, groupId: String!): ID!
}
type Subscription {
  messages(groupId: String): [Message!]
  chats: String!
}
`;

const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (parent, { user, content, groupId }) => {
      const id = messages?.[groupId]?.length || 0;
      if (!messages[groupId]) {
        messages[groupId] = []
      }
      messages[groupId]?.push({
        id,
        user,
        content,
      });
      // subscribers.forEach((fn) => fn());
      pubsub.publish(groupId, { messages: messages[groupId] || [] })
      return id;
    },
  },
  Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub, ...rest }) => {
        const { groupId } = args;
        // const channel = Math.random().toString(36).slice(2, 15);
        // onMessagesUpdates(() => pubsub.publish(channel, { messages }));
        setTimeout(() => pubsub.publish(groupId, { messages: messages[groupId] || [] }), 0);
        return pubsub.asyncIterator(groupId);
      },
    },
  },
};

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } });

server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`);
});
