import test from 'node:test'
import assert from 'node:assert/strict'
import { interestFraming, interestPixelRatio } from '../src/personal/about/interest-layout.ts'

test('gallery centers remain aligned with the three CSS columns on resize', () => {
  for (const [width,height,stacked] of [[1140,324,false],[1600,420,false],[338,320,true],[760,430,true]] as const) {
    const frame=interestFraming(width,height,stacked,null)
    const pixelsPerWorldUnit=height/(2*Math.tan(16*Math.PI/180)*frame.cameraZ)
    assert(Math.abs(frame.columnSpacing*pixelsPerWorldUnit-width/3)<1e-10)
    assert(Math.abs(frame.focusX-(stacked?0:-frame.columnSpacing*3*.165))<1e-10)
    assert(frame.scoreScale>0&&frame.knightScale>0&&frame.bassScale>0)
  }
})

test('phone and desktop backing surfaces stay inside their pixel limits at high DPR', () => {
  for(const touch of [false,true])for(const [width,height] of [[338,430],[800,430],[1600,640],[5000,3000]])for(const deviceRatio of [1,1.5,2,3]) {
    const ratio=interestPixelRatio(width,height,deviceRatio,touch)
    assert(width*height*ratio*ratio<=(touch?400_000:2_200_000))
    const subdivision=Math.min(deviceRatio,1.5)/ratio
    assert(Math.abs(subdivision-Math.round(subdivision))<1e-10,'grain lands on integer pixel subdivisions')
  }
})

test('selected phone views retain their fitted camera and centered interaction surface', () => {
  assert.equal(interestFraming(338,430,true,'knight').cameraZ,8)
  assert.equal(interestFraming(338,430,true,'bass').cameraZ,7.5)
  assert.equal(interestFraming(338,430,true,'score').cameraZ,6.2)
  for(const selected of ['bass','score','knight'] as const)assert.equal(interestFraming(338,430,true,selected).focusX,0)
})
