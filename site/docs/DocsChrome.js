"use strict";

require('./docsPageStyle.less');

var MiniHeader = require('../MiniHeader');
var SideBar = require('../SideBar');
var React = require('react');
var Router = require('react-router');
var Constants = require('../Constants');

var RouteHandler = Router.RouteHandler;

function getRouteByName(routesArray, name) {
  return routesArray.find((route) => route.name === name);
}

var DocsHTMLWrapper = React.createClass({
  mixins: [Router.State],

  render() {
    console.log(this.getRoutes());


    return (
      <div className="docsPage">
        <MiniHeader />

        <div className="pageBody" id="body">
          <div className="contents">
            <SideBar
              title="API"
              pages={Constants.APIPages}
            />

            <RouteHandler />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DocsHTMLWrapper;
