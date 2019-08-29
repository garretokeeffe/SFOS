import {User} from './user';
import {PopupInfo} from './dialog-info';

export enum LetterOfOfferTermsAcceptanceStatus {
  PENDING = 1,
  ACCEPTED = 2,
  REJECTED = 3
}

export class Applicant {
  public id: string = null;
  public firstName: string = '';
  public lastName: string;
  public numberOfShares: number; // max =64
  public userReferenceNumber: string;
  public email: string;
  public letterOfOfferTermsAcceptanceStatus: number = LetterOfOfferTermsAcceptanceStatus['PENDING']; // conforms to LetterOfOfferTermsAcceptanceStatus enum
  public letterOfOfferTermsAcceptedDate: string = '';
  public letterOfOfferTermsRejectedDate: string = '';

  constructor(applicant?: Applicant | User | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (applicant) {
      // copy constructor
      this.id = applicant.id;
      this.firstName = applicant.firstName;
      this.lastName = applicant.lastName;
      this.numberOfShares = applicant.numberOfShares;
      this.userReferenceNumber = applicant.userReferenceNumber;
      this.email = applicant.email;
      if (applicant.letterOfOfferTermsAcceptanceStatus) {
        this.letterOfOfferTermsAcceptanceStatus = applicant.letterOfOfferTermsAcceptanceStatus;
      }
      this.letterOfOfferTermsAcceptedDate = applicant.letterOfOfferTermsAcceptedDate;
      this.letterOfOfferTermsRejectedDate = applicant.letterOfOfferTermsRejectedDate;
    }
  }
}

export class ApplicantView extends Applicant {
  public notFound: boolean = false;

  constructor(applicant?: Applicant | User | ApplicantView | any) { // DMcD 'any' only supported for unit testing
    super(applicant);

    if (applicant) {
      this.notFound = applicant.notFound;
    }
  }

  public popupInfo(): PopupInfo {
    return new PopupInfo('APPLICANT', [
      {name: 'Name', value: this.fullName},
      {name: 'User Reference Number', value: this.userReferenceNumber},
      {name: 'Email', value: this.email},
      {name: 'Number of Shares', value: String(this.numberOfShares)},
    ]);
  }

  public set fullName(val: string) { }
  public get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  public setLetterOfOfferTermsAccepted(accepted: boolean = true): void {
    if (accepted) {
      this.letterOfOfferTermsAcceptanceStatus = LetterOfOfferTermsAcceptanceStatus['ACCEPTED'];
    } else {
      this.letterOfOfferTermsAcceptanceStatus = LetterOfOfferTermsAcceptanceStatus['PENDING'];
    }
  }
  public setLetterOfOfferTermsRejected(): void {
    this.letterOfOfferTermsAcceptanceStatus = LetterOfOfferTermsAcceptanceStatus['REJECTED'];
  }

  public set hasAcceptedLetterOfOfferTerms(val: boolean) {}
  public get hasAcceptedLetterOfOfferTerms(): boolean {
    return this.letterOfOfferTermsAcceptanceStatus === LetterOfOfferTermsAcceptanceStatus['ACCEPTED'];
  }

  public set hasRejectedLetterOfOfferTerms(val: boolean) {}
  public get hasRejectedLetterOfOfferTerms(): boolean {
    return this.letterOfOfferTermsAcceptanceStatus === LetterOfOfferTermsAcceptanceStatus['REJECTED'];
  }

  public displayLetterOfOfferAcceptanceStatus(): string {
    // display the enum description replacing the _ with a space
    if (LetterOfOfferTermsAcceptanceStatus[this.letterOfOfferTermsAcceptanceStatus]) {
      const s: string = LetterOfOfferTermsAcceptanceStatus[this.letterOfOfferTermsAcceptanceStatus].replace(/_/g, ' ');
      // s = s.replace(/QB NA/g, 'QB N/A');
      return s;
    } else {
      return String(this.letterOfOfferTermsAcceptanceStatus);
    }
    // return Status[this.status] ? Status[this.status].replace(/_/g, ' ') : String(this.status);
  }
}
