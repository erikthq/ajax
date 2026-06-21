import { defineDocs } from "@erikt/docgen";

export default defineDocs({
  siteName: 'Ajax',
  structure: [
    { label: "Getting started", path: "/getting-started", icon: "book" },
    { label: "API", path: "/api", icon: "api-app" },
    { label: "Plugins", path: "/plugins", icon: "plug" },
  ],
});
