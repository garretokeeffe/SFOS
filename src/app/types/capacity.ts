import { Vessel, VesselSummary, VesselView } from './vessel';
import { TrackRecord, TrackRecordType, TrackRecordView } from './trackRecord';
import {PenaltyPoints} from './points';
import {FleetSegmentManager} from './fleet-segment';
import { VesselOwnerView } from './vessel-owner';

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

export class AllCapacity {
  public ownerId: number = null; // maybe required for top level access by the LA, otherwise ownerId is accessible at Capacity level
  public onRegister: Array<Capacity | CapacityView> = [];
  public offRegister: Array<Capacity | CapacityView> = [];

  constructor(allCapacity?: AllCapacity | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (allCapacity) {
      // copy constructor
      this.ownerId = allCapacity.ownerId;
      this.onRegister = allCapacity.onRegister; // reference copy
      this.offRegister = allCapacity.offRegister; // reference copy
    }
  }
}
export class AllCapacityView extends AllCapacity {

  public static getTotalCapacity(capacities: Array<CapacityView> = []): string {
    let totalCapacity: string = '';
    if (capacities.length) {
      let totalGT: number = 0;
      let totalKW: number = 0;
      capacities.forEach((capacity: CapacityView) => {
        totalGT += capacity.gt;
        totalKW += capacity.kw;
      });
      totalCapacity = totalGT.toString() + ' GT ' + totalKW.toString() + ' kW';
    }
    return totalCapacity;
  }

  constructor(allCapacity?: AllCapacity | AllCapacityView | any) { // DMcD 'any' only supported for unit testing
    super(allCapacity);

    const onRegisterCapacity: Array<CapacityView> = [];
    this.onRegister.forEach((capacity) => {
      onRegisterCapacity.push(new CapacityView(capacity));
    });
    this.onRegister = onRegisterCapacity;

    const offRegisterCapacity: Array<CapacityView> = [];
    this.offRegister.forEach((capacity) => {
      offRegisterCapacity.push(new CapacityView(capacity));
    });
    this.offRegister = offRegisterCapacity;
  }

  public getFleetSegmentName(capacities: Array<CapacityView> = []): string {
    return capacities.length ? (capacities[0]).displayFleetSegment() : '';
  }

  public getTotalCapacity(capacities: Array<CapacityView> = []): string {
    return AllCapacityView.getTotalCapacity(capacities);
  }

}

export class CapacityDetail {
  public capacityAmount: number = null; // GT or kW amount
  public capacityType: string = null; // 'GT' | 'kW'
  public trackRecord: Array<TrackRecord | TrackRecordView> = [];
  public penaltyPoints: Array<PenaltyPoints> = []; // No need to display for On-Register as they apply to the parent capacity segment

  // attributes only applicable to off-register capacity
  public offRegisterDate: string = null; // dd/mm/yyyy
  public expiryDate: string = null; // dd/mm/yyyy
  public originatingVesselName: string = '';
  public originatingVesselId: string = ''; // futureproof, in case we need to do searches on originating vessel

  constructor(capacityDetail?: CapacityDetail | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (capacityDetail) {
      // copy constructor
      this.capacityAmount = capacityDetail.capacityAmount;
      this.capacityType = capacityDetail.capacityType;
      this.trackRecord = capacityDetail.trackRecord ? capacityDetail.trackRecord : this.trackRecord; // reference copy
      if (capacityDetail.trackRecord) {
        const tr: Array<TrackRecordView> = [];
        capacityDetail.trackRecord.forEach ((trackRecord: TrackRecord | TrackRecordView) => {
          tr.push(new TrackRecordView(trackRecord));
        });
        this.trackRecord = tr;
      } else {
        this.trackRecord = [];
      }
      this.penaltyPoints = capacityDetail.penaltyPoints; // reference copy

      // attributes only applicable to off-register capacity
      this.offRegisterDate = capacityDetail.offRegisterDate ? capacityDetail.offRegisterDate : this.offRegisterDate;
      this.expiryDate = capacityDetail.expiryDate ? capacityDetail.expiryDate : this.expiryDate;
      this.originatingVesselName = capacityDetail.originatingVesselName ? capacityDetail.originatingVesselName : this.originatingVesselName;
    }
  }
}

