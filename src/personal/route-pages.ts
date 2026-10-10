import { deferredPage } from './deferred-page'
import type { OutreachCompanyContext } from './outreach-context'

// Intent warmup, the shell and the mounted page share exactly one module request.
export const homePage = deferredPage<{ dark: boolean; onLandingActiveChange: (active: boolean) => void }>(() => import('./HomePage'))
export const recruiterPage = deferredPage<{ company: OutreachCompanyContext }>(() => import('./recruiter/RecruiterLandingPage'))
export const workPage = deferredPage<{ dark: boolean }>(() => import('./WorkCollection').then(module => ({ default: module.WorkPage })))
export const writingPage = deferredPage(() => import('./editorial/WritingIndex'))
export const topicPage = deferredPage<{ slug: string }>(() => import('./editorial/TopicPage'))
export const articlePage = deferredPage(() => import('./editorial/ArticlePage'))
export const projectPage = deferredPage(() => import('./projects/ProjectNarrativePage'))
export const resumePage = deferredPage(() => import('./editorial/ResumePage'))
export const caseStudyPage = deferredPage(() => import('./projects/CaseStudyPage'))
export const aboutPage = deferredPage(() => import('./about/AboutPage'))
export const contactPage = deferredPage(() => import('./contact/ContactPage'))

export function prepareRoutePage(route: string): Promise<unknown> {
  if (route === 'recruiter') return recruiterPage.load()
  if (route === '' || route === 'home') return homePage.load()
  if (route === 'work') return workPage.load()
  if (route === 'writing') return writingPage.load()
  if (route.startsWith('topics/')) return topicPage.load()
  if (route === 'about') return aboutPage.load()
  if (route === 'resume') return resumePage.load()
  if (route === 'contact') return contactPage.load()
  if (route.startsWith('writing/')) return articlePage.load()
  if (['work/atlas', 'work/payrollpro', 'work/viralbench'].includes(route)) return caseStudyPage.load()
  if (['work/internshipdeadlines', 'work/sapien', 'work/investing-markets', 'work/miscellaneous'].includes(route)) return projectPage.load()
  return Promise.resolve()
}
