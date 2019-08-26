import { TitleBarComponent } from './title-bar.component';
import { async } from '@angular/core/testing';
import { of } from 'rxjs';

describe('TitleBarComponent', () => {
  let component: TitleBarComponent;
  let httpSpy: any, versionSpy: any, userSpy: any;

  beforeEach(() => {
    component = new TitleBarComponent(
      userSpy = jasmine.createSpyObj('authenticationService', ['authenticate', 'setSimulatorUser', 'simulateAuthentication']),
      versionSpy = jasmine.createSpyObj('versionService', ['getVersion']),
      httpSpy = jasmine.createSpyObj('httpSpy', ['get'])
    );
  });

  it('Slideshow images should be pre-loaded', async(() => {
    const preloadImages: any = spyOn(component, 'preloadImages');
    versionSpy.getVersion.and.returnValue(of('1.0.0'));
    component.ngOnInit();
    expect(preloadImages).toHaveBeenCalled();
  }));

  it('Slideshow should start as soon as first image has been loaded', async(() => {
    const startSlideShowBlob: any = spyOn(component, 'startSlideShowBlob');
    httpSpy.get.and.returnValue(of(new Blob()));
    component.preloadImages();
    expect(startSlideShowBlob).toHaveBeenCalled();
  }));

  it('Server Version should be returned', async(() => {
    versionSpy.getVersion.and.returnValue(of('1.0.0'));
    component.getServerVersion();
    expect(component.version).toBe('1.0.0');
  }));

});
