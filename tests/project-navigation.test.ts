import test from 'node:test'
import assert from 'node:assert/strict'
import { workNarratives } from '../src/personal/projects/work-narratives.ts'
import { caseNarratives } from '../src/personal/projects/case-narratives.ts'
import { nextProject } from '../src/personal/projects/project-navigation.ts'
import { featuredProjects } from '../src/personal/content.ts'
import { projectSculptures } from '../src/personal/projects/project-sculptures.ts'

test('the four accepted featured projects form the same complete reading journey', () => {
  assert.deepEqual(featuredProjects.map(project => project.slug), ['chegg', 'sapien', 'void', 'miscellaneous'])
  for (const start of featuredProjects.map(project => project.slug)) {
    const visited = new Set<string>()
    let current = start
    for (let step = 0; step < featuredProjects.length; step++) {
      assert.ok(!visited.has(current), `${start}: repeated ${current} before the four projects`)
      visited.add(current)
      const destination = nextProject(current)!
      assert.ok(destination.name && workNarratives[destination.slug])
      current = destination.slug
    }
    assert.deepEqual([...visited].sort(), featuredProjects.map(project => project.slug).sort())
    assert.equal(current, start)
  }
})

test('every retained legacy account has a valid exit into the primary Work journey', () => {
  const existing = Object.keys({ ...workNarratives, ...caseNarratives }).sort()
  for (const start of existing) {
    const destination = nextProject(start)
    assert.ok(destination && featuredProjects.some(project => project.slug === destination.slug), start)
  }
  assert.equal(nextProject('unknown'), undefined)
})

test('new featured accounts use the accepted distinct sculptures without replacing legacy registrations', () => {
  assert.equal(projectSculptures.chegg.asset, 'work-investing-markets')
  assert.equal(projectSculptures.void.asset, 'work-atlas')
  assert.notEqual(projectSculptures.chegg.asset, projectSculptures.void.asset)
  for (const slug of ['internshipdeadlines', 'investing-markets', 'atlas', 'payrollpro', 'viralbench', 'sapien', 'miscellaneous'])
    assert.ok(projectSculptures[slug], slug)
})
