const { createServer } = require('node:http');
const { createYoga, createSchema, createPubSub } = require("graphql-yoga");
const jwt = require("jsonwebtoken");
const { useCookies } = require('@whatwg-node/server-plugin-cookies');
const sequelize = require('./src/db');


const pubSub = createPubSub()

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
    signup(email: String!, password:String!): String
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
    signup: (parent, args, context) => {
      const { email, password, name } = args;
      const { request, response } = context;
      const userJWT = jwt.sign(
        {
          id: name,
          email: email,
        },
        "JWT_KEY"
      );
      console.log("userJWT", userJWT)
      request.session = {
        jwt: userJWT,
      };

      context.request.cookieStore?.set({
        name: 'authorization',
        sameSite: 'strict',
        secure: true,
        // domain: 'graphql-yoga.com',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        value: userJWT,
        httpOnly: true
      })
    }
    ,
    login: () => {

    },

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
  }),
  plugins: [
    // (param1) => {
    //   console.log("param1", param1)
    //   return {
    //     onParse({ params }) {
    //       console.log('Parse started!', { params })
    //       return result => {
    //         console.log('Parse done!', { result })
    //       }
    //     },
    //     onExecute({ args }) {
    //       console.log('Execution started!', { args })
    //       return {
    //         onExecuteDone({ result }) {
    //           console.log('Execution done!', { result })
    //         }
    //       }
    //     }
    //   }
    // }
    useCookies(),
  ]
})

const server = createServer(yoga)

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log('Database connection OK!');
  } catch (error) {
    console.log('Unable to connect to the database:');
    console.log(error.message);
    process.exit(1);
  }
}

const start = async () => {
  console.log("Starting up.......");

  await assertDatabaseConnectionOk();

  server.listen(4000, () => {
    console.log(`Server on http://localhost:${4000}/`);
  });
}

start();
