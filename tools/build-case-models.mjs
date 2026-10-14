/** Compatibility entry point for the original case-study asset command. */
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

const selected=process.argv.slice(2)
const result=spawnSync(process.execPath,[resolve(import.meta.dirname,'build-project-sculptures.mjs'),...(selected.length?selected:['payrollpro','viralbench'])],{stdio:'inherit'})
if(result.error)throw result.error
process.exitCode=result.status??1
