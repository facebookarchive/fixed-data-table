var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var resolvers = require('../build_helpers/resolvers');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isDev = process.env.NODE_ENV !== 'production';

module.exports = {

  devtool: 'source-map',

  entry: path.join(__dirname, 'client.js'),

  output: {
    path: '__site__/',
    filename: isDev ? '[name].js' : '[name]-[hash].js',
    publicPath: ''
  },

  module: {
    loaders: [
      {
        test: /\.md$/,
        loader: [
          // Disable HTML minification as this causes differences between the
          // node rendered HTML and the client rendered html as the node env
          // currently isn't minifiying.
          'html?{"minimize":false}',
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
        query: { mimetype: 'image/png', name: 'images/[name]-[hash].[ext]' }
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
    new ExtractTextPlugin(
      isDev ? '[name].css' : '[name]-[hash].css'
    ),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__DEV__': JSON.stringify(isDev || true)
    }),
    resolvers.resolveHasteDefines,
  ]
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );
}
