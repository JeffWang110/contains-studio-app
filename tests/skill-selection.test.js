import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/chat.js';
import { skillsByDept, skillCatalog, scenarios, validateSkillSelection } from '../src/skillCatalog.js';

test('recommendation ids are defined and department-safe', () => {
  for (const [dept, skills] of Object.entries(skillsByDept)) {
    assert.ok(skills.every(skill => Object.hasOwn(skillCatalog, skill)), dept);
    assert.ok(validateSkillSelection(dept, 'build', skills.slice(0, 5)));
  }
  assert.equal(validateSkillSelection('engineering', 'audit', ['ponytail']), false);
  assert.equal(validateSkillSelection('engineering', 'build', ['ponytail', 'ponytail']), false);
  assert.equal(validateSkillSelection('engineering', 'build', ['__proto__']), false);
  assert.equal(validateSkillSelection('design', 'build', ['ponytail']), false);
  assert.equal(Object.keys(scenarios).length, 4);
});

function response() {
  return { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; return this; },
    status(n) { this.code = n; return this; }, json(v) { this.body = v; return this; }, end() { return this; } };
}
const request = body => ({ method: 'POST', body, headers: { origin: 'http://localhost:5173' }, socket: { remoteAddress: '127.0.0.1' } });

test('rejects untrusted and non-build Ponytail selections before external API', async () => {
  for (const body of [
    { message: 'hi', deptId: 'design', scenario: 'build', skills: ['ponytail'] },
    { message: 'hi', deptId: 'engineering', scenario: 'audit', skills: ['ponytail'] },
    { message: 'hi', deptId: 'engineering', scenario: 'build', skills: ['fake'] },
    { message: 'hi', deptId: 'engineering', scenario: 'build', skills: 'test-driven-development' },
  ]) {
    const res = response();
    await handler(request(body), res);
    assert.equal(res.code, 400);
  }
});

test('selected methods are bounded guidance sent to model, not tool invocations', async () => {
  const oldFetch = globalThis.fetch;
  const oldKey = process.env.GEMINI_API_KEY;
  let prompt;
  globalThis.fetch = async (_url, options) => {
    prompt = JSON.parse(options.body).contents[0].parts[0].text;
    return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: '已回答' }] } }] }) };
  };
  process.env.GEMINI_API_KEY = 'local-test-only';
  try {
    const res = response();
    await handler(request({ message: '測試', agentName: 'rapid-prototyper', agentTitle: '快速原型師', agentDesc: '做 MVP',
      deptId: 'engineering', scenario: 'build', skills: ['ponytail', 'test-driven-development'] }), res);
    assert.equal(res.code, 200);
    assert.equal(res.body.reply, '已回答');
    assert.match(prompt, /ponytail/);
    assert.match(prompt, /未安裝、載入或執行 Hermes 技能/);
    assert.match(prompt, /使用者問題：測試/);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = oldKey;
  }
});
