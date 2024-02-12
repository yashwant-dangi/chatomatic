const { createServer } = require('node:http');
const { createYoga, createSchema, createPubSub } = require("graphql-yoga");
const OAuth2Server = require('oauth2-server');

const pubSub = createPubSub()
const oauth = new OAuth2Server({
  model: require('./auth-model')
});

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
    login(user: String!): String!
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
    // login: () => []
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
      pubSub.publish(groupId, { messages: messages[groupId] || [] })
      return id;
    },
    login: () => {
      oauth.authenticate(request, response)
        .then((token) => {
          // The request was successfully authenticated.
        })
        .catch((err) => {
          // The request failed authentication.
        });

    },
    // signup: () => {

    // }
  },
  Subscription: {
    messages: {
      // subscribe: (parent, args, { pubsub, ...rest }) => {
      //   const { groupId } = args;
      //   // const channel = Math.random().toString(36).slice(2, 15);
      //   // onMessagesUpdates(() => pubsub.publish(channel, { messages }));
      //   setTimeout(() => pubSub.publish(groupId, { messages: messages[groupId] || [] }), 0);
      //   // setTimeout(() => pubsub.publish('windows', { messages: messages[groupId] || [] }), 0);
      //   return pubSub.asycnItertor(groupId);
      // },
      subscribe: (parent, args) => {
        const { groupId } = args;
        return pubSub.subscribe(groupId)
      },
      // resolve: (parent, args) => {
      //   console.log("in the resolve:", parent, args)
      //   const { groupId } = args;
      //   return messages[groupId]
      // }
    },
  },
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
  })
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.log(`Server on http://localhost:${4000}/`);
});
