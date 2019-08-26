import { KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';
import { Globals } from './globals';

export function keycloakInitializer(keycloak: KeycloakService, globals: Globals): () => Promise<any> {
  // This function is invoked BEFORE app.component constructor, so we also need to check for the presence of a demo attribute in the url here.
  const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
  globals.demo = urlParams.has('demo') ? urlParams.get('demo').toLowerCase() === 'false' ? false : true : globals.demo;

  if (globals.demo) {
    console.log('Keycloak bypassed in Demo mode');
    return (): Promise<any> => {
      return new Promise(async (resolve, reject) => {
        try {
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    };
  } else {
    console.log('Initialising Keycloak');
    return (): Promise<any> => {
      return new Promise(async (resolve, reject) => {
        try {
          await keycloak.init({
            config: environment.keycloakConfig,
            initOptions: {
              onLoad: 'login-required',
              checkLoginIframe: true,
            },
            enableBearerInterceptor: true,
            bearerExcludedUrls: [],
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    };
  }
}
