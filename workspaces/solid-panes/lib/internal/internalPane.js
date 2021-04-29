"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _solidUi = require("solid-ui");

var _rdflib = require("rdflib");

/*   Internal Pane
 **
 **  This outline pane contains the properties which are
 ** internal to the user's interaction with the web, and are not normally displayed
 */

/* global alert confirm */
var pane = {
  icon: _solidUi.icons.originalIconBase + 'tango/22-emblem-system.png',
  name: 'internal',
  audience: [_solidUi.ns.solid('Developer')],
  label: function label() {
    return 'under the hood'; // There is often a URI even of no statements
  },
  render: function render(subject, context) {
    var dom = context.dom;
    var store = context.session.store;
    var canonizedSubject = store.canon(subject);
    var types = store.findTypeURIs(canonizedSubject);

    function filter(pred) {
      if (types['http://www.w3.org/2007/ont/link#ProtocolEvent']) return true; // display everything for them

      var view = context.session.paneRegistry.byName('internal');
      return view && view.predicates && !!(typeof view.predicates[pred.uri] !== 'undefined');
    }

    var div = dom.createElement('div');
    div.setAttribute('class', 'internalPane');
    div.setAttribute('style', 'background-color: #ddddff; padding: 0.5em; border-radius: 1em;');

    function deleteRecursive(kb, folder) {
      var fetcher = kb.fetcher;

      if (!fetcher) {
        console.error('No fetcher available');
        return;
      }

      return new Promise(function (resolve, reject) {
        fetcher.load(folder).then(function () {
          var promises = kb.each(folder, _solidUi.ns.ldp('contains')).map(function (file) {
            if (kb.holds(file, _solidUi.ns.rdf('type'), _solidUi.ns.ldp('BasicContainer'))) {
              return deleteRecursive(kb, file);
            } else {
              console.log('deleteRecursive leaf file: ' + file);
              return fetcher.webOperation('DELETE', file.uri);
            }
          });
          Promise.all(promises).then(function () {
            console.log('deleteRecursive empty folder: ' + folder);
            fetcher.webOperation('DELETE', folder.uri).then(function () {
              console.log('Deleted Ok: ' + folder);
              resolve(undefined);
            })["catch"](function (err) {
              var str = 'Unable to delete ' + folder + ': ' + err;
              console.log(str);
              reject(new Error(str));
            });
            resolve(undefined);
          }, function (err) {
            alert(err);
            reject(err);
          });
        });
      });
    }

    var isDocument = subject.uri && !subject.uri.includes('#');

    if (isDocument) {
      var controls = div.appendChild(dom.createElement('table'));
      controls.style.width = '100%';
      controls.style.margin = '1em';
      var controlRow = controls.appendChild(dom.createElement('tr'));
      var deleteCell = controlRow.appendChild(dom.createElement('td'));
      var isFolder = subject.uri && subject.uri.endsWith('/') || store.holds(subject, _solidUi.ns.rdf('type'), _solidUi.ns.ldp('Container'));
      var noun = isFolder ? 'folder' : 'file';

      if (!isProtectedUri(subject)) {
        console.log(subject);

        var deleteButton = _solidUi.widgets.deleteButtonWithCheck(dom, deleteCell, noun, function () {
          if (!confirm("Are you sure you want to delete ".concat(subject, "? This cannot be undone."))) {
            return;
          } // @@ TODO Remove casing of store.fetcher


          if (!store.fetcher) {
            throw new Error('Store has no fetcher');
          }

          var promise = isFolder ? deleteRecursive(store, subject) || Promise.resolve() : store.fetcher.webOperation('DELETE', subject.uri) || Promise.resolve();
          promise.then(function () {
            var str = 'Deleted: ' + subject;
            console.log(str);
          })["catch"](function (err) {
            var str = 'Unable to delete ' + subject + ': ' + err;
            console.log(str);
            alert(str);
          });
        });

        deleteButton.style = 'height: 2em;';
        deleteButton["class"] = ''; // Remove hover hide

        deleteCell.appendChild(deleteButton);
      }

      var refreshCell = controlRow.appendChild(dom.createElement('td'));

      var refreshButton = _solidUi.widgets.button(dom, _solidUi.icons.iconBase + 'noun_479395.svg', 'refresh');

      refreshCell.appendChild(refreshButton);
      refreshButton.addEventListener('click', function () {
        if (!store.fetcher) {
          throw new Error('Store has no fetcher');
        }

        store.fetcher.refresh(subject, function (ok, errm) {
          var str;

          if (ok) {
            str = 'Refreshed OK: ' + subject;
          } else {
            str = 'Error refreshing: ' + subject + ': ' + errm;
          }

          console.log(str);
          alert(str);
        });
      });
    }

    var plist = store.statementsMatching(subject);
    var docURI = '';

    if (!store.fetcher) {
      throw new Error('Store has no fetcher');
    }

    if (subject.uri) {
      plist.push((0, _rdflib.st)(subject, (0, _rdflib.sym)('http://www.w3.org/2007/ont/link#uri'), subject.uri, // @@ TODO Remove casting
      store.fetcher.appNode));

      if (subject.uri.indexOf('#') >= 0) {
        docURI = subject.uri.split('#')[0];
        plist.push((0, _rdflib.st)(subject, (0, _rdflib.sym)('http://www.w3.org/2007/ont/link#documentURI'), subject.uri.split('#')[0], // @@ TODO Remove casting
        store.fetcher.appNode));
        plist.push((0, _rdflib.st)(subject, (0, _rdflib.sym)('http://www.w3.org/2007/ont/link#document'), (0, _rdflib.sym)(subject.uri.split('#')[0]), store.fetcher.appNode));
      } else {
        docURI = subject.uri;
      }
    }

    if (docURI) {
      if (!store.updater) {
        throw new Error('Store has no updater');
      }

      var ed = store.updater.editable(docURI);

      if (ed) {
        plist.push((0, _rdflib.st)(subject, (0, _rdflib.sym)('http://www.w3.org/ns/rww#editable'), (0, _rdflib.literal)(ed.toString()), store.fetcher.appNode));
      }
    } // @@ TODO get a proper type


    var outliner = context.getOutliner(dom);
    outliner.appendPropertyTRs(div, plist, false, filter);
    plist = store.statementsMatching(undefined, undefined, subject);
    outliner.appendPropertyTRs(div, plist, true, filter);
    return div;
  },
  predicates: {
    // Predicates used for inner workings. Under the hood
    'http://www.w3.org/2007/ont/link#request': 1,
    'http://www.w3.org/2007/ont/link#requestedBy': 1,
    'http://www.w3.org/2007/ont/link#source': 1,
    'http://www.w3.org/2007/ont/link#session': 2,
    // 2=  test neg but display
    'http://www.w3.org/2007/ont/link#uri': 1,
    'http://www.w3.org/2007/ont/link#documentURI': 1,
    'http://www.w3.org/2007/ont/link#document': 1,
    'http://www.w3.org/2007/ont/link#all': 1,
    // From userinput.js
    'http://www.w3.org/2007/ont/link#Document': 1,
    'http://www.w3.org/ns/rww#editable': 1,
    'http://www.w3.org/2000/01/rdf-schema#seeAlso': 1,
    'http://www.w3.org/2002/07/owl#': 1
  },
  classes: {
    // Things which are inherently already undercover
    'http://www.w3.org/2007/ont/link#ProtocolEvent': 1
  }
};

function isProtectedUri(subject) {
  // TODO: Could make the code below smarter by removing some of the redundancy by creating a recursive function, but did not bother now
  var siteUri = subject.site().uri;
  return subject.uri === siteUri || subject.uri === siteUri + 'profile/' || subject.uri === siteUri + 'profile/card' || subject.uri === siteUri + 'settings/' || subject.uri === siteUri + 'settings/prefs.ttl' || subject.uri === siteUri + 'settings/privateTypeIndex.ttl' || subject.uri === siteUri + 'settings/publicTypeIndex.ttl' || subject.uri === siteUri + 'settings/serverSide.ttl';
}

var _default = pane; // ends

exports["default"] = _default;
//# sourceMappingURL=internalPane.js.map