"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorMessageBlock = errorMessageBlock;

/**
 * Create an error message block
 * @param dom The DOM on which dom.createElement will be called
 * @param msg The error message string to display
 * @param backgroundColor Background color. Default: '#fee'
 * @returns A div element with the msg string
 */
function errorMessageBlock(dom, msg, backgroundColor) {
  var div = dom.createElement('div');
  div.setAttribute('style', 'margin: 0.1em; padding: 0.5em; border: 0.05em solid gray; background-color: ' + (backgroundColor || '#fee') + '; color:black;');
  div.textContent = msg;
  return div;
}
//# sourceMappingURL=error.js.map