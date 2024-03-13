import { graphql } from "./codegen";

export const login = graphql(/* GraphQL */ `
  mutation login($phone: String!) {
    login(phone: $phone) {
      id
      name
    }
  }
`);
