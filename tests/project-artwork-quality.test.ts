import test from 'node:test'
import assert from 'node:assert/strict'
import { projectArtworkSize } from '../src/personal/projects/project-artwork-quality.ts'

test('detailed targets retain retina samples within phone and desktop memory budgets', () => {
  for (const mobile of [true,false]) for (const [w,h,dpr] of [[390,844,3],[1235,984,2],[7680,4320,3]]) {
    const size=projectArtworkSize(w,h,dpr,mobile)
    assert(size.width*size.height <= (mobile?1_200_000:2_200_000))
    assert(size.scaleX<=2 && size.scaleY<=2)
    assert(Math.abs(size.scaleX-size.scaleY)<=1/Math.min(w,h))
    const reduced=projectArtworkSize(w,h,dpr,mobile,.8)
    assert(reduced.width<=size.width*.8+1 && reduced.height<=size.height*.8+1)
  }
  assert(projectArtworkSize(390,844,2,true).scaleX>1.8)
})

test('invalid dimensions, device ratios and quality never allocate empty or unbounded targets', () => {
  for (const value of [NaN,Infinity,-1,0]) {
    const size=projectArtworkSize(value,value,value,true,value)
    assert(size.width>=1 && size.height>=1)
    assert(Number.isFinite(size.width*size.height) && size.width*size.height<=1_200_000)
  }
})
