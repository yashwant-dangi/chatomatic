const { createPubSub } = require("graphql-yoga");
const { Op } = require("sequelize");
const sequelize = require("../db");

const pubSub = createPubSub();

const resolvers = {
  Query: {
    messages: () => messages,
    getFriends: async () => {
      const user = await sequelize.models.user.findAll({
        where: {
          phone: {
            [Op.not]: "8398835630",
          },
        },
      });
      return user;
    },
    getAllMessages: async () => {
      const messages = await sequelize.models.message.findAll({
        where: {
          [Op.or]: [{ senderID: "1" }, { receiverID: "1" }],
        },
      });
      return messages;
    },
  },
  Mutation: {
    postMessage: async (parent, { content, senderID = "", groupId = "" }) => {
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
      await sequelize.models.message.create({
        content: content,
        senderID: senderID?.split("_")[1],
        receiverID: groupId,
      });
      pubSub.publish(groupId, { senderID, content });
      return true;
    },
    signup: async (parent, args, context) => {
      try {
        const { name, phone } = args;
        const { request, response } = context;

        await sequelize.models.user.create({
          name: name,
          phone: phone,
        });
        const userJWT = jwt.sign(
          {
            name: name,
            phone: phone,
          },
          "JWT_KEY"
        );
        console.log("userJWT", userJWT);
        request.session = {
          jwt: userJWT,
        };

        context.request.cookieStore?.set({
          name: "authorization",
          sameSite: "strict",
          secure: true,
          // domain: 'graphql-yoga.com',
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
          value: userJWT,
          httpOnly: true,
        });
      } catch (error) {
        console.log("error");
        console.log(error);
        throw error;
      }
    },
    login: async () => {
      const user = await sequelize.models.user.findOne({
        where: {
          phone: "8398835630",
        },
      });
      return user;
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
        return pubSub.subscribe(groupId);
      },
      resolve: (parent, args) => {
        // console.log("in the resolve:", parent, args)
        // const { groupId } = args;
        // return messages[groupId]
        return parent;
      },
    },
  },
};

exports.resolvers = resolvers;
