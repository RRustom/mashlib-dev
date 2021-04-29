"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _solidUi = require("solid-ui");

/*   Sharing Pane
 **
 ** This outline pane allows a user to view and adjust the sharing -- access control lists
 ** for anything which has that capability.
 **
 ** I am using in places single quotes strings like 'this'
 ** where internationalization ("i18n") is not a problem, and double quoted
 ** like "this" where the string is seen by the user and so I18n is an issue.
 */
var sharingPane = {
  icon: _solidUi.icons.iconBase + 'padlock-timbl.svg',
  name: 'sharing',
  label: function label(subject, context) {
    var store = context.session.store;
    var t = store.findTypeURIs(subject);
    if (t[_solidUi.ns.ldp('Resource').uri]) return 'Sharing'; // @@ be more sophisticated?

    if (t[_solidUi.ns.ldp('Container').uri]) return 'Sharing'; // @@ be more sophisticated?

    if (t[_solidUi.ns.ldp('BasicContainer').uri]) return 'Sharing'; // @@ be more sophisticated?
    // check being allowed to see/change sharing?

    return null; // No under other circumstances
  },
  render: function render(subject, context) {
    var dom = context.dom;
    var store = context.session.store;
    var noun = getNoun();
    var div = dom.createElement('div');
    div.classList.add('sharingPane');

    _solidUi.aclControl.preventBrowserDropEvents(dom);

    div.appendChild(_solidUi.aclControl.ACLControlBox5(subject, context, noun, store));
    return div;

    function getNoun() {
      var t = store.findTypeURIs(subject);

      if (t[_solidUi.ns.ldp('BasicContainer').uri] || t[_solidUi.ns.ldp('Container').uri]) {
        return 'folder';
      }

      return 'file';
    }
  }
};
var _default = sharingPane;
exports["default"] = _default;
//# sourceMappingURL=sharingPane.js.map