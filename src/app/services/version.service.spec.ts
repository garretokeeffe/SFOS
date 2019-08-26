import { VersionService } from './version.service';
import { of, throwError } from 'rxjs';
import { async } from '@angular/core/testing';

describe('VersionService', () => {
  let httpSpy: any, globalsSpy: any, demoSpy: any;
  let service: VersionService;

  beforeEach(() => {
     service = new VersionService(
     httpSpy = jasmine.createSpyObj('httpSpy', ['get']),
     globalsSpy = jasmine.createSpyObj('globalsSpy', ['']),
     demoSpy = jasmine.createSpyObj('demoSpy', [''])
     );
  });

  it('getVersion() should retrieve an application version', async(() => {
    httpSpy.get.and.returnValue(of({'version': '1.0.0'}));
    service.getVersion().subscribe( (data: any) => {
      expect(data).toBe('1.0.0');
    });
  }));

  it('package.json Version should be returned if version service is not available', async(() => {
    httpSpy.get.and.returnValue(throwError('Error getting data'));
    service.getVersion().subscribe( (data: any) => {
      expect(data).toBe(service.packageJsonVersion);
    });
  }));

});
