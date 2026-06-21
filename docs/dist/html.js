export class SafeHtml {
  /** @param {string} value */
  constructor(value) {
    /** @type {string} */
    this.value = value;
  }
  /** @returns {string} */
  toString() {
    return this.value;
  }
}

/** @param {string} value @returns {SafeHtml} */
export function safe(value) {
  return new SafeHtml(value);
}

/** @param {unknown} value @returns {string} */
function insert(value) {
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(insert).join("");
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** @param {TemplateStringsArray} strings @param {...unknown} values @returns {SafeHtml} */
export function html(strings, ...values) {
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += insert(values[i]);
    result += strings[i + 1];
  }
  return new SafeHtml(result);
}
