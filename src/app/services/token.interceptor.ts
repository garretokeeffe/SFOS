import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(protected keycloakService: KeycloakService) {}
    tokenData: String;
     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 
   
   const tokenPromise: Promise<String> = this.keycloakService.getToken();
            tokenPromise.then(token => {
                    this.tokenData=token
                      console.log('token data :  '+this.tokenData);
                });
    request = request.clone({
       setHeaders: {
        Authorization: `Bearer ${this.tokenData}`
      }
    });
    return next.handle(request);
  }
}