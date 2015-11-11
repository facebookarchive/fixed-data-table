/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";

var React = require('react');
var Constants = require('../Constants');

var ExampleHeader = React.createClass({
  render() {
    return (
      <div className="exampleHeader">
        <div className="exampleControls">
        </div>
        <h1 className="exampleTitle">
          <span className="exampleTitleName">
            Example:
          </span>
          {' '}
          <a href={this.props.example.file}>{this.props.example.title}</a>
        </h1>
        <p className="exampleDescription">
          <a className="exampleCode" href={this.props.example.file}>Example code</a>
          {this.props.example.description}
        </p>
      </div>
    );
  }
});

module.exports = ExampleHeader;
