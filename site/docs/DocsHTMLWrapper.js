"use strict";

require('./docsPageStyle.less');

var MiniHeader = require('../MiniHeader');
var SideBar = require('../SideBar');
var React = require('react');
var StaticHTMLBlock = require('../StaticHTMLBlock');
var Constants = require('../Constants');

var DocsHTMLWrapper = React.createClass({
  render() {
    return (
      <div className="docsPage">
        <MiniHeader />

        <div className="pageBody" id="body">
          <div className="contents">
            <SideBar
              title="API"
              pages={Constants.APIPages}
              example={this.props.example}
            />
            <StaticHTMLBlock
              className="docContents"
              html={this.props.html}
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DocsHTMLWrapper;
