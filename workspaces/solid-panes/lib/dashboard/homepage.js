"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateHomepage = generateHomepage;

var _rdflib = require("rdflib");

var _solidUi = require("solid-ui");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function generateHomepage(_x, _x2, _x3) {
  return _generateHomepage.apply(this, arguments);
}

function _generateHomepage() {
  _generateHomepage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(subject, store, fetcher) {
    var ownersProfile, name, wrapper;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return loadProfile(subject, fetcher);

          case 2:
            ownersProfile = _context.sent;
            name = getName(store, ownersProfile);
            wrapper = document.createElement('div');
            wrapper.classList.add('container');
            wrapper.appendChild(createTitle(ownersProfile.uri, name));
            wrapper.appendChild(createDataSection(name));
            return _context.abrupt("return", wrapper);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _generateHomepage.apply(this, arguments);
}

function createDataSection(name) {
  var dataSection = document.createElement('section');
  var title = document.createElement('h2');
  title.innerText = 'Data';
  dataSection.appendChild(title);
  var listGroup = document.createElement('div');
  listGroup.classList.add('list-group');
  dataSection.appendChild(listGroup);
  var publicDataLink = document.createElement('a');
  publicDataLink.classList.add('list-group-item');
  publicDataLink.href = '/public/';
  publicDataLink.innerText = "View ".concat(name, "'s files");
  listGroup.appendChild(publicDataLink);
  return dataSection;
}

function createTitle(uri, name) {
  var profileLink = document.createElement('a');
  profileLink.href = uri;
  profileLink.innerText = name;
  var profileLinkPost = document.createElement('span');
  profileLinkPost.innerText = '\'s Pod';
  var title = document.createElement('h1');
  title.appendChild(profileLink);
  title.appendChild(profileLinkPost);
  return title;
}

function loadProfile(_x4, _x5) {
  return _loadProfile.apply(this, arguments);
}

function _loadProfile() {
  _loadProfile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(subject, fetcher) {
    var pod, webId;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            pod = subject.site().uri; // TODO: This is a hack - we cannot assume that the profile is at this document, but we will live with it for now

            webId = (0, _rdflib.sym)("".concat(pod, "profile/card#me"));
            _context2.next = 4;
            return fetcher.load(webId);

          case 4:
            return _context2.abrupt("return", webId);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _loadProfile.apply(this, arguments);
}

function getName(store, ownersProfile) {
  return store.anyValue(ownersProfile, _solidUi.ns.vcard('fn'), null, ownersProfile.doc()) || store.anyValue(ownersProfile, _solidUi.ns.foaf('name'), null, ownersProfile.doc()) || new URL(ownersProfile.uri).host.split('.')[0];
}
//# sourceMappingURL=homepage.js.map