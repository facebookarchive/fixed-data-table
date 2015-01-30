"use strict";

require('./examplesPageStyle.less');

var MiniHeader = require('../MiniHeader');
var SideBar = require('../SideBar');
var React = require('react');
var Constants = require('../Constants');

var ExamplesWrapper = React.createClass({
  render() {
    return (
      <div className="examplesPage">
        <MiniHeader />

        <div className="pageBody" id="body">
          <div className="contents">
            <SideBar
              title="Examples"
              pages={Constants.ExamplePages}
              example={this.props.example}
            />
            <div className="exampleContents">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ExamplesWrapper;
