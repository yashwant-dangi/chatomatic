
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: "http://localhost:4000/graphql",
    documents: "src/**/*.ts",
    generates: {
        "src/gql/codegen/": {
            preset: "client",
            plugins: []
        },
        // "./graphql.schema.json": {
        //     plugins: ["introspection"]
        // }
    }
};

export default config;
