import { useEffect, useLayoutEffect } from 'react';
import type { WorkStudy } from '../content/workStudies';
import { workStudyPath } from '../content/workStudies';
import { installWorkStudyInteractions } from '../content/workStudyInteractions';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import '../styles/work-studies.css';

/**
 * Case studies are complete authored documents before JavaScript runs.
 * React only adds progressive interactions; it never reparses authored HTML.
 */
export default function WorkStudyPage({ study }: { study: WorkStudy }) {
  useSEO(getSeoRoute(workStudyPath(study))!);
  useLayoutEffect(() => {
    document.documentElement.classList.remove('js-pending');
  }, []);
  useEffect(() => {
    const root = document.getElementById('seo-static-summary');
    if (!root) return;
    return installWorkStudyInteractions(root);
  }, [study.slug]);
  return null;
}
