const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  entry: {modern: ['./src/scripts/main.js', './src/scripts/app.js']},
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            sourceType: 'unambiguous',
            presets: [
              [
                '@babel/env',
                {
                  modules: false,
                  corejs: '3.2.1', // TODO: automate it
                  useBuiltIns: 'usage',
                  targets: {
                    browsers: ['Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15']
                  }
                }
              ],
              '@babel/react'
            ],
            plugins: [
              ['@babel/plugin-proposal-class-properties', {loose: true}],
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-proposal-throw-expressions'
            ]
          }
        },
        exclude: /\b(?:core-js|prop-types|react-enroute|custom-elements-polyfill)\b/
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },
  output: {
    path: __dirname + '/docs',
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new CleanWebpackPlugin('./docs', {}),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      // hash: true,
      template: './src/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {}
};
