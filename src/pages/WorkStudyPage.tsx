import { useEffect, useLayoutEffect, useRef } from 'react';
import type { WorkStudy } from '../content/workStudies';
import { workStudyPath } from '../content/workStudies';
import { renderWorkStudy } from '../content/workStudyView';
import { installWorkStudyInteractions } from '../content/workStudyInteractions';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import '../styles/work-studies.css';

/** Document-routed case studies share authored HTML with the static build. */
export default function WorkStudyPage({ study }: { study: WorkStudy }) {
  const root = useRef<HTMLDivElement>(null);
  useSEO(getSeoRoute(workStudyPath(study))!);
  useLayoutEffect(() => {
    document.documentElement.classList.add('app-mounted');
    document.documentElement.classList.remove('js-pending');
    document.getElementById('seo-static-summary')?.remove();
  }, []);
  useEffect(() => {
    if (!root.current) return;
    return installWorkStudyInteractions(root.current);
  }, [study.slug]);
  return <div ref={root} dangerouslySetInnerHTML={{ __html: renderWorkStudy(study) }} />;
}
