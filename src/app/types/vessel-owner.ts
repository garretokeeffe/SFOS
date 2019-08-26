export class VesselOwner {
  public id: number = null;
  public firstName: string = '';
  public surname: string = '';
  public numberOfShares: number; // max =64
  public userReferenceNumber: string = '';
  public email: string = '';

  constructor(vesselOwner?: VesselOwner | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (vesselOwner) {
      // copy constructor
      this.id = vesselOwner.id;
      this.firstName = vesselOwner.firstName;
      this.surname = vesselOwner.surname;
      this.numberOfShares = vesselOwner.numberOfShares;
      this.userReferenceNumber = vesselOwner.userReferenceNumber;
      this.email = vesselOwner.email;
    }
  }
}

export class VesselOwnerView extends VesselOwner {
  constructor(vesselOwner?: VesselOwner | VesselOwnerView | any) { // DMcD 'any' only supported for unit testing
    super(vesselOwner);
  }

  public set fullName(val: string) { }
  public get fullName(): string {
    return this.firstName + ' ' + this.surname;
  }
}
