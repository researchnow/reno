const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
            presets: [
              [
                '@babel/env',
                {
                  modules: false,
                  useBuiltIns: 'usage',
                  targets: {
                    browsers: ['Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15']
                  }
                }
              ],
              '@babel/react'
            ],
            plugins: [['@babel/plugin-proposal-class-properties', {loose: true}]]
          }
        },
        exclude: /\b(?:core-js|prop-types|react-enroute)\b/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {minimize: {preset: 'advanced'}}
          },
          'sass-loader'
        ]
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
    new CleanWebpackPlugin('docs', {}),
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
    new CopyWebpackPlugin([
			{
				from: './pages',
				to: 'pages'
			}
		]),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
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
            presets: [
              [
                '@babel/env',
                {
                  modules: false,
                  useBuiltIns: 'usage',
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
                  }
                }
              ],
              '@babel/react'
            ],
            plugins: [['@babel/plugin-proposal-class-properties', {loose: true}]]
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
  }
};

module.exports = [modernConfig, legacyConfig];
