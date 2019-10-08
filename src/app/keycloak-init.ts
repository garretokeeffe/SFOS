import { KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';
import { Globals } from './globals';
import * as urlParse from 'url-parse';
import { UrlObject } from 'url';

export function keycloakInitializer(keycloak: KeycloakService, globals: Globals): () => Promise<any> {
  // This function is invoked BEFORE app.component constructor, so we also need to check for the presence of a demo attribute in the url here.
  const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
  globals.demo = urlParams.has('demo') ? urlParams.get('demo').toLowerCase() === 'false' ? false : true : globals.demo;

  let isPublicPage: boolean = false;

  // const publicPagePaths: Array<string> = ['/', '/home'];
  // const referrerURL: UrlObject = urlParse(document.referrer, true);
  // isPublicPage = referrerURL && publicPagePaths.includes(referrerURL.pathname);
  // if (!isPublicPage) {
  //   const windowLocationURL: UrlObject = urlParse(window.top.location, true);
  //   isPublicPage = windowLocationURL && publicPagePaths.includes(windowLocationURL.pathname);
  // }

  if (globals.demo || isPublicPage) {
    if (globals.demo) {
      console.log('Keycloak bypassed in Demo mode');
    } else {
      console.log('Keycloak bypassed - target is a public page');
    }

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
              onLoad: 'check-sso',
              checkLoginIframe: false,
            },
            enableBearerInterceptor: false,
              bearerExcludedUrls: [
              'assets/demo',
              'MaterialIcons-Regular.woff2',
              'main.js',
              'assets/images',
             ],
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    };
  }
}
