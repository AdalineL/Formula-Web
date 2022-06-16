const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: [
      "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
      "./src/index.js",
    ],
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
  },
  mode: "development",
  target: "web",
  devtool: "hidden-source-map",
  module: {
    rules: [
      {
        test: /\.wasm$/,
        loader: "file-loader",
        type: "javascript/auto",
        options: {
          publicPath: "dist/",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json"],
    fallback: {
      path: false,
      fs: false,
    },
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/html/index.html",
      filename: "./index.html",
      excludeChunks: ["server"],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};

// uncomment for webpack.dev.config.js file corresponding to updated package.json file
// const path = require("path");
// const webpack = require("webpack");
// const HtmlWebPackPlugin = require("html-webpack-plugin");
// const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

// module.exports = {
//   // entry: __dirname + "/index.js",
//   entry: {
//     main: [
//       "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
//       "./src/index.js",
//     ],
//   },
//   output: {
//     path: path.join(__dirname, "dist"),
//     publicPath: "/",
//     filename: "[name].js",
//   },
//   mode: "development",
//   target: "web",
//   devtool: "hidden-source-map",
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         loader: "babel-loader",
//       },
//       {
//         test: /\.html$/,
//         use: [
//           {
//             loader: "html-loader",
//           },
//         ],
//       },
//       {
//         test: /\.wasm$/,
//         loader: "file-loader",
//         type: "javascript/auto",
//         options: {
//           publicPath: "dist/",
//         },
//       },
//       {
//         test: /\.css$/,
//         use: ["style-loader", "css-loader"],
//       },
//       {
//         test: /\.ttf$/,
//         use: ["file-loader"],
//       },
//     ],
//   },
//   resolve: {
//     extensions: [".js", ".json"],
//     fallback: {
//       path: false,
//       fs: false,
//     },
//   },
//   plugins: [
//     new HtmlWebPackPlugin({
//       template: "./src/html/index.html",
//       filename: "./index.html",
//       excludeChunks: ["server"],
//     }),
//     new webpack.HotModuleReplacementPlugin(),
//     new webpack.NoEmitOnErrorsPlugin(),
//   ],
// };
