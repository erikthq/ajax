import { morphPlugin } from "/morph.js";
import { preloadPlugin } from "/preload.js";

window.qute.use(
  preloadPlugin({ strategy: ["prefetch", "prerender"], ignore: "/cart" }),
);

window.addEventListener("qute:before", (e) => {
  console.log("qute:before", e);
});

window.addEventListener("qute:after", (e) => {
  console.log("qute:after", e);
});

window.addEventListener("qute:error", (e) => {
  console.error("qute:error", e);
});

window.qute.register({
  target: "#link-home",
  history: "push",
  swaps: [
    {
      replace: "#main",
      with: "#main",
      mode: "innerHTML",
      transitions: ["fade"],
    },
  ],
});

window.qute.register({
  target: "#link-store",
  history: "push",
  swaps: [
    {
      replace: "#main",
      with: "#main",
      mode: "innerHTML",
      transitions: ["slide-left"],
    },
  ],
});

window.qute.register({
  target: ".variant-link",
  history: "replace",
  swaps: [
    {
      replace: "#product",
      with: "#product",
      mode: "outerHTML",
      plugin: morphPlugin,
      transitions: ["variant-change"],
    },
  ],
});

window.qute.register({
  target: "#link-about",
  history: "push",
  swaps: [
    {
      replace: "#main",
      with: "#main",
      mode: "innerHTML",
      transitions: ["slide-left"],
    },
  ],
});

window.qute.register({
  target: "#link-login",
  history: "push",
  swaps: [
    {
      replace: "#main",
      with: "#main",
      mode: "innerHTML",
      transitions: ["slide-left"],
    },
  ],
});

window.qute.register({
  target: "#user form",
  swaps: [
    {
      replace: "#user",
      with: "#profile",
      mode: "outerHTML",
    },
  ],
});

window.qute.register({
  target: "#cart-button",
  history: "push",
  swaps: [
    {
      replace: "#main",
      with: "#main",
      mode: "innerHTML",
      transitions: ["slide-left"],
    },
  ],
});

window.qute.register({
  target: "#cart-page form",
  trigger: ["change", "submit"],
  swaps: [
    {
      replace: "#cart-page ul",
      with: ["#cart-page ul", "#cart-page .empty"],
      mode: "outerHTML",
      transitions: ["update-cart-page"],
      if: (current, next) => current.children.length !== next.children.length,
    },
    {
      replace: "#cart-button",
      mode: "outerHTML",
      transitions: ["update-cart-count"],
    },
  ],
});

window.qute.register({
  target: "#product form",
  swaps: [
    {
      replace: "#cart-button",
      with: "#cart-button",
      mode: "innerHTML",
      transitions: ["update-cart-count"],
    },
  ],
});

window.qute.register({
  target: "#login-form form",
  swaps: [
    {
      replace: "#login-form",
      with: "#form-response",
      mode: "innerHTML",
      transitions: ["form-submitted"],
    },
    {
      replace: "#profile",
      with: "#user",
      mode: "outerHTML",
      transitions: ["user-login"],
    },
  ],
});

let dir = "down";

function change() {
  document.startViewTransition({
    update: () => {
      document.querySelector(".idle-view-transition").style.translate =
        dir === "down" ? "0 100px" : "0 0px";

      if (dir === "down") {
        dir = "up";
      } else {
        dir = "down";
      }
    },
    types: ["idle-view-transition"],
  });
}

setTimeout(change, 100);
// setInterval(change, 3000);
