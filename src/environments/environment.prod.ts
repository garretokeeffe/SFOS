import {KeycloakConfig} from 'keycloak-angular';

declare const require: any;

export const kcConfig: KeycloakConfig = {
  url: 'https://sso-keycloak-sso1.apps.rhos.agriculture.gov.ie/auth',
  realm: 'Staging-Realm',
  clientId: 'ccs-service',
};

export const environment: any = {
  production: true,
  name: 'PROD',
  version: require('../../package.json').version.replace(/-SNAPSHOT|trunk-/gi, ''),
  keycloakConfig: kcConfig,
  authenticationURL: 'https://sso-keycloak-sso1.apps.rhos.agriculture.gov.ie/auth/realms/Staging-Realm/protocol/openid-connect/token',
  getVersionURL: 'assets/demo/version',
  getUserURL: 'assets/demo/user',
  getUsersURL: 'assets/demo/users',
  getApplicationsURL: 'assets/demo/applications',
  getNotificationsURL: 'assets/demo/notifications',
  getNotificationCategoriesURL: 'assets/demo/notification-categories',
  getStatusesOfSubmissionsURL: 'assets/demo/statuses-of-submissions',
  getVesselsURL: 'assets/demo/vessels',
  getVesselURL: 'assets/demo/vessel',
  getLetterOfOfferTermsURL: 'assets/demo/letter-of-offer-terms',
  getSubmissionsAllURL: 'assets/demo/submissions-all',
  getSubmissionsInProgressURL: 'assets/demo/submissions-in-progress',
  getCapacityURL: 'assets/demo/capacity',

  salesNotesURL: 'http://salesnotesportal-fisheries-dev.apps.rhos.agriculture.gov.ie/'
};
