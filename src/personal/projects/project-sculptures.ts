export interface ProjectSculpture {
  yaw: number
  pitch: number
  phase: number
  asset?: string
}

/** Project presentation only; aliases retain the approved GLB registrations. */
export const projectSculptures: Record<string, ProjectSculpture> = {
  chegg: { asset: 'work-investing-markets', yaw: -.16, pitch: .09, phase: 3.1 },
  void: { asset: 'work-atlas', yaw: .32, pitch: .1, phase: 2.4 },
  internshipdeadlines: { yaw: -.32, pitch: .12, phase: .3 },
  sapien: { yaw: -.32, pitch: -.05, phase: 1.8 },
  'investing-markets': { yaw: -.16, pitch: .09, phase: 3.1 },
  miscellaneous: { yaw: .3, pitch: .08, phase: 4.4 },
  atlas: { yaw: -.16, pitch: .04, phase: 2.4 },
  payrollpro: { yaw: -.24, pitch: .08, phase: 1.1 },
  viralbench: { yaw: -.23, pitch: .07, phase: 3.6 },
}
