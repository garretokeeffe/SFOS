import { async } from '@angular/core/testing';

// services
import { AuthenticationService } from './authentication.service';
import {IFISAuthentication} from '../types/ifisauthentication';
import {of, throwError} from 'rxjs';

import * as $ from 'jquery';

describe('AuthenticateService', () => {
  let service: AuthenticationService;
  let httpSpy: any;
  let router: any;
  let keycloakService: any;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('httpClient', ['post']);
    router = jasmine.createSpyObj('router', []);
    keycloakService = jasmine.createSpyObj('keycloakService', []);
    service = new AuthenticationService(httpSpy, router, keycloakService);
  });

  it('should initiate an AuthenticationService service', async(() => {
    expect(service).toBeTruthy();
  }));

  /*
  it('User authentication should be successful', async(() => {
    httpSpy.post.and.returnValue(of({roles: ['ifisqb_sfpa_admin']}));
    service.authenticate().subscribe ((access: IFISAuthentication) => {
      expect(access.authenticated).toBe(true);
    });
  }));
  */
  /*
  it('User authentication should be successful', async(() => {
    // httpSpy.post.and.returnValue(of({roles: ['ifisqb_sfpa_admin']}));
    //spyOnProperty(component, 'jquery', 'get').and.returnValue({ data: [landing] });
    //const jquery = spyOnProperty(service, 'jquery', 'get');

    spyOn($, 'ajax').and.callFake(function (req) {
      let d = $.Deferred();
      // resolve using our mock data
      d.resolve({roles: ['ifisqb_sfpa_admin']});
      return d.promise();
    });

    const access: IFISAuthentication = service.authenticate();
    expect(access.authenticated).toBe(true);
  }));


  it('User authentication should fail', async(() => {
    httpSpy.post.and.returnValue(of({roles: ['']}));
    service.authenticate().subscribe ((access: IFISAuthentication) => {
      expect(access.authenticated).toBe(false);
    });
  }));
  */

  /*
  it('User authentication should fail', async(() => {
    httpSpy.post.and.returnValue(of({roles: ['']}));
    const access: IFISAuthentication = service.authenticate();
    expect(access.authenticated).toBe(false);
  }));

  it('Admin access should be permitted for ifisqb_sfpa_admin role', async(() => {
    httpSpy.post.and.returnValue(of({roles: ['ifisqb_sfpa_admin']}));
    service.authenticate().subscribe ((access: IFISAuthentication) => {
      expect(access.writeAccess).toBe(true);
    });
  }));

  it('Admin access should be permitted for ifisqb_sfpmd_admin role', async(() => {
    httpSpy.post.and.returnValue(of({roles: ['ifisqb_sfpmd_admin']}));
    service.authenticate().subscribe ((access: IFISAuthentication) => {
      expect(access.writeAccess).toBe(true);
    });
  }));

  it('View access should be permitted for ifisqb_sfpa_view role', async(() => {
    httpSpy.post.and.returnValue(of({roles: ['ifisqb_sfpa_view']}));
    service.authenticate().subscribe ((access: IFISAuthentication) => {
      expect(access.readAccess).toBe(true);
      expect(access.writeAccess).toBe(false);
    });
  }));

  it('View access should be permitted for ifisqb_sfpmd_view role', async(() => {
    httpSpy.post.and.returnValue(of({roles: ['ifisqb_sfpmd_view']}));
    service.authenticate().subscribe ((access: IFISAuthentication) => {
      expect(access.readAccess).toBe(true);
      expect(access.writeAccess).toBe(false);
    });
  }));

  it('User Group should be SFPA for ifisqb_sfpa_admin and ifisqb_sfpa_view roles', async(() => {
    httpSpy.post.and.returnValue(of({roles: ['ifisqb_sfpa_admin', 'ifisqb_sfpa_view']}));
    service.authenticate().subscribe ((access: IFISAuthentication) => {
      expect(access.userGroup).toBe('SFPA');
    });
  }));

  it('User Group should be SFPMD for ifisqb_sfpmd_admin and ifisqb_sfpmd_view roles', async(() => {
    httpSpy.post.and.returnValue(of({roles: ['ifisqb_sfpmd_admin', 'ifisqb_sfpmd_view']}));
    service.authenticate().subscribe ((access: IFISAuthentication) => {
      expect(access.userGroup).toBe('SFPMD');
    });
  }));

  it('Admin access should be simulated', async(() => {
    let userprofile: IFISAuthentication = new IFISAuthentication(['ifisqb_sfpa_admin', 'ifisqb_sfpmd_admin']);
    httpSpy.post.and.returnValue(of(userprofile.getRoles()));
    service.setSimulatorUser(userprofile);
    service.authenticate().subscribe ((access: IFISAuthentication) => {
      expect(access.writeAccess).toBe(true);
    });
  }));

  it('View access should be simulated', async(() => {
    let userprofile: IFISAuthentication = new IFISAuthentication(['ifisqb_sfpa_view', 'ifisqb_sfpmd_view']);
    httpSpy.post.and.returnValue(of(userprofile.getRoles()));
    service.setSimulatorUser(userprofile);
    service.authenticate().subscribe ((access: IFISAuthentication) => {
      expect(access.readAccess).toBe(true);
      expect(access.writeAccess).toBe(false);
    });
  }));

  it('Access should be denied (invalid roles)', async(() => {
    httpSpy.post.and.returnValue(of([]));
    service.authenticate().subscribe ((access: IFISAuthentication) => {
      expect(access.readAccess).toBe(false);
      expect(access.writeAccess).toBe(false);
    });
  }));

  it('Authentication should fail (system down)', async(() => {
    httpSpy.post.and.returnValue(throwError('Error getting data'));
    service.authenticate().subscribe ((access: IFISAuthentication) => {
      expect(access.systemDown).toBe(true);
    });
  }));
  */
});
