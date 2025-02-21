const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const Visualizer = require('webpack-visualizer-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const modernConfig = {
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
                  loose: true,
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
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      // hash: true,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new CopyWebpackPlugin({patterns: [{from: './pages', to: 'pages'}]}),
    new CssMinimizerPlugin(),
    new Visualizer({filename: './statistics-modern.html'})
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          minChunks: 1,
          enforce: true
        }
      }
    }
  }
};

const legacyConfig = {
  entry: {legacy: ['./src/scripts/main.js', './src/scripts/app.js']},
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
                  loose: true,
                  corejs: '3.2.1', // TODO: automate it
                  useBuiltIns: 'usage',
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
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
        use: ['style-loader', 'css-loader', 'sass-loader']
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
  plugins: [new Visualizer({filename: './statistics-legacy.html'})],
  optimization: {
    minimizer: [
      new TerserPlugin({
        minify: {
          sourceMap: false,
        },
        terserOptions: {
          compress: {inline: false},
          format: {
            comments: false,
            beautify: false,
            indent_level: 0,
            indent_start: 0
          }
        },
        parallel: true,
      })
    ]
  }
};

module.exports = [modernConfig, legacyConfig];
