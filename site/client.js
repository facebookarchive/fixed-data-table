"use strict";

var React = require('React');
var IndexPage = require('./IndexPage');

React.render(
  <IndexPage
    {...window.INITIAL_PROPS}
  />,
  document
);
