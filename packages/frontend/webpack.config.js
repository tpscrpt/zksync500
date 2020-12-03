const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

require("dotenv/config");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "[name].[contenthash:10].bundle.js",
    chunkFilename: "[name].[contenthash:10].chunk.js",
    path: path.resolve(__dirname, "dist"),
  },

  mode: "production",

  devtool: false,

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-typescript", "@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ["file-loader?name=[name].[ext]"], // ?name=[name].[ext] is only necessary to preserve the original file name
      },

      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      "NODE_ENV",
      "NOTIFY_ID",
      "BLOCKNATIVE_API_KEY",
      "BLOCKNATIVE_NETWORK",
      "FORTMATIC_API_KEY",
      "FORTMATIC_NETWORK",
      "INTEGRATIONS_DISABLED",
      "PLAID_ENVIRONMENT",
      "PLAID_CLIENT_ID",
      "DATA_PROVIDER_URL",
      "INFURA_API_KEY",
    ]),
    new CopyPlugin({
      patterns: [{ from: "public/favicon.ico", to: "favicon.ico" }],
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: path.resolve(__dirname, "dist/index.html"),
    }),
  ],
  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    fortmatic: "Fortmatic",
    wyre: "Wyre",
  },
};
