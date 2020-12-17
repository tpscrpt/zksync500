const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

require("dotenv/config");

module.exports = {
  entry: "./src/app.tsx",
  output: {
    path: path.resolve(__dirname, "dev"),
    filename: "[name].[hash:10].bundle.js",
    chunkFilename: "[name].[contenthash:10].chunk.js",
  },
  mode: "development",

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },

  devServer: {
    host: "localhost",
    disableHostCheck: true,
    compress: false,
    port: 8080,
    hot: true,
    contentBase: path.resolve(__dirname, "dev"),
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    },
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
            plugins: [["@babel/transform-runtime"]],
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
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: /node_modules/,
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

  plugins: [
    new webpack.EnvironmentPlugin([
      "NODE_ENV",
      "RPC_URL_1",
      "RPC_URL_4",
      "PROD_FORTMATIC_API_KEY",
      "DEV_FORTMATIC_API_KEY",
      "PORTIS_DAPP_ID",
    ]),
    new CopyPlugin({
      patterns: [{ from: "public/favicon.ico", to: "favicon.ico" }],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      filename: path.resolve(__dirname, "dev/index.html"),
    }),
  ],

  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};
