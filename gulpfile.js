/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var babel = require('gulp-babel');
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var concatCSS = require('gulp-concat-css');
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var merge = require('merge-stream');
var header = require('gulp-header');
var rename = require('gulp-rename');
var packageData = require('./package.json');
var flatten = require('gulp-flatten');
var gulpUtil = require('gulp-util');
var webpackStream = require('webpack-stream');

var fbcss = require('./scripts/postcss/fbcss');

var fbjsConfigurePreset = require('babel-preset-fbjs/configure');
// var derequire = require('gulp-derequire');
// var runSequence = require('run-sequence');
// var through = require('through2');
//
// var gulpCheckDependencies = require('fbjs-scripts/gulp/check-dependencies');

var moduleMap = Object.assign(
  {
    'React': 'react',
    'ReactDOM': 'react-dom',
    'ReactComponentWithPureRenderMixin': 'react-addons-pure-render-mixin',
    'object-assign': 'object-assign',
  },
  require('fbjs/module-map')
);

var paths = {
  dist: 'dist',
  // TODO: make this 'lib' to match other projects
  lib: 'internal',
  src: [
    'src/**/*.js',
    '!src/**/__tests__/**/*.js',
    '!src/**/__mocks__/**/*.js',
  ],
  css: {
    base: {
      src: 'src/css/layout/*.css',
      dest: 'fixed-data-table-base.css',
    },
    style: {
      src: 'src/css/style/*.css',
      dest: 'fixed-data-table-style.css',
    }
  }
};

// TODO: rm trailing whitespace after version, use 2015-present
var COPYRIGHT_HEADER = `/**
 * FixedDataTable v<%= version %>${' '}
 *
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
`;

function makeCSSStream(path) {
  return gulp
    .src(path.src)
    .pipe(concatCSS(path.dest))
    .pipe(postcss([require('./scripts/postcss/fbcss'), autoprefixer]))
    .pipe(header(COPYRIGHT_HEADER, {version: packageData.version}))
    .pipe(gulp.dest(paths.dist))
}

function minifyCSSStream(stream) {
  return stream
    .pipe(cleanCSS({advanced: false}))
    .pipe(rename({extname: '.min.css'}))
    .pipe(header(COPYRIGHT_HEADER, {version: packageData.version}))
    .pipe(gulp.dest(paths.dist));
}

var buildDist = function(opts) {
  var webpackOpts = {
    debug: opts.debug,
    externals: {
      react: {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
      },
    },
    output: {
      filename: opts.output,
      libraryTarget: 'umd',
      library: 'FixedDataTable',
    },
    plugins: [
      new webpackStream.webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          opts.debug ? 'development' : 'production'
        ),
      }),
      new webpackStream.webpack.optimize.OccurenceOrderPlugin(),
      new webpackStream.webpack.optimize.DedupePlugin(),
    ],
  };
  if (!opts.debug) {
    webpackOpts.plugins.push(
      new webpackStream.webpack.optimize.UglifyJsPlugin({
        compress: {
          hoist_vars: true,
          screw_ie8: true,
          warnings: false,
        },
      })
    );
  }
  return webpackStream(webpackOpts, null, function(err, stats) {
    if (err) {
      throw new gulpUtil.PluginError('webpack', err);
    }
    if (stats.compilation.errors.length) {
      gulpUtil.log('webpack', '\n' + stats.toString({colors: true}));
    }
  });
};

gulp.task('dist-clean', function() {
  return del(paths.dist);
});

gulp.task('dist-css', function() {
  let baseCSS = makeCSSStream(paths.css.base);
  let baseCSSMin = minifyCSSStream(baseCSS);
  let styleCSS = makeCSSStream(paths.css.style);
  let styleCSSMin = minifyCSSStream(styleCSS);
  let allCSS = merge(styleCSS, baseCSS)
    .pipe(concatCSS('fixed-data-table.css'))
    .pipe(header(COPYRIGHT_HEADER, {version: packageData.version}))
    .pipe(gulp.dest(paths.dist));
  let allCSSMin = minifyCSSStream(allCSS);

  return merge(baseCSS, baseCSSMin, styleCSS, styleCSSMin, allCSS, allCSSMin);
});

gulp.task('dist-js', ['npm-js'], function() {
  var opts = {
    debug: true,
    output: 'fixed-data-table.js',
  };
  var optsMin = {
    debug: false,
    output: 'fixed-data-table.min.js'
  };

  var fdt = gulp.src('./internal/FixedDataTableRoot.js');

  return merge(
    fdt
      .pipe(buildDist(opts))
      .pipe(header(COPYRIGHT_HEADER, {version: packageData.version}))
      .pipe(gulp.dest(paths.dist)),
    fdt
      .pipe(buildDist(optsMin))
      .pipe(header(COPYRIGHT_HEADER, {version: packageData.version}))
      .pipe(gulp.dest(paths.dist))
  );
})

gulp.task('npm-clean', function() {
  return del(paths.lib);
})

gulp.task('npm-js', function() {
  return gulp
    .src(paths.src)
    .pipe(babel({
      presets: [
        fbjsConfigurePreset({
          stripDEV: true,
          rewriteModules: {map: moduleMap},
        }),
      ]
    }))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib))
})

gulp.task('default', ['dist-css']);
