import { ChangeDetectorRef, Component, Input, OnInit, Optional, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { LicenceApplicationStatus, LicenceApplicationView } from '../../../types/licence-application';
import { WizardComponent } from 'angular-archwizard';
import { UserView } from '../../../types/user';
import { UserService } from '../../../services/user.service';
import { animations } from '../../../animations';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenceService } from '../../../services/licence.service';

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

  public licenceApplication: LicenceApplicationView = new LicenceApplicationView();
  public user: UserView = null;

  public errorMessage: string = '';
  public loading: boolean = false;
  public forceNavigation: boolean = false; // set to true to make wizard automatically skip to a specific step

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.HandsetPortrait)
  .pipe(
    map((result) => result.matches),
  );

  constructor(private breakpointObserver: BreakpointObserver,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private licenceService: LicenceService,
              @Optional() public cdRef: ChangeDetectorRef) { }

  public ngOnInit(): void {
    this.errorMessage = '';

    this.mode = this.route.snapshot.params.id ? this.route.snapshot.params.id : LaWizardMode.NONE;
    console.log('Wizard mode = ' + LaWizardMode[this.mode]);

    this.loading = true;
    this.userService.getCurrentUser().subscribe((user: UserView) => {
      this.user = user;

      if (this.route.snapshot.params.arn) {
        console.log('Wizard is opening Licence Application with ARN: [' + this.route.snapshot.params.arn + ']');
        this.licenceService.getLicenceApplication(this.user.id, this.route.snapshot.params.arn)
        .subscribe( (licenceApplication: LicenceApplicationView) => {
          if (licenceApplication === null) {
            this.errorMessage = 'Sorry, something went wrong. The licence application ' + this.route.snapshot.params.arn + ' could not be retrieved.';
          } else {
            this.forceNavigation = true;
            this.licenceApplication = licenceApplication;
          }
          this.loading = false;
          // this.submissionInProgress = false;
        }, (error) => {
          this.errorMessage = 'Sorry, something went wrong. The licence application ' + this.route.snapshot.params.arn + ' could not be retrieved.';
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    },
    (error) => {
      this.loading = false;
      console.log('Failed to get user profile');
    });
  }

  public ngAfterViewChecked(): void {
    // detect changes after view checked to avoid "expression has changed after it was checked" exceptions
    this.cdRef.detectChanges();

    if (this.wizard && this.route.snapshot.params.arn && this.forceNavigation && this.licenceApplication.status === LicenceApplicationStatus['PENDING_COMPLIANCE']) {
      // User has already accepted the terms of the letter of offer, so skip to the document checklist page
      this.forceNavigation = false;
      this.goToStep('SUBMIT_MANUALLY');
    }
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

    setTimeout( () => {
      this.wizard.model.navigationMode.goToStep(this.wizard.model.getIndexOfStepWithId('SUBMIT_MANUALLY'));
    }, 250);
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

  public goToMyApplications(): void {
    this.router.navigate(['/licences']).then( (e) => {
      /*if (e) {
        console.log('Rendering the My Applications page');
      } else {
        console.error('Failed to render the My Applications page');
      }*/
    });
  }
}
