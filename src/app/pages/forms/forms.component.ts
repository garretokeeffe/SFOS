import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { animations } from '../../animations';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
  animations: animations,
})
export class FormsComponent implements OnInit {

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  constructor(private breakpointObserver: BreakpointObserver) { }

  public ngOnInit(): void {
  }

}
