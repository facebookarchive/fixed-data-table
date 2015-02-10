"use strict";

var React = require('react');
var Router = require('react-router');
var IndexPage = require('./IndexPage');
var HomePage = require('./home/HomePage');
var DocsChrome = require('./docs/DocsChrome');
var TableAPIPage = require('./docs/TableAPIPage');
var ColumnAPIPage = require('./docs/ColumnAPIPage');
var ColumnGroupAPIPage = require('./docs/ColumnGroupAPIPage');
var ExamplesPage = require('./examples/ExamplesPage');

var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;

module.exports = (
  <Route name="home" path="/" handler={IndexPage}>
    <DefaultRoute handler={HomePage} />

    <Route name="docs" path="/docs/" handler={DocsChrome}>
      <DefaultRoute handler={TableAPIPage} />

      <Route name="api-table" path="/docs/api-table/" handler={TableAPIPage} />
      <Route name="api-column" path="/docs/api-column/" handler={ColumnAPIPage} />
      <Route name="api-column-group" path="/docs/api-column-group/" handler={ColumnGroupAPIPage} />
    </Route>
  </Route>
);
