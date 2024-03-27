import { lazy } from 'react';

const CatalogRecommendation = lazy(
  () =>
    import('./recommendation' /* webpackChunkName: "Catalog Recommendation" */)
);

export default CatalogRecommendation;
