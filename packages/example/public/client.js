import { qute } from "@qute/core";

window.addEventListener("qute:before", (e) => {
  console.log("qute:before", e);
});

window.addEventListener("qute:after", (e) => {
  console.log("qute:after", e);
});

window.addEventListener("qute:error", (e) => {
  console.error("qute:error", e);
});

qute.register({
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

qute.register({
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

qute.register({
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

qute.register({
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
