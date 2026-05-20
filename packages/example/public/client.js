import { qute } from "@qute/core";

qute.register({
  source: "#link-home",
  swaps: [
    {
      source: "#main",
      target: "#main",
      mode: "innerHTML",
      transitions: ["fade"],
    },
  ],
});

qute.register({
  source: "#link-about",
  swaps: [
    {
      source: "#main",
      target: "#main",
      mode: "innerHTML",
      transitions: ["slide-left"],
    },
  ],
});

qute.register({
  source: "#login-form form",
  swaps: [
    {
      source: "#login-form",
      target: "#form-response",
      mode: "innerHTML",
      transitions: ["form-submitted"],
    },
    {
      source: "#profile",
      target: "#user",
      mode: "outerHTML",
      transitions: ["user-login"],
    },
  ],
});
