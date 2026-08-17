import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const articlePath = path.join(root, 'src/content/optimumDebtWallArticle.ts');
const packagePath = path.join(root, 'package.json');
const selfPath = fileURLToPath(import.meta.url);

function replaceOnce(content, needle, replacement, label) {
  const occurrences = content.split(needle).length - 1;
  if (occurrences !== 1) {
    throw new Error(`${label}: expected one match, found ${occurrences}`);
  }
  return content.replace(needle, replacement);
}

let article = fs.readFileSync(articlePath, 'utf8');
article = replaceOnce(
  article,
  "title: 'The capital structure has to be resized to the cash flow'",
  "title: 'Debt must be resized to cash flow'",
  'conclusion title',
);
article = replaceOnce(
  article,
  "content: \"CSC restricted owes $21.780 billion of disclosed principal and approximately $1.441 billion of annual stated-rate coupon, while management's own plan holds restricted adjusted EBITDA near $1.0-$1.1 billion and capex at $0.5-$0.6 billion through 2031. A maturity extension alone preserves the deficit. A viable restructuring needs principal and coupon reduction, new money, and/or a negotiated contribution of Optimum value from outside the restricted silo.\"",
  "content: \"CSC restricted owes $21.780 billion of principal and roughly $1.441 billion of annual stated-rate coupon, while management's plan keeps restricted adjusted EBITDA near $1.0-$1.1 billion and capex at $0.5-$0.6 billion through 2031. Extending maturities alone preserves the deficit. A viable restructuring must reduce principal, cash coupon, or both, unless outside Optimum value is contributed.\"",
  'conclusion copy',
);
article = replaceOnce(
  article,
  "title: 'The debt has to be resized to the cash flow, or supplemented with value from outside it'",
  "title: 'Debt must be resized to cash flow'",
  'conclusion section title',
);
fs.writeFileSync(articlePath, article, 'utf8');

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
if (packageJson.scripts?.postinstall !== 'node scripts/fix-optimum-article-before-install.mjs') {
  throw new Error('Temporary postinstall hook was not present');
}
delete packageJson.scripts.postinstall;
fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8');
fs.unlinkSync(selfPath);
console.log('Applied Optimum conclusion contract fix and removed temporary installer.');
