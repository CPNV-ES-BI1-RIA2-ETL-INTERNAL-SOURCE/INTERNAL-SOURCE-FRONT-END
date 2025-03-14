export const environment = {
  auth: {
    provider: 'keycloak',
    config: {
      url: 'http://localhost:8080',
      realm: 'master',
      clientId: 'angular-client',
    },
  },
};
