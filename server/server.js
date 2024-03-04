const { createServer } = require('node:http');
const { createYoga, createSchema } = require("graphql-yoga")
const jwt = require("jsonwebtoken");
const { useCookies } = require('@whatwg-node/server-plugin-cookies');
const { useServer } = require('graphql-ws/lib/use/ws');
const { WebSocketServer } = require('ws');
const { typeDefs } = require('./src/schema/typeDef')
const { resolvers } = require('./src/schema/resolvers')
const sequelize = require('./src/db');

const messages = {};

const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

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
