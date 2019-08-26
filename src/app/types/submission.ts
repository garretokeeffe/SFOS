import {User} from './user';
import {Vessel} from './vessel';
import {Applicant, ApplicantView} from './applicant';

export enum SubmissionType {
  LICENCE_APPLICATION = 1,
  CAPACITY_TRADE = 2,
  CAPACITY_SWAP = 3
}

/* Do we need different statuses for Licence and Swap applications? */
export enum SubmissionStatus {
  SUBMITTED = 1,
  APPROVED_BY_LA = 2,
  REFUSED_BY_LA = 3,
  ACCEPTED_BY_APPLICANT = 4,
  CONDITIONS_ACCEPTED_BY_APPLICANT = 5,
  NO_OP_LICENCE_ISSUED = 6,
  COMPLETE = 7 /* we need to determine what the end status is (eg is it NO_OP_LICENCE_ISSUED? */
}

export class Submission {
  public refId: number;
  public type: number; // corresponds to SubmissionType
  public applicants: Array<User> = [];
  public vessels: Array<Vessel> = [];
  public status: number; // corresponds to SubmissionStatus
  public createDate: string;
  public updateDate: string;

  // attributes used by Licencing Authority
  public assignee: User = null;

  constructor(submission?: Submission | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (submission) {
      // copy constructor
      this.refId = submission.refId;
      this.type = submission.type;
      this.applicants = submission.applicants ? submission.applicants : []; // reference copy
      this.vessels = submission.vessels ? submission.vessels : []; // reference copy
      this.status = submission.status;
      this.createDate = submission.createDate;
      this.updateDate = submission.updateDate;
      this.assignee = submission.assignee ? new User(submission.assignee) :  null;
    }
  }
}

export class SubmissionView extends Submission {

  public assignInProgress: boolean = false;

  constructor(submission?: Submission | SubmissionView | any) { // DMcD 'any' only supported for unit testing
    super(submission);
  }

  public displayType(): string {
    // display the enum description replacing the _ with a space
    if (SubmissionType[this.type]) {
      let s: string = SubmissionType[this.type].replace(/_/g, ' ');
      return this.toTitleCase(s);
    } else {
      return String(this.type);
    }
  }
  public displayStatus(): string {
    // display the enum description replacing the _ with a space
    if (SubmissionStatus[this.status]) {
      const s: string = SubmissionStatus[this.status].replace(/_/g, ' ');
      return s; // s.toLowerCase();
    } else {
      return String(this.status);
    }
  }

  public toTitleCase(str: string): string {
    const splitStr: Array<string> = str.toLowerCase().split(' ');
    for (let i: number = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }

  public toString(): string {
    let s: string = '';
    s += this.refId.toString();
    s += this.displayType();
    this.applicants.forEach( (applicant: User) => {
      s += applicant.firstName;
      s += applicant.surname;
    });
    this.vessels.forEach( (vessel: Vessel) => {
      s += vessel.name;
    });
    s += this.displayStatus();
    s += this.createDate;
    s += this.updateDate;
    if (this.assignee) {
      s += this.assignee.firstName;
      s += this.assignee.surname;
    }

    return s;
  }
}
