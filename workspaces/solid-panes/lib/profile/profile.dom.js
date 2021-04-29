"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paneDiv = paneDiv;

function paneDiv(context, subject, paneName) {
  var view = context.session.paneRegistry.byName(paneName);

  if (!view) {
    var warning = context.dom.createElement('div');
    warning.innerText = "Unable to load view: ".concat(paneName);
    return warning;
  }

  var viewContainer = view.render(subject, context);
  viewContainer.setAttribute('style', 'border: 0.3em solid #444; border-radius: 0.5em');
  return viewContainer;
}
//# sourceMappingURL=profile.dom.js.map