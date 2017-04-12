"use strict";

var React = require('react');
var createClass = require('create-react-class');

var StaticHTMLBlock = createClass({
  propTypes: {
    html: React.PropTypes.string.isRequired
  },

  shouldComponentUpdate() {
    return false;
  },

  render() {
    var {html, ...props} = this.props;
    return (
      <div
        dangerouslySetInnerHTML={{__html: html}}
        {...props}
      />
    );
  },
});

module.exports = StaticHTMLBlock;
