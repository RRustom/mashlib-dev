"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.basicPreferencesPane = void 0;

var _solidUi = require("solid-ui");

var _rdflib = require("rdflib");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* babel-plugin-inline-import './preferencesFormText.ttl' */
var preferencesFormText = "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n@prefix solid: <http://www.w3.org/ns/solid/terms#>.\n@prefix ui: <http://www.w3.org/ns/ui#>.\n@prefix : <#>.\n\n:this <http://purl.org/dc/elements/1.1/title> \"Basic preferences\" ;\n      a ui:Form ;\n      ui:part :categorizeUser, :privateComment, :personalInformationHeading;\n      ui:parts ( :personalInformationHeading :privateComment :categorizeUser ).\n\n:personalInformationHeading a ui:Heading;\n      ui:contents \"Personal information\".\n\n:privateComment a ui:Comment;\n      ui:contents \"This information is private.\".\n\n:categorizeUser a ui:Classifier;\n      ui:label \"Level of user\"; ui:property rdf:type ; ui:category solid:User.\n";

/* babel-plugin-inline-import './ontologyData.ttl' */
var ontologyData = "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n@prefix solid: <http://www.w3.org/ns/solid/terms#>.\n@prefix foaf: <http://xmlns.com/foaf/0.1/>.\n@prefix schema: <http:/schema.org/>.\n@prefix ui: <http://www.w3.org/ns/ui#>.\n@prefix vcard: <http://www.w3.org/2006/vcard/ns#>.\n@prefix : <#>.\n\nsolid:User a rdfs:Class;\n  rdfs:label \"user\"@en, \"utilisateur\"@fr;\n  rdfs:comment \"\"\"Any person who might use a Solid-based system\"\"\";\n  rdfs:subClassOf foaf:Person, schema:Person, vcard:Individual.\n\n# Since these options are opt-in, it is a bit strange to have new users opt in\n# That they are new users - also we do not use this class for anything specific\n# yet\n# solid:NewUser a rdfs:Class;\n#  rdfs:label \"new user\"@en;\n#  rdfs:comment \"\"\"A person who might use a Solid-based system who has a low\n#  level of familiarity with technical details.\"\"\";\n#  rdfs:subClassOf solid:User.\n\nsolid:PowerUser a rdfs:Class;\n  rdfs:label \"power user\"@en;\n  rdfs:comment \"\"\"A person who might use a Solid-based system\n  who is prepared to be given a more complex interface in order\n  to be provided with more pwerful features.\"\"\";\n  rdfs:subClassOf solid:User.\n\n  solid:Developer a rdfs:Class;\n    rdfs:label \"Developer\";\n    rdfs:comment \"\"\"Any person who might use a Solid-based system,\n    who has software development skills.\"\"\";\n    rdfs:subClassOf solid:User.\n";
var basicPreferencesPane = {
  icon: _solidUi.icons.iconBase + 'noun_Sliders_341315_000000.svg',
  name: 'basicPreferences',
  label: function label(_subject) {
    return null;
  },
  // Render the pane
  // The subject should be the logged in user.
  render: function render(subject, context) {
    var dom = context.dom;
    var store = context.session.store;

    function complainIfBad(ok, mess) {
      if (ok) return;
      container.appendChild(_solidUi.widgets.errorMessageBlock(dom, mess, '#fee'));
    }

    var container = dom.createElement('div');
    var formArea = setupUserTypesSection(container, dom);

    function loadData(doc, turtle) {
      doc = doc.doc(); // remove # from URI if nec

      if (!store.holds(undefined, undefined, undefined, doc)) {
        // If not loaded already
        ;
        (0, _rdflib.parse)(turtle, store, doc.uri, 'text/turtle', null); // Load form directly
      }
    }

    var preferencesForm = store.sym('urn:uuid:93774ba1-d3b6-41f2-85b6-4ae27ffd2597#this');
    loadData(preferencesForm, preferencesFormText);
    var ontologyExtra = store.sym('urn:uuid:93774ba1-d3b6-41f2-85b6-4ae27ffd2597-ONT');
    loadData(ontologyExtra, ontologyData);

    function doRender() {
      return _doRender.apply(this, arguments);
    }

    function _doRender() {
      _doRender = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var renderContext, appendedForm, trustedApplicationsView;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _solidUi.authn.logInLoadPreferences({
                  dom: dom,
                  div: container
                });

              case 2:
                renderContext = _context.sent;

                if (renderContext.preferencesFile) {
                  _context.next = 6;
                  break;
                }

                // Could be CORS
                console.log('Not doing private class preferences as no access to preferences file. ' + renderContext.preferencesFileError);
                return _context.abrupt("return");

              case 6:
                appendedForm = _solidUi.widgets.appendForm(dom, formArea, {}, renderContext.me, preferencesForm, renderContext.preferencesFile, complainIfBad);
                appendedForm.style.borderStyle = 'none';
                trustedApplicationsView = context.session.paneRegistry.byName('trustedApplications');

                if (trustedApplicationsView) {
                  container.appendChild(trustedApplicationsView.render(null, context));
                } // @@ TODO Remove need for casting as any and bang (!) syntax


                addDeleteSection(container, store, renderContext.me, dom);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _doRender.apply(this, arguments);
    }

    doRender();
    return container;
  }
};
exports.basicPreferencesPane = basicPreferencesPane;

