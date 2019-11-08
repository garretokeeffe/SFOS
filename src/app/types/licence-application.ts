import * as moment from 'moment';
import { FleetSubSegment } from './fleet-segment';
import { User } from './user';
import { Vessel, VesselView } from './vessel';
import { DocumentationRequired } from './documentation-required';
import { ApplicantView } from './applicant';

export enum ApplicantType {
  NONE = 0,
  INDIVIDUAL = 1,
  COMPANY = 2,
  PARTNERSHIP = 3,
}
export enum LetterOfOfferStatus {
  NONE = 0,
  PENDING = 1,
  ACCEPTED = 2,
  REJECTED = 3,
  REVOKED = 4,
}
export enum LicenceApplicationStatus {
  NONE = 0,
  PENDING_ACCEPTANCE_OF_LETTER_OF_OFFER = 1,
  REVOKED = 2,
  PENDING_COMPLIANCE = 3,
  PROCESSING_APPLICATION = 4,
  ISSUED = 5,
  REJECTED = 6,
}

export class Applicant {
  public id?: number; // ccs id
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';

  constructor(applicant?: Applicant | User | any) {
    if (applicant) {
      // copy constructor
      if (applicant.id) {
        this.id = applicant.id;
      }
      this.firstName = applicant.firstName;
      this.lastName = applicant.lastName;
      this.email = applicant.email;
    }
  }
}

export class PreliminaryInformation {
  public applicantType: number = ApplicantType.NONE; // Corresponds to ApplicantType enum
  public primaryApplicant: Applicant = new Applicant();
  public otherApplicants: Array<Applicant> = [];
  public partnershipName: string = '';
  public companyName: string = '';
  public fleetSegment: number = FleetSubSegment.NONE;
  public loa: number = null;
  public registeredLength: number = null;

  constructor(preliminaryInformation?: PreliminaryInformation | any) {
    if (preliminaryInformation) {
      // copy constructor
      this.applicantType = preliminaryInformation.applicantType;
      this.primaryApplicant = new Applicant(preliminaryInformation.primaryApplicant);
      this.otherApplicants = preliminaryInformation.otherApplicants ? preliminaryInformation.otherApplicants : []; // reference copy
      this.partnershipName = preliminaryInformation.partnershipName ? preliminaryInformation.partnershipName : '';
      this.companyName = preliminaryInformation.companyName ? preliminaryInformation.companyName : '';
      this.fleetSegment = preliminaryInformation.fleetSegment;
      this.loa = preliminaryInformation.loa;
      this.registeredLength = preliminaryInformation.registeredLength;

      // If there are no otherApplicants, add a blank one so that the second applicant input fields
      // will automatically appear if the user selects applicantType = PARTNERSHIP
      // This blank item can be removed prior to being saved
      if (this.otherApplicants.length === 0) {
        this.otherApplicants.push(new Applicant());
      }
    }
  }
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
export class LetterOfOffer {
  public status: number = LetterOfOfferStatus.NONE;
  public terms: Array<LetterOfOfferTerm> = [];
  public issueDate: string = '';
  public expiryDate: string = ''; // 30 days after being issued
  public acceptedBy: Applicant = null;
  public acceptedDate: string = '';
  public rejectedBy: Applicant = null;
  public rejectedDate: string = '';
  // public downloadURL: string = '';

  constructor(letterOfOffer?: LetterOfOffer | any) {
    if (letterOfOffer) {
      this.status = letterOfOffer.status ? letterOfOffer.status : LetterOfOfferStatus.NONE;
      this.terms = letterOfOffer.terms; // reference copy
      this.issueDate = letterOfOffer.issueDate;
      this.expiryDate = letterOfOffer.expiryDate;
      this.acceptedBy = letterOfOffer.acceptedBy;
      this.acceptedDate = letterOfOffer.acceptedDate;
      this.rejectedBy = letterOfOffer.rejectedBy;
      this.rejectedDate = letterOfOffer.rejectedDate;
      // this.downloadURL = letterOfOffer.downloadURL;
    }
  }
}
export class LetterOfOfferView extends LetterOfOffer {

  constructor(letterOfOffer?: LetterOfOffer | LetterOfOfferView | any) { // DMcD 'any' only supported for unit testing
    super(letterOfOffer);
  }

  public setAccepted(applicant: Applicant): void {
    this.acceptedBy = applicant;
    this.acceptedDate = moment.utc(new Date()).format('DD/MM/YYYY');
    this.rejectedBy = null;
    this.rejectedDate = '';
  }
  public setRejected(applicant: Applicant): void {
    this.rejectedBy = applicant;
    this.rejectedDate = moment.utc(new Date()).format('DD/MM/YYYY');
    this.acceptedBy = null;
    this.acceptedDate = '';
  }
}

export class LicenceApplication {
  public status: number = LicenceApplicationStatus.NONE;
  public expiryDate: string = ''; // one year after letter of offer has been accepted
  public preliminaryInformation: PreliminaryInformation = new PreliminaryInformation();
  public arn: string = '';
  public pin: string = '';
  public letterOfOffer: LetterOfOffer | LetterOfOfferView = new LetterOfOfferView();
  public documentationRequired: Array<DocumentationRequired> = [];

  public vessel: Vessel | VesselView; // May not be required

  constructor(licenceApplication?: LicenceApplication | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (licenceApplication) {
      // copy constructor
      this.status = licenceApplication.status ? licenceApplication.status : LicenceApplicationStatus.NONE;
      this.expiryDate = licenceApplication.expiryDate;
      this.preliminaryInformation = new PreliminaryInformation(licenceApplication.preliminaryInformation);
      this.arn = licenceApplication.arn;
      this.pin = licenceApplication.pin;
      this.letterOfOffer = new LetterOfOfferView(licenceApplication.letterOfOffer);
      this.documentationRequired = [];
      if (licenceApplication.documentationRequired) {
        licenceApplication.documentationRequired.forEach((downloadLink: DocumentationRequired) => {
          this.documentationRequired.push(new DocumentationRequired((downloadLink)));
        });
      }

      this.vessel = new VesselView(licenceApplication.vessel); // May not be required
    }
  }
}

export class LicenceApplicationView extends LicenceApplication {

  constructor(licenceApplication?: LicenceApplication | LicenceApplicationView | any) { // DMcD 'any' only supported for unit testing
    super(licenceApplication);
  }
}
