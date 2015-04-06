var webpack = require('webpack');
var resolvers = require('./build_helpers/resolvers');
var path = require('path');
var glob = require('glob');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var packageJSON = require('./package.json');

var banner = (
  '/**\n' +
  ' * FixedDataTable v' + packageJSON.version + ' \n' +
  ' *\n' +
  ' * Copyright (c) 2015, Facebook, Inc.\n' +
  ' * All rights reserved.\n' +
  ' *\n' +
  ' * This source code is licensed under the BSD-style license found in the\n' +
  ' * LICENSE file in the root directory of this source tree. An additional grant\n' +
  ' * of patent rights can be found in the PATENTS file in the same directory.\n' +
  ' */\n'
);

var plugins = [
  new ExtractTextPlugin('[name].css'),
  new webpack.DefinePlugin({
    '__DEV__': JSON.stringify(process.env.NODE_ENV !== 'production')
  }),
  resolvers.resolveHasteDefines
];

var entry = {};
var entryPoints = glob.sync(
  path.join(__dirname, './src/**/*.css')
);
entryPoints.push('./src/FixedDataTableRoot.js');

if (process.env.COMPRESS) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      },
      output: {comments: false}
    })
  );
  entry['fixed-data-table.min'] = entryPoints;
} else {
  entry['fixed-data-table'] = entryPoints;
}

plugins.push(
  new webpack.BannerPlugin(banner, {raw: true})
);

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'jsx-loader?harmony&stripTypes'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          [
            'css-loader',
            path.join(__dirname, './build_helpers/cssTransformLoader.js')
          ].join('!')
        )
      },
    ],
  },

  entry: entry,

  output: {
    library: 'FixedDataTable',
    libraryTarget: 'umd',
    path: 'dist',
    filename: '[name].js',
  },

  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
    },
  },

  node: {
    Buffer: false
  },

  plugins: plugins
};
