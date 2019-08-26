import {Vessel, VesselView} from './vessel';
import {TrackRecord, TrackRecordView} from './trackRecord';
import {PenaltyPoints} from './points';
import {FleetSegmentManager} from './fleet-segment';

export enum CapacityType {
  ON_REGISTER = 1,
  OFF_REGISTER = 2,
  OFF_REGISTER_PROPOSED = 3,
  OFF_REGISTER_ASSIGNED = 4,
}

export enum OffRegisterType {
  OFF_REGISTER = 1,
  OFF_REGISTER_PROPOSED = 2,
  OFF_REGISTER_ASSIGNED = 3,
}

/*
// FleetSegment and FleetSubSegment are IFIS system defined values
export enum FleetSegment {
  NONE = 0,
  POLYVALENT = 1,
  RSW_PELAGIC = 2,
  SPECIFIC = 3,
  AQUACULTURE = 4,
  BEAM_TRAWLER = 5,
}
export enum FleetSubSegment {
  NONE = 0,
  RSW_PELAGIC = 1807585,
  POLYVALENT_LT_18M_LOA = 1942697,
  POLYVALENT_GTE_18M_LOA = 338360921,
  POLYVALENT_SCALLOPS_GTE_10M_LOA = 338360917,
  POLYVALENT_POTTING = 1942700,
  SPECIFIC_SCALLOPS_GTE_10M_LOA = 338360923,
  SPECIFIC_GENERAL = 1942695,
  AQUACULTURE = 1942701,
  BEAM_TRAWLER = 1942696,
}

// FleetSegmentView is a combined value used by the UI
export enum FleetSegmentView {
  NONE = 0,
  POLYVALENT = 100,
  POLYVALENT_LT_18M_LOA = 110,
  POLYVALENT_GTE_18M_LOA = 120,
  POLYVALENT_SCALLOPS_GTE_10M_LOA = 130,
  POLYVALENT_POTTING = 140,
  RSW_PELAGIC = 200,
  SPECIFIC = 300,
  SPECIFIC_SCALLOPS_GTE_10M_LOA = 310,
  SPECIFIC_GENERAL = 320,
  AQUACULTURE = 400,
  BEAM_TRAWLER = 500
}

export class CombinedFleetSegment {
  public fleetSegment: number = FleetSegment.NONE;
  public fleetSubSegment: number = FleetSubSegment.NONE;
}
*/

export class Capacity {
  public id: number = null;
  public ownerId: number = null;
  public type: number = null; // corresponds to CapacityType ENUM
  public fleetSegment: number = null; // corresponds to FleetSegment ENUM
  public fleetSubSegment: number = null; // corresponds to FleetSegment ENUM
  public gt: number = null; // this may be a subset of the entire capacity of the vessel
  public kw: number = null; // this may be a subset of the entire capacity of the vessel
  public trackRecord: TrackRecord | TrackRecordView = null;
  public offRegisterDate: string = '';
  public offRegisterExpiryDate: string = '';
  public penaltyPoints: Array<PenaltyPoints> = [];
  public vessel: Vessel | VesselView = null;

  constructor(capacity?: Capacity | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (capacity) {
      // copy constructor
      this.id = capacity.id;
      this.ownerId = capacity.userId;
      this.type = capacity.type;
      this.fleetSegment = capacity.fleetSegment;
      this.fleetSubSegment = capacity.fleetSubSegment;
      this.gt = capacity.gt;
      this.kw = capacity.kw;
      this.trackRecord = capacity.trackRecord;
      this.offRegisterDate = capacity.offRegisterDate ? capacity.offRegisterDate : '';
      this.offRegisterExpiryDate = capacity.offRegisterExpiryDate ? capacity.offRegisterExpiryDate : '';
      this.penaltyPoints = capacity.penaltyPoints; // reference copy
      this.vessel = new VesselView(capacity.vessel);
    }
  }

}

export class CapacityView extends Capacity {

  constructor(capacity?: Capacity | CapacityView | any) { // DMcD 'any' only supported for unit testing
    super(capacity);
    this.trackRecord = new TrackRecordView(capacity.trackRecord);
  }

  public displayFleetSegment(): string {
    return FleetSegmentManager.displayFleetSegment(this.fleetSegment);

    // display the enum description replacing the _ with a space
    /*
    if (FleetSegment[this.fleetSegment]) {
      let s: string = FleetSegment[this.fleetSegment].replace(/_/g, ' ');
      return s; // s.toLowerCase();
    } else {
      return String(this.fleetSegment);
    }
    */
  }
  public displayFleetSubSegment(): string {
    return FleetSegmentManager.displayFleetSubSegment(this.fleetSubSegment);

    // display the enum description replacing the _ with a space and LT and GTE with symbols
    /*
    if (FleetSubSegment[this.fleetSubSegment]) {
      let s: string = FleetSubSegment[this.fleetSubSegment].replace(/_/g, ' ');
      s = s.replace(/ LT /g, ' < ');
      s = s.replace(/ GTE /g, ' >= ');
      return s; // s.toLowerCase();
    } else {
      return String(this.fleetSubSegment);
    }
    */
  }
  public displayCombinedFleetSegment(): string {
    return FleetSegmentManager.displayCombinedFleetSegment(this.fleetSegment, this.fleetSubSegment);
  }

  public getTotalPenaltyPoints(): number {
    let total: number = 0;
    this.penaltyPoints.forEach( (penaltyPoints: PenaltyPoints ) => {
      total = total + penaltyPoints.pointsAssigned;
    });
    return total;
  }

}
