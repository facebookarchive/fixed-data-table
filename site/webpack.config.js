var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var resolvers = require('../build_helpers/resolvers');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

  devtool: 'source-map',

  entry: path.join(__dirname, 'client.js'),

  output: {
    path: '__site__/assets',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: './'
  },

  module: {
    loaders: [
      {
        test: /\.md$/,
        loader: [
          'html',
          path.join(__dirname, '../build_helpers/markdownLoader.js')
        ].join('!')
      },
      {
        test: /\.js$/,
        loader: 'jsx-loader?harmony'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [
            'css-loader',
            path.join(__dirname, '../build_helpers/cssTransformLoader.js')
          ].join('!')
        )
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!less-loader'
        )
      },
      {
        test: /\.png$/,
        loader: 'file-loader',
        query: { mimetype: 'image/png', name: 'images/[name].[ext]' }
      }
    ]
  },

  resolve: {
    alias: {
      'fixed-data-table/css': path.join(__dirname, '../src/css'),
      'fixed-data-table': path.join(__dirname, '../src/FixedDataTableRoot.js')
    }
  },

  plugins: [
    new ExtractTextPlugin("[name].css"),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__DEV__': JSON.stringify(process.env.NODE_ENV !== 'production' || 'true')
    }),
    resolvers.resolveHasteDefines,
    // This breaks markdown
    // new webpack.optimize.UglifyJsPlugin({
    //   compressor: {
    //     warnings: false
    //   }
    // })
  ]
};
