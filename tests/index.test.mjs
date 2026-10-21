import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import * as api from "../dist/index.js";
test("leading and latest trailing", () => {
  const seen = [];
  const t = api.throttle((x) => seen.push(x), 100);
  t(1);
  t(2);
  t(3);
  t.flush();
  t.cancel();
  assert.deepEqual(seen, [1, 3]);
});
test("leading only", () => {
  let n = 0;
  const t = api.throttle(() => n++, 100, false);
  t();
  t();
  t.cancel();
  assert.equal(n, 1);
});
test("opens after interval", async () => {
  let n = 0;
  const t = api.throttle(() => n++, 2, false);
  t();
  await new Promise((r) => setTimeout(r, 10));
  t();
  t.cancel();
  assert.equal(n, 2);
});
