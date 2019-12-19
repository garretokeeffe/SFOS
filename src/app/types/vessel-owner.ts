export class VesselOwner {
  public id: string = null; // CCS Id
  public firstName: string = '';
  public lastName: string = '';
  public numberOfShares: number; // max =64
  public userReferenceNumber: string = '';
  public email: string = '';

  constructor(vesselOwner?: VesselOwner | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (vesselOwner) {
      // copy constructor
      this.id = vesselOwner.id;
      this.firstName = vesselOwner.firstName;
      this.lastName = vesselOwner.lastName;
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
    return this.firstName + ' ' + this.lastName;
  }
}
