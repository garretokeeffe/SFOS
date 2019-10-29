import {Component, Input, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LicenceApplicationView} from '../../../types/licence-application';
import {EmitterService} from '../../../services/emitter.service';
import {Emitters} from '../../../types/emitters';

@Component({
  selector: 'app-la-documentation',
  templateUrl: './la-documentation.component.html',
  styleUrls: ['./la-documentation.component.css']
})
export class LaDocumentationComponent implements OnInit {

  @Input() licenceApplication: LicenceApplicationView;

  public vesselDetailsProgress: number = 0;
  public vesselPhotosProgress: number = 0;
  public certificateOfComplianceProgress: number = 0;
  public engineDetailsProgress: number = 0;
  public shippingRegisterProgress: number = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );
  isTablet$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.TabletLandscape)
  .pipe(
    map(result => result.matches)
  );
  isAtLeastMedium$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
    const vesselDetailsInterval = setInterval(() => {
      this.vesselDetailsProgress += 5;
      if (this.vesselDetailsProgress >= 100) {
        clearInterval(vesselDetailsInterval);
      }
    }, 1000);
  }

  public saveVesselDetails(): void {
    EmitterService.get(Emitters[Emitters.LICENCE_APPLICATION_UPDATE_VESSEL_DETAILS]).emit(true);
  }

  public getFlexLabelWidth(): number {
    // console.log('label width: ', this.isTablet$ ? '25' : '45'); // REMOVEME
    return this.isTablet$ ? 25 : 45;
  }
  public getFlexProgressWidth(): number {
    // console.log('progress width: ', this.isTablet$ ? '65' : '45'); // REMOVEME
    return this.isTablet$ ? 65 : 45;
  }
  public progressColour(): object {
    return {
      '0': 'rgba(50, 112, 104, 0)',
      '10': 'rgba(50, 112, 104, .1)',
      '20': 'rgba(50, 112, 104, .2)',
      '30': 'rgba(50, 112, 104, .3)',
      '40': 'rgba(50, 112, 104, .4)',
      '50': 'rgba(50, 112, 104, .5)',
      '60': 'rgba(50, 112, 104, .6)',
      '70': 'rgba(50, 112, 104, .7)',
      '80': 'rgba(50, 112, 104, .8)',
      '90': 'rgba(50, 112, 104, .9)',
      '100': 'rgba(50, 112, 104, 1)'
    };
  }


}
