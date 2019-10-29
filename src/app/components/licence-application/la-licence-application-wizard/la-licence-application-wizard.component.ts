import { ChangeDetectorRef, Component, OnInit, Optional, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { LicenceApplicationView } from '../../../types/licence-application';
import { WizardComponent } from 'angular-archwizard';
import { UserView } from '../../../types/user';
import { UserService } from '../../../services/user.service';
import { animations } from '../../../animations';

@Component({
  selector: 'app-la-licence-application-wizard',
  templateUrl: './la-licence-application-wizard.component.html',
  styleUrls: ['./la-licence-application-wizard.component.css'],
  animations: animations,
})
export class LaLicenceApplicationWizardComponent implements OnInit {

  public applicationActivated: boolean = false;

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
              private userService: UserService) { }

  public ngOnInit(): void {
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
    this.applicationActivated = true;
  }

  public onRejectTerms(licenceApplication: LicenceApplicationView): void {
    if (licenceApplication) {
      this.licenceApplication = licenceApplication;
    }
    this.applicationActivated = false;
  }

  public goToSubmitDocumentationStep(licenceApplication?: LicenceApplicationView): void {

    if (licenceApplication) {
      this.licenceApplication = licenceApplication;
    }
    this.applicationActivated = true;
    setTimeout( () => {
      setTimeout( () => {
        this.wizard.model.navigationMode.goToNextStep();
      }, 50);
      this.wizard.model.navigationMode.goToNextStep();
    }, 50);
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
