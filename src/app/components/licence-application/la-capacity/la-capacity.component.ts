import {Component, Input, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LicenceApplicationView} from '../../../types/licence-application';

@Component({
  selector: 'app-la-capacity',
  templateUrl: './la-capacity.component.html',
  styleUrls: ['./la-capacity.component.css']
})
export class LaCapacityComponent implements OnInit {

  @Input() licenceApplication: LicenceApplicationView;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map(result => result.matches)
  );

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit() {
  }

}
