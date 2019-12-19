import { VesselSummary, VesselView } from './vessel';
import { TrackRecord, TrackRecordView } from './trackRecord';
import { PenaltyPoints } from './points';
import { FleetSegment, FleetSegmentManager, FleetSubSegment } from './fleet-segment';

export class AllCapacity {
  public ownerId: string = null; // maybe required for top level access by the LA, otherwise ownerId is accessible at Capacity level
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

export class Capacity {
  public capAccountId: number = null; // currently not required by the ui,
                            // but may be required for update capacity functionality

  public ownerId: string = null; // CCS User Id
  public offRegister: boolean = null; // true if capacity is off-register, otherwise false
  public fleetSegment: number = FleetSegment.NONE; // corresponds to FleetSegment ENUM
  public fleetSubSegment: number = FleetSubSegment.NONE; // corresponds to FleetSegment ENUM
  public gt: number = null; // this may be a subset of the entire capacity of the vessel
  public kw: number = null; // this may be a subset of the entire capacity of the vessel

  public blocks: Array<CapacityBlock> = [];

  // capacity-card attributes
  public vessel: VesselSummary | VesselView = null;
  public penaltyPoints: Array<PenaltyPoints> = []; // Overall points not applicable at top-level for off-register capacity which is not
                                                   // proposed. For off-register, broken down points in CapacityBlock model are used.
  // off-register only attributes
  public proposed: boolean = null; // true if capacity is off-register and proposed, otherwise false

  constructor(capacity?: Capacity | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (capacity) {
      // copy constructor
      this.capAccountId = capacity.capAccountId;
      this.ownerId = capacity.userId;
      this.offRegister = capacity.offRegister;
      this.proposed = capacity.proposed;
      this.fleetSegment = capacity.fleetSegment;
      this.fleetSubSegment = capacity.fleetSubSegment;
      this.gt = capacity.gt;
      this.kw = capacity.kw;
      // this.trackRecord = capacity.trackRecord;
      // this.offRegisterDate = capacity.offRegisterDate ? capacity.offRegisterDate : '';
      // this.offRegisterExpiryDate = capacity.offRegisterExpiryDate ? capacity.offRegisterExpiryDate : '';

      const blocks: Array<CapacityBlock> = [];
      if (capacity.blocks) {
        capacity.blocks.forEach((capacityBlock: CapacityBlock) => {
          blocks.push(new CapacityBlock(capacityBlock));
        });
        this.blocks = blocks;
      } else {
        this.blocks = [];
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
    if (this.blocks) {
      this.blocks.forEach((capacityBlock: CapacityBlock) => {
        if (capacityBlock.trackRecord) {
          capacityBlock.trackRecord.forEach((trackRecord: TrackRecord) => {
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
    this.blocks.forEach((capacityDetail: CapacityBlock) => {
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
    if (this.blocks) {
      this.blocks.forEach((capacityBlock: CapacityBlock) => {
        if (capacityBlock.trackRecord && capacityBlock.trackRecord.length > 0) {
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

export class CapacityBlock {
  public capBlockId: number = null; // currently not required by the ui,
                                    // but may be required for update capacity functionality
  public capacityAmount: number = null; // GT or kW amount
  public capacityType: string = null; // 'GT' | 'kW'
  public trackRecord: Array<TrackRecord | TrackRecordView> = [];
  public penaltyPoints: Array<PenaltyPoints> = []; // No need to display for On-Register as they apply to the parent capacity segment

  // attributes only applicable to off-register capacity
  public offRegisterDate: string = null; // dd/mm/yyyy
  public expiryDate: string = null; // dd/mm/yyyy
  public sourceVesselName: string = '';
  public sourceVesselId: string = ''; // future-proof, in case we need to do searches on the source vessel

  constructor(capacityBlock?: CapacityBlock | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (capacityBlock) {
      // copy constructor
      this.capBlockId = capacityBlock.capBlockId;
      this.capacityAmount = capacityBlock.capacityAmount;
      this.capacityType = capacityBlock.capacityType;
      this.trackRecord = capacityBlock.trackRecord ? capacityBlock.trackRecord : this.trackRecord; // reference copy
      if (capacityBlock.trackRecord) {
        const tr: Array<TrackRecordView> = [];
        capacityBlock.trackRecord.forEach ((trackRecord: TrackRecord | TrackRecordView) => {
          tr.push(new TrackRecordView(trackRecord));
        });
        this.trackRecord = tr;
      } else {
        this.trackRecord = [];
      }
      this.penaltyPoints = capacityBlock.penaltyPoints; // reference copy

      // attributes only applicable to off-register capacity
      this.offRegisterDate = capacityBlock.offRegisterDate ? capacityBlock.offRegisterDate : this.offRegisterDate;
      this.expiryDate = capacityBlock.expiryDate ? capacityBlock.expiryDate : this.expiryDate;
      this.sourceVesselName = capacityBlock.sourceVesselName ? capacityBlock.sourceVesselName : this.sourceVesselName;
    }
  }
}
