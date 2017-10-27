"use strict";

var React = require('react');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var StaticHTMLBlock = createReactClass({
  propTypes: {
    html: PropTypes.string.isRequired
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
