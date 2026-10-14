import test from 'node:test'
import assert from 'node:assert/strict'
import { workNarratives } from '../src/personal/projects/work-narratives.ts'
import { caseNarratives } from '../src/personal/projects/case-narratives.ts'
import { nextProject } from '../src/personal/projects/project-navigation.ts'

test('a visitor can continue through every existing project exactly once before returning', () => {
  const existing = Object.keys({ ...workNarratives, ...caseNarratives }).sort()
  for (const start of existing) {
    const visited = new Set<string>()
    let current = start
    for (let step = 0; step < existing.length; step++) {
      assert.ok(!visited.has(current), `${start}: repeated ${current} before all projects`)
      visited.add(current)
      const destination = nextProject(current)
      assert.ok(destination && destination.name)
      current = destination.slug
    }
    assert.deepEqual([...visited].sort(), existing, `${start}: omitted a project`)
    assert.equal(current, start)
  }
  assert.equal(nextProject('unknown'), undefined)
})
