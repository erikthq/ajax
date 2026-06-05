// src/index.ts
import { Idiomorph } from "idiomorph";
function morphSwap(oldEl, newEl, mode) {
  Idiomorph.morph(oldEl, newEl, {
    morphStyle: mode === "innerHTML" ? "innerHTML" : "outerHTML"
  });
  return oldEl;
}
var morphPlugin = { swap: morphSwap };
export {
  morphPlugin
};
//# sourceMappingURL=morph.js.map
