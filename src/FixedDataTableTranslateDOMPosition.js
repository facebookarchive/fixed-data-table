/**
 * Copyright (c) 2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule FixedDataTableTranslateDOMPosition
 * @typechecks
 */

var translateDOMPositionXY = require('translateDOMPositionXY');

function FixedDataTableTranslateDOMPosition(/*object*/ style, /*number*/ x, /*number*/ y, /*boolean*/ initialRender = false) {
  if (initialRender) {
    style.left = x + 'px';
    style.top = y + 'px';
  } else {
    translateDOMPositionXY(style, x, y);
  }

}

module.exports = FixedDataTableTranslateDOMPosition;
