import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const documentHtml = html.split("<script>")[0];
const script = html.split("<script>")[1]?.split("</script>")[0];

test("client script parses", () => {
  assert.ok(script, "inline client script should exist");
  new vm.Script(script);
});

test("does not include built-in audio or speech synthesis", () => {
  assert.doesNotMatch(html, /speechSynthesis|SpeechSynthesisUtterance|<(audio|video)\b/i);
  assert.doesNotMatch(html, /stop audio|speech speed|listen to introduction/i);
});

test("includes core screen-reader structure", () => {
  for (const landmark of ["header", "nav", "main", "footer"]) {
    assert.match(html, new RegExp(`<${landmark}\\b`, "i"));
  }
  assert.match(html, /<html lang="en">/i);
  assert.match(html, /<a class="skip-link" href="#lesson">/i);
  assert.match(html, /role="status"[^>]*aria-live="polite"[^>]*aria-atomic="true"/i);
  assert.match(html, /<fieldset class="choice-group">/i);
  assert.match(html, /<legend>/i);
  assert.match(html, /<th scope="col">/i);
});

test("static document IDs are unique", () => {
  const ids = [...documentHtml.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  assert.deepEqual(duplicates, []);
});
