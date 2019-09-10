import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private tokenData: string;

  constructor(protected keycloakService: KeycloakService) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<string>> {

    if (this.isUsingKeycloak()) {
      this.keycloakService.getToken().then((token: string) => {
        this.tokenData = token;
        // console.log('token data :  ' + this.tokenData);
      });
    }
    request = request.clone({
       setHeaders: {
        Authorization: `Bearer ${this.tokenData}`,
      },
    });
    return next.handle(request);
  }

  public isUsingKeycloak(): boolean {
    try {
      const roles: Array<string> = this.keycloakService.getUserRoles();
      return roles.length > 0 ? true : false;
    }
    catch (err) {
      return false;
    }
  }
}
