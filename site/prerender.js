"use strict";

var React = require('react');
var Router = require('react-router');
var routes = require('./routes');
var IndexPage = require('./IndexPage');

function renderPath(path, props, onRender) {
  Router.run(routes, path, function(Page) {
    onRender(
      IndexPage.getDoctype() +
        React.renderToString(
          <Page
            {...props}
          />
        )
    );
  });
}


function parseRoutePaths(route) {
  var paths = [];

  if (route && route.props) {
    if (route.props.path || route.props.name) {
      paths.push(route.props.path || route.props.name);
    }

    if (route.props.children) {
      React.Children.forEach(route.props.children, (childRoute) => {
        paths = paths.concat(parseRoutePaths(childRoute));
      });
    }
  }

  return paths;
}

function getRoutePaths() {
  return parseRoutePaths(routes);
}

module.exports = {
  renderPath,
  getRoutePaths,
};
