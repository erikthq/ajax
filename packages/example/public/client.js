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
  target: ".cart-update-form",
  trigger: "change",
  swaps: [
    {
      replace: "#main",
      with: "#main",
      mode: "innerHTML",
    },
    {
      replace: "#cart-button",
      with: "#cart-button",
      mode: "outerHTML",
      transitions: ["cart-add"],
    },
  ],
});

window.qute.register({
  target: "#product form",
  swaps: [
    {
      replace: "#cart-button",
      with: "#cart-button",
      mode: "outerHTML",
      transitions: ["cart-add"],
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
