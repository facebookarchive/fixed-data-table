"use strict";

var React = require('react');
var Router = require('react-router');
var routes = require('./routes');

// Polyfill ES6 `Object.assign`.
Object.assign = Object.assign || require('object-assign');

Router.run(routes, Router.HistoryLocation, function(Page, state) {
  console.log('state', state);
  React.render(
    <Page
      {...window.INITIAL_PROPS}
    />,
    document
  );
});
