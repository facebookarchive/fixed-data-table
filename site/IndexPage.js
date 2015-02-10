"use strict";

require('./base.less');

var Constants = require('./Constants');
var React = require('react');
var Router = require('react-router');
var faviconURL = require('./images/favicon.png');

var RouteHandler = Router.RouteHandler;

var APIPages = Constants.APIPages;
var ExamplePages = Constants.ExamplePages;
var OtherPages = Constants.OtherPages;
var Pages = Constants.Pages;

var IndexPage = React.createClass({
  statics: {
    getDoctype() {
      return '<!doctype html>';
    },
  },

  getInitialState() {
    return {
      renderPage: !__DEV__
    };
  },

  render() {
    // Dump out our current props to a global object via a script tag so
    // when initialising the browser environment we can bootstrap from the
    // same props as what each page was rendered with.
    var browserInitScriptObj = {
      __html: 'window.INITIAL_PROPS = ' + JSON.stringify(this.props) + ';\n'
    };

    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>FixedDataTable</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
          <link rel="stylesheet" href="//code.cdn.mozilla.net/fonts/fira.css" />
          <link rel="stylesheet" type="text/css" href={this.props.resources['main.css']} />
          <link rel="shortcut icon" type="image/png" href={faviconURL} />
          <base target="_blank" />
        </head>
        <body>
          {this.state.renderPage && <RouteHandler />}

          <script dangerouslySetInnerHTML={browserInitScriptObj} />
          <script src="https://cdn.rawgit.com/zynga/scroller/master/src/Animate.js"></script>
          <script src="https://cdn.rawgit.com/zynga/scroller/master/src/Scroller.js"></script>
          <script src={this.props.resources['main.js']}></script>
        </body>
      </html>
    );
  },

  componentDidMount() {
    if (!this.state.renderPage) {
      this.setState({
        renderPage: true
      });
    }
  }
});

module.exports = IndexPage;
