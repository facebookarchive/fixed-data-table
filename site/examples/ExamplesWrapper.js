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

require('./examplesPageStyle.less');

var MiniHeader = require('../MiniHeader');
var SideBar = require('../SideBar');
var React = require('react');
var createReactClass = require('create-react-class');
var Constants = require('../Constants');

var ExamplesWrapper = createReactClass({
  render() {
    return (
      <div className="examplesPage">
        <MiniHeader />

        <div className="pageBody" id="body">
          <div className="contents">
            <SideBar
              title="Examples"
              pages={Constants.ExamplePages}
              page={this.props.page}
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
