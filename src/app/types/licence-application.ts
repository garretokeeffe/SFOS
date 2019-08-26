import {Vessel, VesselView} from './vessel';
import {Applicant, ApplicantView} from './applicant';

export enum LicenceApplicationUpdate {
  PRIMLINARY_INFO_SUBMITTED = 1
}

export class LetterOfOfferTerm {
  public id: number = null;
  public text: string = '';

  constructor(letterOfOfferTerm?: LetterOfOfferTerm | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (letterOfOfferTerm) {
      // copy constructor
      this.id = letterOfOfferTerm.id;
      this.text = letterOfOfferTerm.text;
    }
  }
}

export class LicenceApplication {
  public vessel: Vessel | VesselView;
  public changed: boolean = false;
  public applicants: Array<ApplicantView> = [];

  public vesselName_prelim: string = '';
  public segment_prelim: string = '';
  public loa_prelim: string = '';

  public refId: string = '';
  public letterOfOfferIssued: boolean = false;
  public letterOfOfferIssueDate: string = '';
  public letterOfOfferTerms: Array<LetterOfOfferTerm> = [];
  public letterOfOfferTermsDeadlineDate: string = '';

  constructor(licenceApplication?: LicenceApplication | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (licenceApplication) {
      // copy constructor
      // this.vessel = licenceApplication.vessel ? new VesselView(licenceApplication.vessel) : new VesselView(); // reference copy
      this.vessel = new VesselView(licenceApplication.vessel); // reference copy

      if (licenceApplication.applicants) {
        licenceApplication.applicants.forEach((applicant: Applicant) => {
          this.applicants.push(new ApplicantView(applicant));
        });
      }

      this.vesselName_prelim = licenceApplication.vesselName_prelim;
      this.segment_prelim = licenceApplication.segment_prelim;
      this.loa_prelim = licenceApplication.loa_prelim;

      this.refId = licenceApplication.refId;
      this.letterOfOfferIssued = licenceApplication.letterOfOfferIssued;
      this.letterOfOfferIssueDate = licenceApplication.letterOfOfferIssueDate;
      this.letterOfOfferTerms = licenceApplication.letterOfOfferTerms; // reference copy
      this.letterOfOfferTermsDeadlineDate = licenceApplication.letterOfOfferTermsDeadlineDate;
    } else {
      this.vessel = new VesselView();
    }
  }
}

export class LicenceApplicationView extends LicenceApplication {

  private _activeApplicant: ApplicantView = new ApplicantView();

  constructor(licenceApplication?: LicenceApplication | LicenceApplicationView | any) { // DMcD 'any' only supported for unit testing
    super(licenceApplication);
  }

  public setActiveApplicant(userReferenceNumber: string): boolean {
    const applicant: ApplicantView = this.applicants.filter( (el: ApplicantView) => el.userReferenceNumber === userReferenceNumber)[0];
    if (applicant) {
      this._activeApplicant = applicant;
      return true;
    } else {
      console.log('Failed to setActiveApplicant. No match found for User Reference Number: ' + userReferenceNumber);
      return false; // no such user.
    }
  }
  public getApplicant(userReferenceNumber: string): ApplicantView {
    const applicant: ApplicantView = this.applicants.filter( (el: ApplicantView) => el.userReferenceNumber === userReferenceNumber)[0];
    if (applicant) {
      return applicant;
    } else {
      return null; // no such user.
    }
  }

  public set activeApplicant(applicant: ApplicantView) {}
  public get activeApplicant(): ApplicantView {
    if (!this._activeApplicant) {
      console.log('No active applicant. getActiveApplicant() has been called before a successful call to setActiveApplicant().');
    }
    return this._activeApplicant;
  }

  public setLetterOfOfferTermsAccepted(): boolean {
    if (this.activeApplicant) {
      this.activeApplicant.setLetterOfOfferTermsAccepted();
      return true;
    } else {
      return false; // no such user.
    }
  }
  public setLetterOfOfferTermsRejected(): boolean {
    if (this.activeApplicant) {
      this.activeApplicant.setLetterOfOfferTermsRejected();
      return true;
    } else {
      return false; // no such user.
    }
  }

  public set hasAcceptedLetterOfOfferTerms(val: boolean) {}
  public get hasAcceptedLetterOfOfferTerms(): boolean {
    let accepted: boolean = true;
    this.applicants.forEach((applicant: ApplicantView) => {
      if (!applicant.hasAcceptedLetterOfOfferTerms) {
        accepted = false;
      }
    });
    return accepted;
  }
}

