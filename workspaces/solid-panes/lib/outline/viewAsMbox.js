"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(dom) {
  return function viewAsMbox(obj) {
    var anchor = dom.createElement('a'); // previous implementation assumed email address was Literal. fixed.
    // FOAF mboxs must NOT be literals -- must be mailto: URIs.

    var address = obj.termType === 'NamedNode' ? obj.uri : obj.value; // this way for now
    // if (!address) return viewAsBoringDefault(obj)

    var index = address.indexOf('mailto:');
    address = index >= 0 ? address.slice(index + 7) : address;
    anchor.setAttribute('href', 'mailto:' + address);
    anchor.appendChild(dom.createTextNode(address));
    return anchor;
  };
};

exports["default"] = _default;
//# sourceMappingURL=viewAsMbox.js.map