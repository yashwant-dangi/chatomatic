import { graphql } from "./codegen";

export const getAllMessages = graphql(/* GraphQL */ `
  query getAllMessages {
    getAllMessages {
      content
      senderID
      receiverID
      createdAt
    }
  }
`);
