import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Catalog Recommendation Manager',
  entryPointUriPath: '${env:ENTRY_POINT_URI_PATH}',
  cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
  env: {
    development: {
      initialProjectKey: 'my-project-key',
    },
    production: {
      applicationId: '${env:CUSTOM_APPLICATION_ID}',
      url: '${env:APPLICATION_URL}',
    },
  },
  oAuthScopes: {
    view: ['view_customers', 'view_business_units', 'view_shopping_lists'],
    manage: [
      'manage_customers',
      'manage_business_units',
      'manage_shopping_lists',
    ],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/files.svg}',
  mainMenuLink: {
    defaultLabel: 'Catalog Recommendation',
    uriPath: 'uploader',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'uploader',
      defaultLabel: 'Catalog Recommendation Uploader',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
    {
      uriPath: 'management',
      defaultLabel: 'Catalogs Management',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
};

export default config;
