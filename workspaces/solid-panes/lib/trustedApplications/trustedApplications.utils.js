"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatementsToDelete = getStatementsToDelete;
exports.getStatementsToAdd = getStatementsToAdd;
exports.generateRandomString = generateRandomString;

var _rdflib = require("rdflib");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function getStatementsToDelete(origin, person, kb, ns) {
  var applicationStatements = kb.statementsMatching(null, ns.acl('origin'), origin);
  var statementsToDelete = applicationStatements.reduce(function (memo, st) {
    return memo.concat(kb.statementsMatching(person, ns.acl('trustedApp'), st.subject)).concat(kb.statementsMatching(st.subject));
  }, []);
  return statementsToDelete;
}

function getStatementsToAdd(origin, nodeName, modes, person, ns) {
  var application = new _rdflib.BlankNode("bn_".concat(nodeName));
  return [(0, _rdflib.st)(person, ns.acl('trustedApp'), application, person.doc()), (0, _rdflib.st)(application, ns.acl('origin'), origin, person.doc())].concat(_toConsumableArray(modes.map(function (mode) {
    return (0, _rdflib.sym)(mode);
  }).map(function (mode) {
    return (0, _rdflib.st)(application, ns.acl('mode'), mode, person.doc());
  })));
}

function generateRandomString() {
  return Math.random().toString(36).substr(2, 5);
}
//# sourceMappingURL=trustedApplications.utils.js.map