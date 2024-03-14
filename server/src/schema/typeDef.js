exports.typeDefs = /* GraphQL */ `
  type Message {
    senderID: String!
    content: String!
    receiverID: String!
    createdAt: String!
  }
  type Query {
    messages: [Message!]
    getFriends: [User]
    getAllMessages: [Message]
  }
  type User {
    id: String!
    name: String!
    phone: Float
  }
  type Mutation {
    postMessage(senderID: String!, content: String!, groupId: String!): Boolean!
    signup(name: String!, phone: String!): String
    login(phone: String!): User!
  }
  type Subscription {
    messages(groupId: String): Message!
    chats: String!
  }
`;
