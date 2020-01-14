import {KeycloakConfig} from 'keycloak-angular';

// declare const require: any;

export const kcConfig: KeycloakConfig = {
  url: 'https://sso-keycloak-sso1.apps.rhos.agriculture.gov.ie/auth',
  realm: 'Staging-Realm',
  clientId: '9d5d5361',
  credentials: {secret: '8a6ad8d597f8915f43b31a912098c2ee'},
};

export const environment: any = {
  production: true,
  name: 'PROD',
  version: '1.0.0', // require('../../package.json').version.replace(/-SNAPSHOT|trunk-/gi, ''),
  keycloakConfig: kcConfig,
  authenticationURL: 'http://localhost:8080/ws/login',
  getVersionURL: 'assets/demo/version',
  xgetUserProfileURL: 'assets/demo/userprofile',
  getUserProfileURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/users/ccs',
  getUsersURL: 'assets/demo/users',
  getApplicationsURL: 'assets/demo/applications',
  getNotificationCategoriesURL: 'assets/demo/notification-categories',
  getNotificationsURL: 'assets/demo/notifications',
  getStatusesOfSubmissionsURL: 'assets/demo/statuses-of-submissions',
  getVesselsURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/vessels/users/ccs',
  getVesselURL: 'assets/demo/vessel',
  xcreatePreliminaryLicenceApplicationURL: 'assets/demo/createPreliminaryLicenceApplicationURL',
  createPreliminaryLicenceApplicationURL: 'http://application-service-fisheries-dev.apps.rhos.agriculture.gov.ie/sfos/licence-applications',
  xprogressPreliminaryLicenceApplicationURL: 'assets/demo/progressPreliminaryLicenceApplicationURL',
  progressPreliminaryLicenceApplicationURL: 'http://application-service-fisheries-dev.apps.rhos.agriculture.gov.ie/sfos/licence-applications',
  deleteLicenceApplicationURL: 'http://application-service-fisheries-dev.apps.rhos.agriculture.gov.ie/sfos/licence-applications',
  demo_getLicenceApplicationURL: 'assets/demo/licence-application',
  getLicenceApplicationURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/licence-applications/users/ccs',
  xgetLicenceApplicationSummariesURL: 'assets/demo/licence-application-summaries',
  xxgetLicenceApplicationSummariesURL: 'http://application-service-fisheries-dev.apps.rhos.agriculture.gov.ie/sfos/licence-applications/users/ccs',
  xxxgetLicenceApplicationSummariesURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/licence-applications/users/ccs',
  getLicenceApplicationSummariesURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/licence-applications/summaries/users/ccs',
  smcc_getLicenceApplicationURL: 'sfos/licence-applications/ccs',
  getLetterOfOfferTermsURL: 'assets/demo/letter-of-offer-terms',
  getSubmissionsAllURL: 'assets/demo/submissions-all',
  getSubmissionsInProgressURL: 'assets/demo/submissions-in-progress',
  xgetCapacityURL: 'assets/demo/capacity',
  xxgetCapacityURL: 'http://capacity-service-fisheries-dev.apps.rhos.agriculture.gov.ie/sfos/capacity/users/ccs',
  getCapacityURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/capacity/users/ccs',

  salesNotesURL: 'http://salesnotesportal-fisheries-dev.apps.rhos.agriculture.gov.ie/',
};

