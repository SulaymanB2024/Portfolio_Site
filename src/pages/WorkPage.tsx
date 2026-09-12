import { renderWorkIndex } from '../content/workStudyView';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';
import '../styles/work-studies.css';

export default function WorkPage() {
  useSEO(getSeoRoute('/work')!);
  return <div dangerouslySetInnerHTML={{ __html: renderWorkIndex() }} />;
}
