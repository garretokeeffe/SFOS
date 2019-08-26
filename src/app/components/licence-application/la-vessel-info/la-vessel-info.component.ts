import {Component, Input, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LicenceApplicationView} from '../../../types/licence-application';
import {FormControl} from '@angular/forms';
import {OptionItem, SegmentGroup} from '../la-preliminary-info/la-preliminary-info.component';
import {VesselService} from '../../../services/vessel.service';
import {VesselView} from '../../../types/vessel';
import {EmitterService} from '../../../services/emitter.service';
import {Emitters} from '../../../types/emitters';

@Component({
  selector: 'app-la-vessel-info',
  templateUrl: './la-vessel-info.component.html',
  styleUrls: ['./la-vessel-info.component.css']
})
export class LaVesselInfoComponent implements OnInit {

  @Input() licenceApplication: LicenceApplicationView;
  cfrIdentified: string = null;
  cfrIdentificationOptions: string[] = ['Yes', 'No'];
  cfr: string = '';

  segmentControl = new FormControl();
  segmentGroups: SegmentGroup[] = [
    {
      name: 'RSW Pelagic',
      segment: [
        {value: 'rsw-pelagic', viewValue: 'RSW Pelagic'}
      ]
    },
    {
      name: 'Beam Trawler',
      segment: [
        {value: 'beam-trawler', viewValue: 'Beam Trawler'}
      ]
    },
    {
      name: 'Aquaculture',
      segment: [
        {value: 'aquaculture', viewValue: 'Aquaculture'}
      ]
    },
    {
      name: 'Polyvalent',
      disabled: false,
      segment: [
        {value: 'polyvalent-lt-18', viewValue: 'Polyvalent < 18m LOA'},
        {value: 'polyvalent-gte-18', viewValue: 'Polyvalent >= 18m LOA'},
        {value: 'polyvalent-scallops', viewValue: 'Polyvalent Scallops'}
      ]
    },
    {
      name: 'Specific',
      segment: [
        {value: 'specific-scallops-gte-10', viewValue: 'Specific Scallops >= 10m LOA'},
        {value: 'specific-general', viewValue: 'Specific General'},
      ]
    }
  ];
  loaControl = new FormControl();
  loas: OptionItem[] = [
    {value: 'gte_24', viewValue: 'LOA >= 24m'},
    {value: 'gte_15_lt_24', viewValue: 'LOA >= 15m && < 24m'},
    {value: 'lt_15', viewValue: 'LOA < 15m'},
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver,
              public vesselService: VesselService) { }

  ngOnInit() {
    EmitterService.get(Emitters[Emitters.LICENCE_APPLICATION_UPDATE_VESSEL_DETAILS]).subscribe( update => {
      if (update) {
        this.save();
      }
    });
  }

  public getVesselDetails(): void {
    this.vesselService.getVessel(this.cfr).subscribe(
      (vessel: VesselView) => {
        this.licenceApplication.vessel = vessel;
      },
      error => {

      }
    );
  }

  public onNotMyVessel(): void {
    this.licenceApplication.vessel.cfr = '';
  }

  public save(): void {
    EmitterService.get(Emitters[Emitters.LICENCE_APPLICATION_UPDATE]).emit(this.licenceApplication);
  }

}
