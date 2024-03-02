exports.typeDefs = /* GraphQL */ `
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
  phone: Float
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