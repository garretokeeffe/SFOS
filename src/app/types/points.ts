// Penalty Points Type

export class PenaltyPoints {
  public pointsAssigned: number = null;
  public expiryDate: string = null;
  public reasons?: Array<string> = [];

  constructor(points?: PenaltyPoints | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (points) {
      // copy constructor
      this.pointsAssigned = points.pointsAssigned;
      this.expiryDate = points.expiryDate ? points.expiryDate : '';
      this.reasons =  points.reasons ? points.reasons : []; // reference copy
    }
  }
}

