"use strict";

var React = require('react');
var Constants = require('./Constants');
var Router = require('react-router');

var Link = Router.Link;

require('./miniHeader.less');

var GITHUB_URL = 'https://github.com/facebook/fixed-data-table';
var EXAMPLES_DEFAULT_LOCATION = Constants.EXAMPLES_DEFAULT.location;

var MiniHeader = React.createClass({
  render() {
    return (
      <div className="header">
        <div className="miniHeader">
          <div className="miniHeaderContents">
            <Link to="home" className="miniLogo" />
            <Link to="home" className="homeLink">Home</Link>
            <Link to="docs">Documentation</Link>
            <a href={EXAMPLES_DEFAULT_LOCATION} target="_self">Examples</a>
            <a href={GITHUB_URL}>Github</a>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MiniHeader;
