"use strict";

var React = require('react');
var IndexPage = require('./IndexPage');

// Polyfill ES6 `Object.assign`.
Object.assign = Object.assign || require('object-assign');

React.render(
  <IndexPage
    {...window.INITIAL_PROPS}
  />,
  document
);
