import { CategoryResults } from './category/CategoryResults';

// /results renders the category node-map results (DATA_MODEL §17). Narrative is the only flow
// after the strip, so there's a single results presentation now.
export function Results() {
  return <CategoryResults />;
}
