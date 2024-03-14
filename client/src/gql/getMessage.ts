import { graphql } from "./codegen";

export const messages = graphql(/* GraphQL */ `
  subscription messages($groupId: String!) {
    messages(groupId: $groupId) {
      content
      senderID
    }
  }
`);
