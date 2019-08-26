import { CapacityView } from './capacity';
import { FleetSegment, FleetSubSegment, FleetSegmentManager } from './fleet-segment';

export enum LicenceStatus {
  UNKNOWN = 0,
  PENDING = 1942546,
  APPROVED = 1942549,
  ISSUED = 1942550,
  WITHDRAWN = 1942551,
  REFUSED = 1942552,
  REVOKED = 1942556,
}

export class Licence {
  public type: string = '';
  public status: number = LicenceStatus.UNKNOWN; // Corresponds to LicenceStatus enum
  public fleetSegment: number = FleetSegment.NONE; // Corresponds tp FleetSegment enum
  public fleetSubSegment: number = FleetSubSegment.NONE; // Corresponds tp FleetSubSegment enum
  public startDate: string = '';
  public endDate: string = '';

  constructor(licence?: Licence | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (licence) {
      // copy constructor
      this.type = licence.type;
      this.status = licence.status;
      this.fleetSegment = licence.fleetSegment;
      this.fleetSubSegment = licence.fleetSubSegment;
      this.startDate = licence.startDate;
      this.endDate = licence.endDate;
    }
  }
}

export class LicenceView extends Licence {
  constructor(licence?: Licence | LicenceView | any) { // DMcD 'any' only supported for unit testing
    super(licence);
  }

  public displayStatus(): string {
    // display the enum description replacing the _ with a space
    if (LicenceStatus[this.status]) {
      const s: string = LicenceStatus[this.status].replace(/_/g, ' ');
      return s; // s.toLowerCase();
    } else {
      return String(this.status);
    }
  }

  public displayFleetSegment(): string {
    return FleetSegmentManager.displayFleetSegment(this.fleetSegment);
  }
  public displayFleetSubSegment(): string {
    return FleetSegmentManager.displayFleetSubSegment(this.fleetSubSegment);
  }
  public displayCombinedFleetSegment(): string {
    return FleetSegmentManager.displayCombinedFleetSegment(this.fleetSegment, this.fleetSubSegment);
  }
}
