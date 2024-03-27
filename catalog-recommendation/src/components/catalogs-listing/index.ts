import { lazy } from 'react';

const CatalogsListing = lazy(
  () => import('./catalogsListing' /* webpackChunkName: "catalogsListing" */)
);

export default CatalogsListing;
