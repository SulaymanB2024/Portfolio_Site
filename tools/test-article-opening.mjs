import { execFileSync } from 'node:child_process'
import { build } from 'vite'

// Use the project's installed JSX compiler. Test compilation is isolated from
// the shared preview and release output; no dependency installation is needed.
const output = '.cache/article-quality-20261005/test-runtime'
const names = ['article-opening', 'research-diagram', 'research-comparison', 'research-process']
for (const name of names) {
  await build({
    build: {
      ssr: `tests/${name}.test.tsx`,
      outDir: output,
      emptyOutDir: name === names[0],
      copyPublicDir: false,
    },
  })
}
execFileSync(process.execPath, ['--test', ...names.map(name => `${output}/${name}.test.js`)], { stdio: 'inherit' })
