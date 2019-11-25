import {KeycloakConfig} from 'keycloak-angular';

// declare const require: any;

export const kcConfig: KeycloakConfig = {
  url: 'https://sso-keycloak-sso1.apps.rhos.agriculture.gov.ie/auth',
  realm: 'Staging-Realm',
  clientId: '9d5d5361',
  credentials: {secret: '8a6ad8d597f8915f43b31a912098c2ee'},
};

/*
export const environment: any = {
  production: true,
  name: 'PROD',
  version: '1.0.0', // require('../../package.json').version.replace(/-SNAPSHOT|trunk-/gi, ''),
  keycloakConfig: kcConfig,
  authenticationURL: 'https://sso-keycloak-sso1.apps.rhos.agriculture.gov.ie/auth/realms/Staging-Realm/protocol/openid-connect/token',
  getVersionURL: 'assets/demo/version',
  getUserProfileURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/users/ccs',
  getUsersURL: 'assets/demo/users',
  getApplicationsURL: 'assets/demo/applications',
  getNotificationCategoriesURL: 'assets/demo/notification-categories',
  getNotificationsURL: 'assets/demo/notifications',
  getStatusesOfSubmissionsURL: 'assets/demo/statuses-of-submissions',
  getVesselsURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/vessels/users/ccs',
  getVesselURL: 'assets/demo/vessel',
  submitPreliminaryLicenceApplicationURL: 'assets/demo/submitPreliminaryLicenceApplicationURL',
  progressPreliminaryLicenceApplicationURL: 'assets/demo/progressPreliminaryLicenceApplicationURL',
  getLicenceApplicationURL: 'assets/demo/licence-application',
  getLetterOfOfferTermsURL: 'assets/demo/letter-of-offer-terms',
  getSubmissionsAllURL: 'assets/demo/submissions-all',
  getSubmissionsInProgressURL: 'assets/demo/submissions-in-progress',
  getCapacityURL: 'assets/demo/capacity',

  salesNotesURL: 'http://salesnotesportal-fisheries-dev.apps.rhos.agriculture.gov.ie/',
};
*/

export const environment: any = {
  production: false,
  name: 'DEV',
  version: '1.0.0', // require('../../package.json').version.replace(/-SNAPSHOT|trunk-/gi, ''),
  keycloakConfig: kcConfig,
  authenticationURL: 'http://localhost:8080/ws/login',
  getVersionURL: 'assets/demo/version',
  getUserProfileURL: 'assets/demo/userprofile',
  garret_getUserProfileURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/users/ccs/FBY10115L',
  getUsersURL: 'assets/demo/users',
  getApplicationsURL: 'assets/demo/applications',
  getNotificationCategoriesURL: 'assets/demo/notification-categories',
  getNotificationsURL: 'assets/demo/notifications',
  getStatusesOfSubmissionsURL: 'assets/demo/statuses-of-submissions',
  getVesselsURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/vessels/users/ccs',
  garret_getVesselsURL: 'http://WKEBNFS23452:9001/vessels/ifis/74',
  getVesselURL: 'assets/demo/vessel',
  submitPreliminaryLicenceApplicationURL: 'assets/demo/submitPreliminaryLicenceApplicationURL',
  progressPreliminaryLicenceApplicationURL: 'assets/demo/progressPreliminaryLicenceApplicationURL',
  demo_getLicenceApplicationURL: 'assets/demo/licence-application',
  getLicenceApplicationURL: 'http://WKEBNFS26938:8080/sfos/preliminary-licence-applications/users/ccs/300/315061143/4274',
  smcc_getLicenceApplicationURL: 'sfos/licence-applications/ccs',
  getLetterOfOfferTermsURL: 'assets/demo/letter-of-offer-terms',
  getSubmissionsAllURL: 'assets/demo/submissions-all',
  getSubmissionsInProgressURL: 'assets/demo/submissions-in-progress',
  getCapacityURL: 'assets/demo/capacity',

  salesNotesURL: 'http://salesnotesportal-fisheries-dev.apps.rhos.agriculture.gov.ie/',
};
