import { graphql } from "./codegen";

export const getFriends = graphql(/* GraphQL */ `
  query getFriends {
    getFriends {
      name
      id
    }
  }
`);
