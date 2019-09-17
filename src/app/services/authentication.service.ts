import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import * as $ from 'jquery';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';
import { IFISAuthentication } from '../types/ifisauthentication';
import { Globals } from '../globals';
import { UserService } from './user.service';

declare var require: any;

export class IFISRoles {
  public roles: Array<string>;
}

@Injectable()
export class AuthenticationService extends KeycloakAuthGuard {

  private static requiredRoles: Array<string> = [
    'sfos_vessel_owner',
    'sfos_vessel_owner_ro',
    'sfos_representative',
    'sfos_representative_ro',
    'sfos_la',
    'sfos_la_ro',
    'sfos_la2',
    'sfos_la2_ro',
    'sfos_fish_buyer',
    'sfos_fish_buyer_ro',
    'sfos_sfpa',
    'sfos_sfpmd',
  ];

  public demoModeAuthenticated: boolean = false;

  private static countAuthenticationCalls: number = 0;

  public simulatorUser: IFISAuthentication = null;

  public url: string = environment.authenticationURL;
  public access: IFISAuthentication = new IFISAuthentication();

  public service: any = null; // only required to prevent IDE errors (Property 'service' does not exist on type 'AuthenticationService'.). see comment in authSuccess()

  constructor(private globals: Globals,
              private http: HttpClient,
              protected router: Router,
              protected keycloakService: KeycloakService,
              protected userService: UserService) {
    super(router, keycloakService);
    this.authenticate();
  }

  public doLogout(): void {
    if (this.isUsingKeycloak()) {
      this.keycloakService.logout();
    } else {
      this.demoModeAuthenticated = false;
    }
    this.userService.logout();
  }

  public isUsingKeycloak(): boolean {
    return !this.globals.demo;
  }
  
  public getKeycloakRoles(): Array<string> {
    if (this.isUsingKeycloak) {
      return this.keycloakService.getUserRoles();
    } else {
      return [];
    }
  }

  // override
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.isUsingKeycloak()) {
      return super.canActivate(route, state);
    } else {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    }
  }

  public isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.authenticated) {
        this.keycloakService.login();
        return;
      }

      if (!AuthenticationService.requiredRoles || AuthenticationService.requiredRoles.length === 0) {
        return resolve(true);
      } else {
        if (!this.roles || this.roles.length === 0) {
          resolve(false);
          console.log('Authentication Failure');
        }
        let granted: boolean = false;
        for (const requiredRole of AuthenticationService.requiredRoles) {
          if (this.roles.indexOf(requiredRole) > -1) {
            granted = true;

            console.log('Authentication Successful');
            break;
          }
        }
        resolve(granted);
      }
    });
  }

  // get authentication (roles etc) from http service
  public authenticate(): IFISAuthentication {
    AuthenticationService.countAuthenticationCalls++;
    console.log('AuthenticationService.countAuthenticationCalls: ' + AuthenticationService.countAuthenticationCalls);

    // reset the authentication object
    this.access = new IFISAuthentication();

    const userRoles: Array<string> = [];
    try {
      for (const requiredRole of AuthenticationService.requiredRoles) {
        if (this.keycloakService.getUserRoles().indexOf(requiredRole) > -1 && userRoles[requiredRole] === undefined) {
          userRoles.push(requiredRole);
        }
      }
    }
    catch (err) {
      console.log('Keycloak service not employed');
    }

    // As this service is injected into the appComponent, the simulator userprofile will not have been set the first time ths service is called.
    // Therefore, if running in DEV mode automatically simulate authentication for the first call.
    console.log('Authentication environment: ' + environment.name);
    if (this.simulatorUser !== null || (environment.name === 'DEV' && AuthenticationService.countAuthenticationCalls === 1)) {
      console.log('Simulating authentication');
      return this.simulateAuthentication(userRoles);
    }

    this.access = new IFISAuthentication(userRoles);

    // $.ajax({
    //   url: url,
    //   type: 'POST',
    //   dataType: 'json',
    //   service: this,  // pass this authentication service into the call (as an attribute named 'service')
    //                   // for reference in the response
    //   async: false,
    //   success: this.processAjaxAuthenticationResponse,
    //   error: this.handleError
    // });

    return this.access;
  }

  private handleError(error: any): IFISAuthentication {
    console.error(JSON.stringify(error));
    console.log('ACCESS DENIED');
    this.service.access = new IFISAuthentication();
    this.service.access.systemDown = true;

    return this.service.access;
  }

  public setSimulatorUser(user: IFISAuthentication): void {
    this.simulatorUser = new IFISAuthentication(user.getRoles());
  }

  private simulateAuthentication(userRoles?: Array<string>): IFISAuthentication {

    if (this.globals.demo && !this.demoModeAuthenticated) {
      this.router.navigate(['/home']).then((e) => { });
    } else {
      if (!environment.production && AuthenticationService.countAuthenticationCalls === 1) {
        this.access = new IFISAuthentication(userRoles);
      } else {
        this.access = new IFISAuthentication(this.simulatorUser.getRoles());
      }
      console.log('Simulated Roles granted: ' + this.access.getRoles());
      console.log('Simulated User Group: ' + this.access.userGroup);
    }

    return this.access;
  }

}
