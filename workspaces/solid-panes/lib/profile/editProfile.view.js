"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _solidUi = require("solid-ui");

var _rdflib = require("rdflib");

var _profile = require("./profile.dom");

/**
 * Profile Editing App Pane
 *
 * Unlike view panes, this is available any place whatever the real subject,
 * and allows the user to edit their own profile.
 *
 * Usage: paneRegistry.register('profile/profilePane')
 * or standalone script adding onto existing mashlib.
 */

/* babel-plugin-inline-import './preferencesFormText.ttl' */
var preferencesFormText = "    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n    @prefix solid: <http://www.w3.org/ns/solid/terms#>.\n    @prefix ui: <http://www.w3.org/ns/ui#>.\n    @prefix : <#>.\n\n    :this\n      <http://purl.org/dc/elements/1.1/title> \"Profile style form\" ;\n      a ui:Form ;\n      ui:part :backgroundColor, :highlightColor;\n      ui:parts ( :backgroundColor :highlightColor ).\n\n  :backgroundColor a ui:ColorField; ui:property solid:profileBackgroundColor;\n    ui:label \"Background color\"; ui:default \"#ffffff\".\n    :highlightColor a ui:ColorField; ui:property solid:profileHighlightColor;\n      ui:label \"Highlight color\"; ui:default \"#000000\".\n\n  ";
var highlightColor = _solidUi.style.highlightColor || '#7C4DFF';
var editProfileView = {
  global: true,
  icon: _solidUi.icons.iconBase + 'noun_492246.svg',
  name: 'editProfile',
  label: function label() {
    return null;
  },
  render: function render(subject, context) {
    var dom = context.dom;
    var store = context.session.store;

    function complainIfBad(ok, mess) {
      if (ok) return;
      div.appendChild(_solidUi.widgets.errorMessageBlock(dom, mess, '#fee'));
    }

    function renderProfileForm(div, subject) {
      var preferencesForm = (0, _rdflib.sym)('https://solid.github.io/solid-panes/dashboard/profileStyle.ttl#this');
      var preferencesFormDoc = preferencesForm.doc();

      if (!store.holds(undefined, undefined, undefined, preferencesFormDoc)) {
        // If not loaded already
        (0, _rdflib.parse)(preferencesFormText, store, preferencesFormDoc.uri, 'text/turtle', function () {
          return null;
        }); // Load form directly
      }

      _solidUi.widgets.appendForm(dom, div, {}, subject, preferencesForm, editableProfile, complainIfBad);
    } // renderProfileForm


    var div = dom.createElement('div');
    var editableProfile;
    div.setAttribute('style', "border: 0.3em solid ".concat(highlightColor, "; border-radius: 0.5em; padding: 0.7em; margin-top:0.7em;"));
    var table = div.appendChild(dom.createElement('table')); // const top = table.appendChild(dom.createElement('tr'))

    var main = table.appendChild(dom.createElement('tr'));
    var bottom = table.appendChild(dom.createElement('tr'));
    var statusArea = bottom.appendChild(dom.createElement('div'));
    statusArea.setAttribute('style', 'padding: 0.7em;');

    function comment(str) {
      var p = main.appendChild(dom.createElement('p'));
      p.setAttribute('style', 'padding: 1em;');
      p.textContent = str;
      return p;
    }

    function heading(str) {
      var h = main.appendChild(dom.createElement('h3'));
      h.setAttribute('style', 'color:' + highlightColor + ';');
      h.textContent = str;
      return h;
    }

    var profileContext = {
      dom: dom,
      div: main,
      statusArea: statusArea,
      me: null
    };

    _solidUi.authn.logInLoadProfile(profileContext).then(function (loggedInContext) {
      var me = loggedInContext.me;
      heading('Edit your public profile');
      var profile = me.doc();

      if (!store.updater) {
        throw new Error('Store has no updater');
      }

      if (store.any(me, _solidUi.ns.solid('editableProfile'))) {
        editableProfile = store.any(me, _solidUi.ns.solid('editableProfile'));
      } else if (store.updater.editable(profile.uri, store)) {
        editableProfile = profile;
      } else {
        statusArea.appendChild(_solidUi.widgets.errorMessageBlock(dom, "\u26A0\uFE0F Your profile ".concat(profile, " is not editable, so we cannot do much here."), 'straw'));
        return;
      }

      comment("Everything you put here will be public.\n        There will be other places to record private things.");
      heading('Your contact information');
      main.appendChild((0, _profile.paneDiv)(context, me, 'contact'));
      heading('People you know who have WebIDs');
      comment("This is your public social network.\n        Only put people here to whom you are happy to be publicly connected.\n        (You can always keep private track of friends and family in your contacts.)"); // TODO: would be useful to explain what it means to "drag people"
      //       what is it that is being dragged?
      //       is there a way to search for people (or things to drag) on this page?

      if (editableProfile) {
        comment('Drag people onto the target below to add people.');
      }

      _solidUi.widgets.attachmentList(dom, me, main, {
        doc: profile,
        modify: !!editableProfile,
        predicate: _solidUi.ns.foaf('knows'),
        noun: 'friend'
      });

      heading('The style of your public profile');
      renderProfileForm(main, me);
      heading('Thank you for filling your profile.');
    })["catch"](function (error) {
      statusArea.appendChild(_solidUi.widgets.errorMessageBlock(dom, error, '#fee'));
    });

    return div;
  }
};
var _default = editProfileView;
exports["default"] = _default;
//# sourceMappingURL=editProfile.view.js.map