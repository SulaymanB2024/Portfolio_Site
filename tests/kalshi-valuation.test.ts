import test from 'node:test';
import { execFileSync } from 'node:child_process';

test('Kalshi valuation and publication contract', { timeout: 10000 }, () => {
  execFileSync(process.execPath, ['tools/test-kalshi-valuation.mjs'], {
    cwd: process.cwd(), stdio: 'pipe', timeout: 9000,
  });
});
