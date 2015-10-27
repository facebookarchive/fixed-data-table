"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var IndexPage = require('./IndexPage');

ReactDOM.render(
  <IndexPage
    {...window.INITIAL_PROPS}
  />,
  document
);
