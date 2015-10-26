"use strict";

require('./base.less');

var Constants = require('./Constants');
var HomePage = require('./home/HomePage');
var TableAPIPage = require('./docs/TableAPIPage');
var ColumnAPIPage = require('./docs/ColumnAPIPage');
var ColumnGroupAPIPage = require('./docs/ColumnGroupAPIPage');
var ExamplesPage = require('./examples/ExamplesPage');
var React = require('react');
var ReactDOMServer = require('react-dom/server');

var faviconURL = require('./images/favicon.png');

var APIPages = Constants.APIPages;
var ExamplePages = Constants.ExamplePages;
var OtherPages = Constants.OtherPages;
var Pages = Constants.Pages;

var IndexPage = React.createClass({
  statics: {
    getDoctype() {
      return '<!doctype html>';
    },

    renderToString(props) {
      return IndexPage.getDoctype() +
        ReactDOMServer.renderToString(<IndexPage {...props} />);
    },
  },

  getInitialState() {
    return {
      renderPage: !this.props.devMode
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
          <link rel="stylesheet" type="text/css" href={this.props.files['main.css']} />
          <link rel="shortcut icon" type="image/png" href={faviconURL} />
          <base target="_blank" />
        </head>
        <body>
          {this.state.renderPage && this._renderPage()}

          <script dangerouslySetInnerHTML={browserInitScriptObj} />
          <script src="https://cdn.rawgit.com/zynga/scroller/master/src/Animate.js"></script>
          <script src="https://cdn.rawgit.com/zynga/scroller/master/src/Scroller.js"></script>
          <script src={this.props.files['main.js']}></script>
        </body>
      </html>
    );
  },

  _renderPage() {
    switch (this.props.location) {
      case OtherPages.HOME.location:
        return <HomePage />;
      case APIPages.TABLE_API.location:
        return <TableAPIPage />;
      case APIPages.COLUMN_API.location:
        return <ColumnAPIPage />;
      case APIPages.COLUMNGROUP_API.location:
        return <ColumnGroupAPIPage />;
    }

    for (var key in ExamplePages) {
      if (ExamplePages.hasOwnProperty(key) &&
        ExamplePages[key].location === this.props.location) {
        return <ExamplesPage example={ExamplePages[key]} />;
      }
    }

    throw new Error(
      'Page of location ' +
        JSON.stringify(this.props.location) +
        ' not found.'
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
