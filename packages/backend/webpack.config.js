const glob = require("glob");
const path = require("path");

const fileMatches = glob.sync("*/index.ts", {
  cwd: path.join(__dirname, "src/functions"),
});

const entry = fileMatches.reduce((previousValue, currentValue) => {
  const [folder] = currentValue.split("/");
  return {
    ...previousValue,
    [`${folder}/index`]: path.join(__dirname, `src/functions/${folder}/index.ts`),
  };
}, {});

module.exports = {
  mode: "production",
  target: "node",
  entry,
  devtool: false,
  output: {
    path: path.join(__dirname, "./.build"),
    libraryTarget: "commonjs",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          configFile: "tsconfig.build.json",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  externals: ["aws-sdk"],
};
