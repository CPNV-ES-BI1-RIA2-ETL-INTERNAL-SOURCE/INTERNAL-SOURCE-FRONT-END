export const environment = {
  auth: {
    provider: 'valid-provider',
    config: {
      url: 'http://valid-url',
      realm: 'valid-realm',
      clientId: 'valid-client-id',
    },
  },
  api: {
    lambdaUrl: 'http://valid-lambda-url',
    identityType: 'valid-identity-type',
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
