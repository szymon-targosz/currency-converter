const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;


process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development') {
   dotenv.config({ path: '.env' });
}


const getStyleLoaders = (isProd, cssOptions, sass) => {
   const loaders = [
      { loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader' },
      {
         loader: 'css-loader',
         options: cssOptions
      },
      {
         loader: 'postcss-loader',
         options: {
            ident: 'postcss',
            plugins: () => [
               autoprefixer({ browsers: ['> 1%', 'last 2 versions', 'not ie < 9'] })
            ]
         }
      }
   ];

   if (sass) {
      loaders.push({
         loader: 'sass-loader',
         options: {
            sourceMap: true
         }
      });
   }

   return loaders;
};

module.exports = (env) => {
   const isProd = env === 'production';
   const build = path.resolve(__dirname, 'build');

   return {
      entry: ['@babel/polyfill', './src/index.js'],
      output: {
         path: build,
         filename: 'js/bundle.js'
      },
      mode: isProd ? 'production' : 'development',
      devtool: isProd ? 'source-map' : 'inline-source-map',
      module: {
         rules: [
            {
               test: /\.js$/,
               exclude: /node_modules/,
               loader: 'babel-loader'
            },
            {
               test: cssRegex,
               exclude: [cssModuleRegex, /node_modules/],
               use: getStyleLoaders(true, {
                  importLoaders: 2,
                  sourceMap: true
               })
            },
            {
               test: cssModuleRegex,
               exclude: /node_modules/,
               use: getStyleLoaders(false, {
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]__[local]__[hash:base64:5]',
                  sourceMap: true
               })
            },
            {
               test: sassRegex,
               exclude: [sassModuleRegex, /node_modules/],
               use: getStyleLoaders(true, {
                  importLoaders: 2,
                  sourceMap: true
               }, true)
            },
            {
               test: sassModuleRegex,
               exclude: /node_modules/,
               use: getStyleLoaders(false, {
                  importLoaders: 2,
                  modules: true,
                  localIdentName: '[name]__[local]__[hash:base64:5]',
                  sourceMap: true
               }, true)
            }
         ]
      },
      plugins: [
         new HtmlWebpackPlugin({
            template: `${__dirname}/src/index.html`,
            inject: 'body',
            filename: 'index.html'
         }),
         new MiniCssExtractPlugin({ filename: 'css/style.css' }),
         new webpack.DefinePlugin({
            'process.env.FIXER_API_KEY': JSON.stringify(process.env.FIXER_API_KEY),
         })
      ],
      devServer: {
         historyApiFallback: true
      }
   };
};