function setupUserTypesSection(container, dom) {
  var formContainer = createSection(container, dom, 'User types');
  var description = formContainer.appendChild(dom.createElement('p'));
  description.innerText = 'Here you can self-assign user types to help the data browser know which views you would like to access.';
  var userTypesLink = formContainer.appendChild(dom.createElement('a'));
  userTypesLink.href = 'https://github.com/solid/userguide/#role';
  userTypesLink.innerText = 'Read more';
  var formArea = formContainer.appendChild(dom.createElement('div'));
  return formArea;
}

var _default = basicPreferencesPane; // ends

exports["default"] = _default;

function addDeleteSection(container, store, profile, dom) {
  var section = createSection(container, dom, 'Delete account');
  var podServerNodes = store.each(profile, _solidUi.ns.space('storage'), null, profile.doc());
  var podServers = podServerNodes.map(function (node) {
    return node.value;
  });
  var list = section.appendChild(dom.createElement('ul'));
  podServers.forEach( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(server) {
      var deletionLink, listItem;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return generateDeletionLink(server, dom);

            case 2:
              deletionLink = _context2.sent;

              if (deletionLink) {
                listItem = list.appendChild(dom.createElement('li'));
                listItem.appendChild(deletionLink);
              }

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
}

function generateDeletionLink(_x2, _x3) {
  return _generateDeletionLink.apply(this, arguments);
}
/**
 * Hacky way to get the deletion link to a Pod
 *
 * This function infers the deletion link by assuming the URL structure of Node Solid server.
 * In the future, Solid will hopefully provide a standardised way of discovering the deletion link:
 * https://github.com/solid/data-interoperability-panel/issues/18
 *
 * If NSS is in multi-user mode (the case on inrupt.net and solid.community), the deletion URL for
 * vincent.dev.inrupt.net would be at dev.inrupt.net/account/delete. In single-user mode, the
 * deletion URL would be at vincent.dev.inrupt.net/account/delete.
 *
 * @param server Pod server containing the user's account.
 * @returns URL of the page that Node Solid Server would offer to delete the account, or null if
 *          the URLs we tried give invalid responses.
 */


function _generateDeletionLink() {
  _generateDeletionLink = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(podServer, dom) {
    var link, deletionUrl;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            link = dom.createElement('a');
            link.textContent = "Delete your account at ".concat(podServer);
            _context3.next = 4;
            return getDeletionUrlForServer(podServer);

          case 4:
            deletionUrl = _context3.sent;

            if (!(typeof deletionUrl !== 'string')) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", null);

          case 7:
            link.href = deletionUrl;
            return _context3.abrupt("return", link);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _generateDeletionLink.apply(this, arguments);
}

function getDeletionUrlForServer(_x4) {
  return _getDeletionUrlForServer.apply(this, arguments);
}

function _getDeletionUrlForServer() {
  _getDeletionUrlForServer = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(server) {
    var singleUserUrl, multiUserUrl, hostnameParts, multiUserNssResponse, singleUserNssResponse;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            singleUserUrl = new URL(server);
            multiUserUrl = new URL(server);
            multiUserUrl.pathname = singleUserUrl.pathname = '/account/delete';
            hostnameParts = multiUserUrl.hostname.split('.'); // Remove `vincent.` from `vincent.dev.inrupt.net`, for example:

            multiUserUrl.hostname = hostnameParts.slice(1).join('.');
            _context4.next = 7;
            return fetch(multiUserUrl.href, {
              method: 'HEAD'
            });

          case 7:
            multiUserNssResponse = _context4.sent;

            if (!multiUserNssResponse.ok) {
              _context4.next = 10;
              break;
            }

            return _context4.abrupt("return", multiUserUrl.href);

          case 10:
            _context4.next = 12;
            return fetch(singleUserUrl.href, {
              method: 'HEAD'
            });

          case 12:
            singleUserNssResponse = _context4.sent;

            if (!singleUserNssResponse.ok) {
              _context4.next = 15;
              break;
            }

            return _context4.abrupt("return", singleUserUrl.href);

          case 15:
            return _context4.abrupt("return", null);

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getDeletionUrlForServer.apply(this, arguments);
}

function createSection(container, dom, title) {
  var section = container.appendChild(dom.createElement('div'));
  section.style.border = '0.3em solid #418d99';
  section.style.borderRadius = '0.5em';
  section.style.padding = '0.7em';
  section.style.marginTop = '0.7em';
  var titleElement = section.appendChild(dom.createElement('h3'));
  titleElement.innerText = title;
  return section;
}
//# sourceMappingURL=basicPreferences.js.map