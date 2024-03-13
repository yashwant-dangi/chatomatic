import { graphql } from "./codegen";

export const post_Message = graphql(/* GraphQL */ `
  mutation postMessage(
    $senderID: String!
    $content: String!
    $groupId: String!
  ) {
    postMessage(senderID: $senderID, content: $content, groupId: $groupId)
  }
`);
