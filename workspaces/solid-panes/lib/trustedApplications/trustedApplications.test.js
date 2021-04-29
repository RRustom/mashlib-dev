"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var $rdf = _interopRequireWildcard(require("rdflib"));

var _solidNamespace = _interopRequireDefault(require("solid-namespace"));

var _trustedApplications = require("./trustedApplications.utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-env jest */
var ns = (0, _solidNamespace["default"])($rdf);
describe('generateRandomString', function () {
  it('generates a random string five characters long', function () {
    expect((0, _trustedApplications.generateRandomString)().length).toBe(5);
  });
});
describe('getStatementsToDelete', function () {
  it('should return an empty array when there are no statements', function () {
    var mockStore = $rdf.graph();
    var mockOrigin = $rdf.sym('https://origin.example');
    var mockProfile = $rdf.sym('https://profile.example#me');
    expect((0, _trustedApplications.getStatementsToDelete)(mockOrigin, mockProfile, mockStore, ns)).toEqual([]);
  });
  it('should return all statements for the given origin', function () {
    var mockStore = $rdf.graph();
    var mockApplication = $rdf.sym('https://app.example');
    var mockOrigin = $rdf.sym('https://origin.example');
    var mockProfile = $rdf.sym('https://profile.example#me');
    mockStore.add(mockApplication, ns.acl('origin'), mockOrigin);
    mockStore.add(mockApplication, ns.acl('mode'), ns.acl('Read'));
    mockStore.add(mockProfile, ns.acl('trustedApp'), mockApplication);
    var statementsToDelete = (0, _trustedApplications.getStatementsToDelete)(mockOrigin, mockProfile, mockStore, ns);
    expect(statementsToDelete.length).toBe(3);
    expect(statementsToDelete).toMatchSnapshot();
  });
  it('should not return statements for a different origin', function () {
    var mockStore = $rdf.graph();
    var mockApplication = $rdf.sym('https://app.example');
    var mockOrigin = $rdf.sym('https://origin.example');
    var mockProfile = $rdf.sym('https://profile.example#me');
    mockStore.add(mockApplication, ns.acl('origin'), mockOrigin);
    mockStore.add(mockApplication, ns.acl('mode'), ns.acl('Read'));
    mockStore.add(mockProfile, ns.acl('trustedApp'), mockApplication);
    var statementsToDelete = (0, _trustedApplications.getStatementsToDelete)($rdf.lit('A different origin'), // @@ TODO Remove casting
    mockProfile, mockStore, ns);
    expect(statementsToDelete.length).toBe(0);
    expect(statementsToDelete).toEqual([]);
  });
});
describe('getStatementsToAdd', function () {
  it('should return all required statements to add the given permissions for a given origin', function () {
    var mockOrigin = $rdf.sym('https://origin.example');
    var mockProfile = $rdf.sym('https://profile.example#me');
    var modes = [ns.acl('Read').value, ns.acl('Write').value];
    var statementsToAdd = (0, _trustedApplications.getStatementsToAdd)(mockOrigin, 'mock_app_id', modes, mockProfile, ns);
    expect(statementsToAdd.length).toBe(4);
    expect(statementsToAdd).toMatchSnapshot();
  });
});
//# sourceMappingURL=trustedApplications.test.js.map