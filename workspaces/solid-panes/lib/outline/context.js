"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContext = createContext;

var _index = require("../index");

function createContext(dom, paneRegistry, store, logic) {
  return {
    dom: dom,
    getOutliner: _index.getOutliner,
    session: {
      paneRegistry: paneRegistry,
      store: store,
      logic: logic
    }
  };
}
//# sourceMappingURL=context.js.map