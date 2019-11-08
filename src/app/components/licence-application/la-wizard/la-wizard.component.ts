import { ChangeDetectorRef, Component, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { LicenceApplicationView } from '../../../types/licence-application';
import { WizardComponent } from 'angular-archwizard';
import { UserView } from '../../../types/user';
import { UserService } from '../../../services/user.service';
import { animations } from '../../../animations';
import { ActivatedRoute } from '@angular/router';

export enum LaWizardMode {
  NONE = 0,
  NEW = 1,
  RETRIEVE = 2,
  ACTIVE = 3,
}

@Component({
  selector: 'app-la-wizard',
  templateUrl: './la-wizard.component.html',
  styleUrls: ['./la-wizard.component.css'],
  animations: animations,
})
export class LaWizardComponent implements OnInit {

  @Input() public mode: number = LaWizardMode.NONE;

  public LaWizardMode: any = LaWizardMode; // html access to enum

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  public user: UserView = null;
  public licenceApplication: LicenceApplicationView = new LicenceApplicationView();

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  constructor(private breakpointObserver: BreakpointObserver,
              @Optional() public cdRef: ChangeDetectorRef,
              private route: ActivatedRoute,
              private userService: UserService) { }

  public ngOnInit(): void {
    this.mode = this.route.snapshot.params.id ? this.route.snapshot.params.id : LaWizardMode.NONE;
    console.log('wizard mode = ' + LaWizardMode[this.mode]);

    this.userService.getUserProfile().subscribe((user: UserView) => {
        this.user = user;
      },
      (error) => {
        console.log('Failed to get user profile');
      },
    );
  }

  public ngAfterViewChecked(): void {
    // detect changes after view checked to avoid "expression has changed after it was checked" exceptions
    this.cdRef.detectChanges();
  }

  public goToStep(stepId: string, licenceApplication?: LicenceApplicationView): void {
    if (licenceApplication) {
      this.licenceApplication = licenceApplication;
    }
    this.wizard.model.navigationMode.goToStep(this.wizard.model.getIndexOfStepWithId(stepId));
  }

  public onAcceptTerms(licenceApplication: LicenceApplicationView): void {
    if (licenceApplication) {
      this.licenceApplication = licenceApplication;
    }
    this.mode = LaWizardMode['ACTIVE'];
    console.log('wizard mode = ' + LaWizardMode[this.mode]);
  }

  public onRejectTerms(licenceApplication: LicenceApplicationView): void {
    if (licenceApplication) {
      this.licenceApplication = licenceApplication;
    }
  }

  public nextStep(licenceApplication?: LicenceApplicationView): void {
    if (licenceApplication) {
      this.licenceApplication = licenceApplication;
    }
    this.wizard.model.navigationMode.goToNextStep();
  }

  public previousStep(licenceApplication?: LicenceApplicationView): void {
    if (licenceApplication) {
      this.licenceApplication = licenceApplication;
    }
    this.wizard.model.navigationMode.goToPreviousStep();
  }
}
