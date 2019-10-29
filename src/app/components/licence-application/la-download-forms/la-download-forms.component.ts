import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges
} from '@angular/core';
import { UserView } from '../../../types/user';
import { LicenceApplicationView } from '../../../types/licence-application';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { animations } from '../../../animations';

@Component({
  selector: 'app-la-download-forms',
  templateUrl: './la-download-forms.component.html',
  styleUrls: ['./la-download-forms.component.css'],
  animations: animations,
})
export class LaDownloadFormsComponent implements OnInit {

  @Input() public standAlonePage: boolean = false;
  @Input() public embedded: boolean = false;
  @Input() public readonly: boolean = false;
  @Input() public user: UserView = null;
  @Input() public licenceApplication: LicenceApplicationView = new LicenceApplicationView();

  @Output() public back: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();
  @Output() public next: EventEmitter<LicenceApplicationView> = new EventEmitter<LicenceApplicationView>();

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );
  public isAtLeastMedium$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map((result) => result.matches),
  );
  public isAtLeastLarge$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge])
  .pipe(
    map((result) => result.matches),
  );

  constructor(private breakpointObserver: BreakpointObserver,
              @Optional() public cdRef: ChangeDetectorRef) {  }

  public ngOnInit(): void { }

  public ngAfterViewChecked(): void {
    // detect changes after view checked to avoid "expression has changed after it was checked" exceptions
    this.cdRef.detectChanges();
  }

  public scroll(id: string): void {
    const el: HTMLElement = document.getElementById(id);
    if (el) {
      // It is necessary to have a short delay before making the scroll to give
      // the error component enough time to fade into (be rendered) on the screen
      setTimeout(() => {
        el.scrollIntoView({behavior: 'smooth'});
      }, 50);
    }
  }
}
