import { useLayoutEffect } from 'react';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import '../styles/work-studies.css';

/**
 * The Work collection is authored into the route document at build time.
 * Keep that server document in place instead of reparsing the same HTML in React.
 */
export default function WorkPage() {
  useSEO(getSeoRoute('/work')!);
  useLayoutEffect(() => {
    document.documentElement.classList.remove('js-pending');
  }, []);
  return null;
}
