const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
  },
  target: "web",
  devtool: "hidden-source-map",
  module: {
    rules: [
      {
        test: /\.wasm$/,
        // use: { loader: "file-loader" },
        loader: "file-loader",
        type: "javascript/auto",
        options: {
          publicPath: "dist/",
        },
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.jpg$/,
        use: [{ loader: "url-loader" }],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json"],
    fallback: {
      path: false,
      fs: false,
      // stream: require.resolve("stream-browserify"),
    },
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/html/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
};
