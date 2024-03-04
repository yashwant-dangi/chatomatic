const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require('path')

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:8080/",
    // publicPath: "/",
  },

  resolve: {
    extensions: [".jsx", ".js", ".json"],
    alias: {
      "libs": path.resolve(__dirname, "src/libs"),
      "components": path.resolve(__dirname, "src/components"),
      "gql": path.resolve(__dirname, "src/gql")
    }
  },

  devServer: {
    port: 8080,
    historyApiFallback: true,
    hot: true,
  },

  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", 'postcss-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "starter",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};
