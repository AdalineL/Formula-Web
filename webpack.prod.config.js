const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

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
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  module: {
    rules: [
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

// uncomment for webpack.prod.config.js file corresponding to updated package.json file
// const path = require("path");
// const HtmlWebPackPlugin = require("html-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// module.exports = {
//   entry: {
//     main: "./src/index.js",
//   },
//   output: {
//     path: path.join(__dirname, "dist"),
//     publicPath: "/",
//     filename: "[name].js",
//   },
//   target: "web",
//   devtool: "hidden-source-map",
//   optimization: {
//     minimizer: [
//       new UglifyJsPlugin({
//         cache: true,
//         parallel: true,
//         sourceMap: true,
//       }),
//       new OptimizeCSSAssetsPlugin({}),
//     ],
//   },
//   // optimization: {
//   //   minimize: true,
//   //   minimizer: [new CssMinimizerPlugin(), "..."],
//   //   runtimeChunk: {
//   //     name: "runtime",
//   //   },
//   // },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: "babel-loader",
//         },
//       },
//       {
//         test: /\.html$/,
//         use: [
//           {
//             loader: "html-loader",
//             options: { minimize: true },
//           },
//         ],
//       },
//       {
//         test: /\.jpg$/,
//         use: [{ loader: "url-loader" }],
//       },
//       {
//         test: /\.ttf$/,
//         use: [{ loader: "file-loader" }],
//       },
//       {
//         test: /\.css$/,
//         use: [
//           MiniCssExtractPlugin.loader,
//           {
//             loader: "css-loader",
//           },
//         ],
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
//     }),
//     new MiniCssExtractPlugin({
//       filename: "[name].css",
//       chunkFilename: "[id].css",
//     }),
//   ],
// };
