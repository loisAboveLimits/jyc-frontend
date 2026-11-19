/**
 * Splits an HTML string into its top-level parts, so each top-level element
 * can be rendered as a real React element (with its inner HTML set raw)
 * instead of putting the whole string inside an extra wrapper <div>.
 *
 *   splitHtmlRoots('<div class="a">Hi <b>there</b></div> ok')
 *   -> [ { type: "element", tag: "div", attrs: { class: "a" }, inner: "Hi <b>there</b>" },
 *        { type: "text", text: " ok" } ]
 *
 * Small, dependency-free and deterministic (the same on the server and in
 * the browser). Comments are dropped; whitespace-only text is dropped.
 */
export type HtmlRoot =
  | { type: "element"; tag: string; attrs: Record<string, string>; inner: string; void: boolean }
  | { type: "text"; text: string };

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
]);
/** Elements whose content is not HTML (their "<" does not start a tag). */
const RAW_TEXT = new Set(["script", "style", "textarea", "title"]);

// A start/end tag with properly quoted attribute values (so ">" inside quotes is fine).
const TAG = /<(\/?)([a-zA-Z][\w:.-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/y;
const ATTR = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

const NAMED: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

/** Decodes HTML entities (&amp; &#39; &#x2019; …) in text or attribute values. */
export function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return NAMED[code.toLowerCase()] ?? match;
  });
}

function parseAttrs(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const m of source.matchAll(ATTR)) {
    attrs[m[1]] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

export function splitHtmlRoots(html: string): HtmlRoot[] {
  const roots: HtmlRoot[] = [];
  let i = 0;
  let text = "";

  const flushText = () => {
    if (text.trim()) roots.push({ type: "text", text: decodeEntities(text) });
    text = "";
  };

  while (i < html.length) {
    if (html.startsWith("<!--", i)) {
      const end = html.indexOf("-->", i + 4);
      i = end < 0 ? html.length : end + 3;
      continue;
    }
    TAG.lastIndex = i;
    const open = html[i] === "<" ? TAG.exec(html) : null;
    if (!open || open[1] === "/") {
      // Plain text (or a stray end tag) at the top level.
      text += html[i];
      i += 1;
      continue;
    }

    flushText();
    const tag = open[2];
    const name = tag.toLowerCase();
    const attrs = parseAttrs(open[3]);
    const start = i + open[0].length;

    if (VOID.has(name) || open[4] === "/") {
      roots.push({ type: "element", tag, attrs, inner: "", void: true });
      i = start;
      continue;
    }

    // Find the matching end tag, counting nested elements with the same name.
    let depth = 1;
    let j = start;
    let innerEnd = html.length;
    let after = html.length;
    if (RAW_TEXT.has(name)) {
      const close = html.toLowerCase().indexOf(`</${name}`, start);
      if (close >= 0) {
        innerEnd = close;
        after = html.indexOf(">", close) + 1 || html.length;
      }
    } else {
      while (j < html.length) {
        if (html.startsWith("<!--", j)) {
          const end = html.indexOf("-->", j + 4);
          j = end < 0 ? html.length : end + 3;
          continue;
        }
        TAG.lastIndex = j;
        const m = html[j] === "<" ? TAG.exec(html) : null;
        if (!m) {
          j += 1;
          continue;
        }
        if (m[2].toLowerCase() === name && m[4] !== "/") {
          depth += m[1] === "/" ? -1 : 1;
          if (depth === 0) {
            innerEnd = j;
            after = j + m[0].length;
            break;
          }
        }
        j += m[0].length;
      }
    }

    roots.push({ type: "element", tag, attrs, inner: html.slice(start, innerEnd), void: false });
    i = after;
  }

  flushText();
  return roots;
}

/** HTML attribute names that React spells differently. */
const REACT_NAMES: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  colspan: "colSpan",
  rowspan: "rowSpan",
  srcset: "srcSet",
  crossorigin: "crossOrigin",
  enctype: "encType",
  novalidate: "noValidate",
  contenteditable: "contentEditable",
  spellcheck: "spellCheck",
  frameborder: "frameBorder",
  allowfullscreen: "allowFullScreen",
  datetime: "dateTime",
  accesskey: "accessKey",
  "accept-charset": "acceptCharset",
  "http-equiv": "httpEquiv",
};
const BOOLEAN = new Set([
  "required", "disabled", "checked", "selected", "multiple", "hidden", "open", "readonly", "autofocus",
  "novalidate", "allowfullscreen", "async", "defer", "loop", "muted", "playsinline", "controls", "autoplay", "inert",
]);

/** Turns parsed HTML attributes into React props (class -> className, style string -> object, …). */
export function toReactProps(attrs: Record<string, string>): Record<string, unknown> {
  const props: Record<string, unknown> = {};
  for (const [rawName, value] of Object.entries(attrs)) {
    const lower = rawName.toLowerCase();
    if (lower.startsWith("on")) continue; // no inline event handlers from HTML
    if (lower === "style") {
      const style: Record<string, string> = {};
      for (const rule of value.split(";")) {
        const colon = rule.indexOf(":");
        if (colon < 0) continue;
        const prop = rule.slice(0, colon).trim();
        const val = rule.slice(colon + 1).trim();
        if (!prop) continue;
        const key = prop.startsWith("--") ? prop : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
        style[key] = val;
      }
      props.style = style;
      continue;
    }
    if (BOOLEAN.has(lower)) {
      props[REACT_NAMES[lower] ?? lower] = value === "" || value.toLowerCase() === lower || value === "true";
      continue;
    }
    if (lower.startsWith("data-") || lower.startsWith("aria-")) {
      props[lower] = value;
      continue;
    }
    props[REACT_NAMES[lower] ?? rawName] = value;
  }
  return props;
}
