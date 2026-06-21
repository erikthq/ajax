import MiniSearch from "minisearch";
import { html } from "html.js";

const dialog = document.getElementById("search-dialog");
const input = document.getElementById("search-input");
const popularSection = document.getElementById("search-popular");
const popularList = document.getElementById("search-popular-list");
const resultsSection = document.getElementById("search-results-section");
const resultsList = document.getElementById("search-results");
const emptyMsg = document.getElementById("search-empty");

const base = document.querySelector('meta[name="docgen-base"]')?.content ?? "";

let searchIndex = null;
let popularItems = [];

function resultHtml(r) {
  return html`<li>
    <a href="${base}${r.id}" class="button ghost">
      <span style="display: grid;">
        <span class="search-result-title">${r.title}</span>
        ${r.description
          ? html`<small style="max-width: 60ch">${r.description}</small>`
          : ""}
      </span>

      <code class="search-result-route">${r.id === "/" ? "Home" : r.id}</code>
    </a>
  </li>`;
}

async function loadIndex() {
  if (searchIndex) return;
  const res = await fetch(base + "/search-index.json");
  const data = await res.json();
  searchIndex = MiniSearch.loadJSON(data.index, {
    fields: ["title", "content"],
    storeFields: ["title", "id", "description"],
  });
  popularItems = data.popular || [];
  popularList.innerHTML = popularItems.map(resultHtml).join("");
}

function showPopular() {
  popularSection.hidden = popularItems.length === 0;
  resultsSection.hidden = true;
}

function showResults(items, query) {
  popularSection.hidden = true;
  resultsSection.hidden = false;
  resultsList.innerHTML = items.map(resultHtml).join("");
  emptyMsg.hidden = !query || items.length > 0;
}

async function openSearch() {
  dialog.showModal();
  input.focus();
  await loadIndex();
  if (!input.value.trim()) showPopular();
}

document.querySelectorAll(".search-trigger").forEach((btn) => {
  btn.addEventListener("click", openSearch);
});

document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    openSearch();
  }
});

input.addEventListener("input", async (e) => {
  const query = e.target.value.trim();
  if (!query) {
    showPopular();
    return;
  }
  await loadIndex();
  const items = searchIndex
    .search(query, { boost: { title: 2 }, fuzzy: 0.2, prefix: true })
    .slice(0, 8);
  showResults(items, query);
});

dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});

[popularList, resultsList].forEach((list) => {
  list.addEventListener("click", (e) => {
    if (e.target.closest("a")) dialog.close();
  });
});
