const { createServer } = require('node:http');
const { createYoga, createSchema, createPubSub } = require("graphql-yoga");
const jwt = require("jsonwebtoken");
const { useCookies } = require('@whatwg-node/server-plugin-cookies');
const sequelize = require('./src/db');
const { Op } = require('sequelize');
const { useServer } = require('graphql-ws/lib/use/ws');
const { WebSocketServer } = require('ws');


const pubSub = createPubSub()

const messages = {};

const typeDefs = `
type Message {
    senderId: String!
    content: String!
}
type Query {
    messages: [Message!]
    getFriends: [User]
}
type User {
  id: String!
  name: String!
}
type Mutation {
    postMessage(senderId: String!, content: String!, groupId: String!): Boolean!
    signup(name: String!, phone: String!): String
    login(phone: String!): User!
}
type Subscription {
  messages(groupId: String): Message!
  chats: String!
}
`;

const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

const resolvers = {
  Query: {
    messages: () => messages,
    getFriends: async () => {
      const user = await sequelize.models.user.findAll({
        where: {
          phone: {
            [Op.not]: '8398835630'
          }
        }
      })
      return user;
    },
  },
  Mutation: {
    postMessage: (parent, { senderId, content, groupId }) => {
      // const id = messages?.[groupId]?.length || 0;
      // if (!messages[groupId]) {
      //   messages[groupId] = []
      // }
      // messages[groupId]?.push({
      //   id,
      //   user,
      //   content,
      // });
      // subscribers.forEach((fn) => fn());
      pubSub.publish(groupId, { senderId, content })
      return true;
    },
    signup: async (parent, args, context) => {
      try {
        const { name, phone } = args;
        const { request, response } = context;

        await sequelize.models.user.create({
          name: name,
          phone: phone
        })
        const userJWT = jwt.sign(
          {
            name: name,
            phone: phone,
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
      catch (error) {
        console.log("error")
        console.log(error)
        throw error;
      }
    },
    login: async () => {
      const user = await sequelize.models.user.findOne({
        where: {
          phone: "8398835630"
        }
      })
      return user;
    }
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
      resolve: (parent, args) => {
        // console.log("in the resolve:", parent, args)
        // const { groupId } = args;
        // return messages[groupId]
        return parent;
      }
    },
  },
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
  }),
  graphiql: {
    subscriptionsProtocol: 'WS'
  },
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

const wsServer = new WebSocketServer({
  server: server,
  path: yoga.graphqlEndpoint
})

useServer(
  {
    execute: (args) => args.rootValue.execute(args),
    subscribe: (args) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, msg) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } = yoga.getEnveloped({
        ...ctx,
        req: ctx.extra.request,
        socket: ctx.extra.socket,
        params: msg.payload
      })

      const args = {
        schema,
        operationName: msg.payload.operationName,
        document: parse(msg.payload.query),
        variableValues: msg.payload.variables,
        contextValue: await contextFactory(),
        rootValue: {
          execute,
          subscribe
        }
      }
      console.log("🚀 ~ onSubscribe: ~ args:", args)

      const errors = validate(args.schema, args.document)
      console.log("🚀 ~ onSubscribe: ~ errors:", errors)

      if (errors.length) return errors
      return args
    }
  },
  wsServer
)


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
