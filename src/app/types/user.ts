import { Keycloak } from 'keycloak-angular/lib/core/services/keycloak.service';

export enum UserType {
  NONE = 0,
  INDIVIDUAL = 8461,
  COMPANY = 8463,
  PARTNERSHIP = 8465,
}

export class User {

  // attributes - common
  public id: string = null; // ccs id
  public userType: number = UserType.NONE;
  public title: string = ''; // Mr | Mrs | Ms etc
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public addressLine1: string = '';
  public addressLine2: string = '';
  public addressLine3: string = ''; // town
  public addressLine4: string = ''; // county
  public addressLine5: string = ''; // country
  public eircode: string = '';
  public phoneMobile: string = '';
  public phoneLandline: string = '';
  public lastLoginDate: string = '';
  public userReferenceNumber: string = ''; // originally required for co-applicant licence applications (may no longer be required)

  // attributes - individual
  public dob: string = ''; // date of birth dd/mm/yyyy
  public nationality: string = '';
  public ppsn: string = '';

  // attributes - company
  public companyName: string = ''; // if present, the UI assumes we are dealing with a company
  public registeredCountry: string = '';
  public companyNumber: string = '';
  public vatNumber: string = '';
  public fishBuyerRegistrationNumber: string = ''; // only show if present

  constructor(user?: User | Keycloak.KeycloakProfile | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (user) {
      // copy constructor

      // attributes - common
      this.id = user.id ? user.id : this.id;
      this.userType = user.userType ? user.userType : this.userType;
      this.title = user.title ? user.title : this.title;
      this.firstName = user.firstName ? user.firstName : this.firstName;
      this.lastName = user.lastName ? user.lastName : this.lastName;
      this.email = user.email ? user.email : this.email;
      this.addressLine1 = user.addressLine1 ? user.addressLine1 : this.addressLine1;
      this.addressLine2 = user.addressLine2 ? user.addressLine2 : this.addressLine2;
      this.addressLine3 = user.addressLine3 ? user.addressLine3 : this.addressLine3;
      this.addressLine4 = user.addressLine4 ? user.addressLine4 : this.addressLine4;
      this.addressLine5 = user.addressLine5 ? user.addressLine5 : this.addressLine5;
      this.eircode = user.eircode ? user.eircode : this.eircode;
      this.phoneLandline = user.phoneLandline ? user.phoneLandline : this.phoneLandline;
      this.phoneMobile = user.phoneMobile ? user.phoneMobile : this.phoneMobile;
      this.lastLoginDate = user.lastLoginDate ? user.lastLoginDate : this.lastLoginDate;
      this.userReferenceNumber = user.userReferenceNumber ? user.userReferenceNumber : this.userReferenceNumber;

      // attributes - individual
      this.dob = user.dob ? user.dob : this.dob;
      this.nationality = user.nationality ? user.nationality : this.nationality;
      this.ppsn = user.ppsn ? user.ppsn : this.ppsn;

      // attributes - company
      this.companyName = user.companyName ? user.companyName : this.companyName;
      this.registeredCountry = user.registeredCountry ? user.registeredCountry : this.registeredCountry;
      this.companyNumber = user.companyNumber ? user.companyNumber : this.companyNumber;
      this.vatNumber = user.vatNumber ? user.vatNumber : this.vatNumber;
      this.fishBuyerRegistrationNumber = user.fishBuyerRegistrationNumber ? user.fishBuyerRegistrationNumber : this.fishBuyerRegistrationNumber;
    }
  }
}

export class UserView extends User {

  constructor(user?: User | UserView | Keycloak.KeycloakProfile | any) { // DMcD 'any' only supported for unit testing
    super(user);
  }

  public set fullName(val: string) { }
  public get fullName(): string {
    return this.firstName + ' ' + this.lastName;
  }

  public isCompany(): boolean {
    // return this.companyName ? true : false;
    return (this.userType === UserType['COMPANY'] || this.companyName) ? true : false;
  }

  public isIndividual(): boolean {
    // return this.companyName ? true : false;
    return this.userType === UserType['INDIVIDUAL'];
  }

  public setKeycloakAttributes(keycloakProfile: Keycloak.KeycloakProfile): void {
    this.id = keycloakProfile.id ? keycloakProfile.id : this.id;
    this.firstName = keycloakProfile.firstName ? keycloakProfile.firstName : this.firstName;
    this.lastName = keycloakProfile.lastName ? keycloakProfile.lastName : this.lastName;
    this.email = keycloakProfile.email ? keycloakProfile.email : this.email;
  }
}
