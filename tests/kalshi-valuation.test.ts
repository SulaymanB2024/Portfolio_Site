import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('Kalshi valuation and publication contract', { timeout: 10000 }, () => {
  execFileSync(process.execPath, ['tools/test-kalshi-valuation.mjs'], {
    cwd: process.cwd(), stdio: 'pipe', timeout: 9000,
  });
});

test('Kalshi hides stale valuations and forecasts until invalid assumptions are corrected', () => {
  const elements = new Map<string, any>();
  const makeElement = () => ({ value: '', textContent: '', style: {}, hidden: false,
    children: [] as any[], listeners: {} as Record<string, Function>,
    checkValidity() { return this.value !== '' && Number.isFinite(Number(this.value)); },
    addEventListener(name: string, fn: Function) { this.listeners[name] = fn; },
    replaceChildren(...children: any[]) { this.children = children; },
    append(child: any) { this.children.push(child); },
  });
  const element = (id: string) => {
    if (!elements.has(id)) elements.set(id, makeElement());
    return elements.get(id);
  };
  const defaults = { discount: '13', growth: '3', cash: '1', shock: '0', scenario: 'Base' };
  for (const [id, value] of Object.entries(defaults)) element(id).value = value;
  const form = { listeners: {} as Record<string, Function>,
    addEventListener(name: string, fn: Function) { this.listeners[name] = fn; },
    // The real button's id="reset" shadows the instance method through named access.
    reset: element('reset'),
  };
  vm.runInNewContext(readFileSync('public/research-assets/kalshi-valuation-2026/model-ui.js', 'utf8'), {
    document: { querySelector: () => form, getElementById: element, createElement: makeElement },
    HTMLFormElement: { prototype: { reset() { for (const [id, value] of Object.entries(defaults)) element(id).value = value; } } },
  });
  assert.equal(element('weighted').textContent, '$29.53bn');
  assert.equal(element('rows').children.length, 10);
  element('discount').value = '';
  form.listeners.input();
  assert(element('error').textContent);
  assert(element('results').hidden && element('annual-results').hidden);
  assert.equal(element('rows').children.length, 0);
  element('discount').value = '5'; element('growth').value = '6';
  form.listeners.input();
  assert.match(element('error').textContent, /discount > growth/);
  assert(element('results').hidden && element('annual-results').hidden);
  element('reset').listeners.click();
  assert.equal(element('error').textContent, '');
  assert(!element('results').hidden && !element('annual-results').hidden);
  assert.equal(element('weighted').textContent, '$29.53bn');
  assert.equal(element('rows').children.length, 10);
});