export class Capacity {
  public id: number = null; // not sure if this is required
  public ownerId: number = null;
  public offRegister: boolean = null; // true if capacity is off-register, otherwise false
  public type: number = null; // corresponds to CapacityType ENUM // TODO: this can be removed once implementation is switched to using offRegister and proposed flags
  public fleetSegment: number = null; // corresponds to FleetSegment ENUM
  public fleetSubSegment: number = null; // corresponds to FleetSegment ENUM
  public gt: number = null; // this may be a subset of the entire capacity of the vessel
  public kw: number = null; // this may be a subset of the entire capacity of the vessel

  // public trackRecord: TrackRecord | TrackRecordView = null;
  public details: Array<CapacityDetail> = [];

  // capacity-card attributes
  public vessel: VesselSummary | VesselView = null;
  public penaltyPoints: Array<PenaltyPoints> = []; // Overall points not applicable at top-level for off-register capacity
                                                   // For off-register, broken down points in CapacityDetail model are used
  // off-register only attributes
  public proposed: boolean = null; // true if capacity is off-register and proposed, otherwise false
  // public offRegisterDate: string = '';
  // public offRegisterExpiryDate: string = '';

  constructor(capacity?: Capacity | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (capacity) {
      // copy constructor
      this.id = capacity.id;
      this.ownerId = capacity.userId;
      this.offRegister = capacity.offRegister;
      this.proposed = capacity.proposed;
      this.type = capacity.type;
      this.fleetSegment = capacity.fleetSegment;
      this.fleetSubSegment = capacity.fleetSubSegment;
      this.gt = capacity.gt;
      this.kw = capacity.kw;
      // this.trackRecord = capacity.trackRecord;
      // this.offRegisterDate = capacity.offRegisterDate ? capacity.offRegisterDate : '';
      // this.offRegisterExpiryDate = capacity.offRegisterExpiryDate ? capacity.offRegisterExpiryDate : '';

      const details: Array<CapacityDetail> = [];
      if (capacity.details) {
        capacity.details.forEach((capacityDetail: CapacityDetail) => {
          details.push(new CapacityDetail(capacityDetail));
        });
        this.details = details;
      } else {
        this.details = [];
      }

      this.penaltyPoints = capacity.penaltyPoints; // reference copy
      this.vessel = new VesselView(capacity.vessel);
    }
  }

}

export class CapacityView extends Capacity {

  constructor(capacity?: Capacity | CapacityView | any) { // DMcD 'any' only supported for unit testing
    super(capacity);
    // this.trackRecord = new TrackRecordView(capacity.trackRecord);
  }

  public hasQuotaEligibility(): boolean {
    let qe: boolean = false;
    if (this.details) {
      this.details.forEach((capacityDetail: CapacityDetail) => {
        if (capacityDetail.trackRecord) {
          capacityDetail.trackRecord.forEach((trackRecord: TrackRecord) => {
            if (trackRecord.quotaEligibility) {
              qe = true;
            }
          });
        }
      });
    }
    return qe;
  }

  public getTrackRecordWithQuotaEligibility(): Array<string> {
    const tr: Array<string> = [];
    this.details.forEach((capacityDetail: CapacityDetail) => {
      capacityDetail.trackRecord.forEach((trackRecord: TrackRecordView) => {
        if (trackRecord.quotaEligibility) {
          // don't return duplicates (qe may be on both GT and kW)
          const type: string = trackRecord.displayType();
          if (!tr.includes(type)) {
            tr.push(type);
          }
        }
      });
    });
    return tr;
  }

  public hasTrackRecord(): boolean {
    let tr: boolean = false;
    if (this.details) {
      this.details.forEach((capacityDetail: CapacityDetail) => {
        if (capacityDetail.trackRecord && capacityDetail.trackRecord.length > 0) {
          tr = true;
        }
      });
    }
    return tr;
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
      total = total + penaltyPoints.numberOfPoints;
    });
    return total;
  }

}
