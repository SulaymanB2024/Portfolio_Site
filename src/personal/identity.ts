import { resumeProfile, resumeReview } from './profile-copy.ts'
import { contact } from './content.ts'

// Public identity follows the reviewed biography, rather than historical PDFs.
export const identity = {
  name: resumeProfile.name,
  givenName: 'Sulayman',
  familyName: 'Bowles',
  summary: resumeProfile.currentSummary,
  homeSummary: 'I study finance at UT Austin, work in product and growth, and build independent software.',
  authorDescription: 'Sulayman Bowles studies finance at UT Austin and writes about software, AI systems, and markets.',
  reviewed: resumeReview.asOf,
  education: resumeProfile.education,
  profiles: [
    { label: 'LinkedIn', href: contact.linkedin },
    { label: 'GitHub', href: 'https://github.com/SulaymanB2024' },
    { label: 'Technical site', href: 'https://sulayman-bowles.tech/' },
  ],
}
