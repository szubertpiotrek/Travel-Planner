//Konfiguracja Webpack
var path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");


module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: {
    main: path.join(__dirname, 'src', 'app.jsx')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-2', 'react']
          }
        }
      },
      {
        test: /\.(png|jpe?g|svg|gif|woff|otf)$/,
        use: {loader: 'file-loader'}
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
         fallback: "style-loader",
         use: ['css-loader', 'postcss-loader', 'sass-loader']
       })
     }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      hash: true
    }),
    new ExtractTextPlugin('style.css')
  ]
};
