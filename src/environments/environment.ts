// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { KeycloakConfig } from 'keycloak-angular';

// declare const require: any;

/*
let keycloakConfig: KeycloakConfig = {
  url: 'https://sso-keycloak-sso1.apps.rhos.agriculture.gov.ie/auth',
  realm: 'Staging-Realm',
  clientId: 'ccs-service',
};
*/

export const kcConfigLocal: KeycloakConfig = {
  url: 'http://localhost:8080/auth',
  realm: 'Dev-Realm',
  clientId: 'ccs-service',
};

export const kcConfig: KeycloakConfig = {
  url: 'https://sso-keycloak-sso1.apps.rhos.agriculture.gov.ie/auth',
  realm: 'Staging-Realm',
  clientId: '9d5d5361',
  credentials: {secret: '8a6ad8d597f8915f43b31a912098c2ee'},
};

// ccsId to append = /SLA00001

export const environment: any = {
  production: false,
  name: 'DEV',
  version: '1.0.0', // require('../../package.json').version.replace(/-SNAPSHOT|trunk-/gi, ''),
  keycloakConfig: kcConfig,
  getUserProfileURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/users/ccs',
  getVesselsURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/vessels/users/ccs',
  getCapacityURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/capacity/users/ccs',
  createPreliminaryLicenceApplicationURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/licence-applications',
  getLicenceApplicationURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/licence-applications/users/ccs',
  progressPreliminaryLicenceApplicationURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/licence-applications',
  getLicenceApplicationSummariesURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/licence-applications/summaries/users/ccs',

  authenticationURL: 'http://localhost:8080/ws/login',
  deleteLicenceApplicationURL: 'http://application-service-fisheries-dev.apps.rhos.agriculture.gov.ie/sfos/licence-applications',
  getVersionURL: 'assets/demo/version',
  xgetUserProfileURL: 'assets/demo/userprofile',
  getUsersURL: 'assets/demo/users',
  getApplicationsURL: 'assets/demo/applications',
  getNotificationCategoriesURL: 'assets/demo/notification-categories',
  getNotificationsURL: 'assets/demo/notifications',
  getStatusesOfSubmissionsURL: 'assets/demo/statuses-of-submissions',
  getVesselURL: 'assets/demo/vessel',
  xcreatePreliminaryLicenceApplicationURL: 'assets/demo/createPreliminaryLicenceApplicationURL',
  xprogressPreliminaryLicenceApplicationURL: 'assets/demo/progressPreliminaryLicenceApplicationURL',
  demo_getLicenceApplicationURL: 'assets/demo/licence-application',
  xgetLicenceApplicationSummariesURL: 'assets/demo/licence-application-summaries',
  xxgetLicenceApplicationSummariesURL: 'http://application-service-fisheries-dev.apps.rhos.agriculture.gov.ie/sfos/licence-applications/users/ccs',
  xxxgetLicenceApplicationSummariesURL: 'https://api-3scale-apicast-staging.apps.rhos.agriculture.gov.ie:443/sfos/licence-applications/users/ccs',
  smcc_getLicenceApplicationURL: 'sfos/licence-applications/ccs',
  getLetterOfOfferTermsURL: 'assets/demo/letter-of-offer-terms',
  getSubmissionsAllURL: 'assets/demo/submissions-all',
  getSubmissionsInProgressURL: 'assets/demo/submissions-in-progress',
  xgetCapacityURL: 'assets/demo/capacity',
  xxgetCapacityURL: 'http://capacity-service-fisheries-dev.apps.rhos.agriculture.gov.ie/sfos/capacity/users/ccs',


  salesNotesURL: 'http://salesnotesportal-fisheries-dev.apps.rhos.agriculture.gov.ie/',
};

/*
getApplicationsURL/userId
getNotificationsURL[/applicationId]
*/

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
