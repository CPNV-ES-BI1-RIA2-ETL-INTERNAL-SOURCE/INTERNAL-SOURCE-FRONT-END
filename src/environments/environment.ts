export const environment = {
  auth: {
    provider: 'keycloak',
    config: {
      url: 'http://valid-url',
      realm: 'valid-realm',
      clientId: 'valid-client-id',
    },
  },
  api: {
    lambdaUrl: 'YOUR_LAMBDA_URL_HERE',
    identityType: 'ANONYMOUS',
  },
  cache: {
    defaultTTL: 5 * 60 * 1000,
    storage: {
      prefix: 'cache_',
    },
    keys: {
      dashboard: 'dashboard_data',
    },
  },
};
