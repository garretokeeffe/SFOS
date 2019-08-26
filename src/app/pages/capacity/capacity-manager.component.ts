import { CapacityType, CapacityView } from '../../types/capacity';
import { FleetSegment, FleetSubSegment } from '../../types/fleet-segment';

export class CapacityManager {

  public onRegister: Array<CapacityView> = [];
  public offRegisterAll: Array<CapacityView> = [];
  public offRegister: Array<CapacityView> = [];
  public offRegister_Proposed: Array<CapacityView> = [];
  public offRegister_Assigned: Array<CapacityView> = [];
  
  public onRegisterPolyvalent: Array<CapacityView> = [];
  public onRegisterPolyvalent_under18M: Array<CapacityView> = [];
  public onRegisterPolyvalent_18MorOver: Array<CapacityView> = [];
  public onRegisterPolyvalent_Scallops: Array<CapacityView> = [];
  public onRegisterPolyvalent_Potting: Array<CapacityView> = [];
  public onRegisterRSWPelagic: Array<CapacityView> = [];
  public onRegisterSpecific: Array<CapacityView> = [];
  public onRegisterSpecific_Scallops: Array<CapacityView> = [];
  public onRegisterSpecific_General: Array<CapacityView> = [];
  public onRegisterAquaculture: Array<CapacityView> = [];
  public onRegisterBeamTrawler: Array<CapacityView> = [];

  public offRegisterPolyvalent: Array<CapacityView> = [];
  public offRegisterPolyvalent_under18M: Array<CapacityView> = [];
  public offRegisterPolyvalent_18MorOver: Array<CapacityView> = [];
  public offRegisterPolyvalent_Scallops: Array<CapacityView> = [];
  public offRegisterPolyvalent_Potting: Array<CapacityView> = [];
  public offRegisterRSWPelagic: Array<CapacityView> = [];
  public offRegisterSpecific: Array<CapacityView> = [];
  public offRegisterSpecific_Scallops: Array<CapacityView> = [];
  public offRegisterSpecific_General: Array<CapacityView> = [];
  public offRegisterAquaculture: Array<CapacityView> = [];
  public offRegisterBeamTrawler: Array<CapacityView> = [];

  public capacities: Array<CapacityView> = [];

  public static getTotalCapacity(capacities: Array<CapacityView> = []): string {
    let totalCapacity: string = '';
    if (capacities.length) {
      let total_gt: number = 0;
      let total_kw: number = 0;
      capacities.forEach((capacity: CapacityView) => {
        total_gt += capacity.gt;
        total_kw += capacity.kw;
      });
      totalCapacity = total_gt.toString() + ' GT ' + total_kw.toString() + ' kW';
    }
    return totalCapacity;
  }

  constructor(public capacitiesUnsorted: Array<CapacityView> = []) {
    this.capacities = capacitiesUnsorted.sort((c1, c2) => {
      return (c1.vessel.name < c2.vessel.name ? -1 : 1); // ascending
    });

    this.onRegister = this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER);
    this.offRegisterAll = this.capacities.filter(elem => [CapacityType.OFF_REGISTER, CapacityType.OFF_REGISTER_PROPOSED, CapacityType.OFF_REGISTER_ASSIGNED].includes(elem.type));
    this.offRegister = this.capacities.filter(elem => [CapacityType.OFF_REGISTER].includes(elem.type));
    this.offRegister_Proposed = this.capacities.filter(elem => [CapacityType.OFF_REGISTER_PROPOSED].includes(elem.type));
    this.offRegister_Assigned = this.capacities.filter(elem => [CapacityType.OFF_REGISTER_ASSIGNED].includes(elem.type));

    // ON REGISTER
    this.onRegisterPolyvalent = this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER && elem.fleetSegment === FleetSegment.POLYVALENT);
    this.onRegisterPolyvalent_under18M = this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER
      && elem.fleetSegment === FleetSegment.POLYVALENT && elem.fleetSubSegment === FleetSubSegment.POLYVALENT_LT_18M_LOA);
    this.onRegisterPolyvalent_18MorOver = this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER
      && elem.fleetSegment === FleetSegment.POLYVALENT && elem.fleetSubSegment === FleetSubSegment.POLYVALENT_GTE_18M_LOA);
    this.onRegisterPolyvalent_Scallops = this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER
      && elem.fleetSegment === FleetSegment.POLYVALENT && elem.fleetSubSegment === FleetSubSegment.POLYVALENT_SCALLOPS_GTE_10M_LOA);
    this.onRegisterPolyvalent_Potting = this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER
      && elem.fleetSegment === FleetSegment.POLYVALENT && elem.fleetSubSegment === FleetSubSegment.POLYVALENT_POTTING);

    this.onRegisterRSWPelagic = this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER && elem.fleetSegment === FleetSegment.RSW_PELAGIC);

    this.onRegisterSpecific = this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER && elem.fleetSegment === FleetSegment.SPECIFIC);
    this.onRegisterSpecific_Scallops = this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER
      && elem.fleetSegment === FleetSegment.SPECIFIC && elem.fleetSubSegment === FleetSubSegment.SPECIFIC_SCALLOPS_GTE_10M_LOA);
    this.onRegisterSpecific_General = this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER
      && elem.fleetSegment === FleetSegment.SPECIFIC && elem.fleetSubSegment === FleetSubSegment.SPECIFIC_GENERAL);

    this.onRegisterAquaculture = this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER && elem.fleetSegment === FleetSegment.AQUACULTURE);
    this.onRegisterBeamTrawler = this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER && elem.fleetSegment === FleetSegment.BEAM_TRAWLER);

    // OFF REGISTER
    this.offRegisterPolyvalent = this.capacities.filter(elem => elem.type === CapacityType.OFF_REGISTER && elem.fleetSegment === FleetSegment.POLYVALENT);
    this.offRegisterPolyvalent_under18M = this.capacities.filter(elem => elem.type === CapacityType.OFF_REGISTER
      && elem.fleetSegment === FleetSegment.POLYVALENT && elem.fleetSubSegment === FleetSubSegment.POLYVALENT_LT_18M_LOA);
    this.offRegisterPolyvalent_18MorOver = this.capacities.filter(elem => elem.type === CapacityType.OFF_REGISTER
      && elem.fleetSegment === FleetSegment.POLYVALENT && elem.fleetSubSegment === FleetSubSegment.POLYVALENT_GTE_18M_LOA);
    this.offRegisterPolyvalent_Scallops = this.capacities.filter(elem => elem.type === CapacityType.OFF_REGISTER
      && elem.fleetSegment === FleetSegment.POLYVALENT && elem.fleetSubSegment === FleetSubSegment.POLYVALENT_SCALLOPS_GTE_10M_LOA);
    this.offRegisterPolyvalent_Potting = this.capacities.filter(elem => elem.type === CapacityType.OFF_REGISTER
      && elem.fleetSegment === FleetSegment.POLYVALENT && elem.fleetSubSegment === FleetSubSegment.POLYVALENT_POTTING);

    this.offRegisterRSWPelagic = this.capacities.filter(elem => elem.type === CapacityType.OFF_REGISTER && elem.fleetSegment === FleetSegment.RSW_PELAGIC);

    this.offRegisterSpecific = this.capacities.filter(elem => elem.type === CapacityType.OFF_REGISTER && elem.fleetSegment === FleetSegment.SPECIFIC);
    this.offRegisterSpecific_Scallops = this.capacities.filter(elem => elem.type === CapacityType.OFF_REGISTER
      && elem.fleetSegment === FleetSegment.SPECIFIC && elem.fleetSubSegment === FleetSubSegment.SPECIFIC_SCALLOPS_GTE_10M_LOA);
    this.offRegisterSpecific_General = this.capacities.filter(elem => elem.type === CapacityType.OFF_REGISTER
      && elem.fleetSegment === FleetSegment.SPECIFIC && elem.fleetSubSegment === FleetSubSegment.SPECIFIC_GENERAL);

    this.offRegisterAquaculture = this.capacities.filter(elem => elem.type === CapacityType.OFF_REGISTER && elem.fleetSegment === FleetSegment.AQUACULTURE);
    this.offRegisterBeamTrawler = this.capacities.filter(elem => elem.type === CapacityType.OFF_REGISTER && elem.fleetSegment === FleetSegment.BEAM_TRAWLER);
  }

  public getTotalCapacity(capacities: Array<CapacityView> = []): string {
    return CapacityManager.getTotalCapacity(capacities);
  }

  public getOnRegister(): Array<CapacityView> {
    return this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER);
  }
  public getOffRegister_All(): Array<CapacityView> {
    return this.capacities.filter(elem => [CapacityType.OFF_REGISTER, CapacityType.OFF_REGISTER_PROPOSED, CapacityType.OFF_REGISTER_ASSIGNED].includes(elem.type));
  }
  public getOffRegister(): Array<CapacityView> {
    return this.capacities.filter(elem => [CapacityType.OFF_REGISTER].includes(elem.type));
  }
  public getOffRegister_Proposed(): Array<CapacityView> {
    return this.capacities.filter(elem => [CapacityType.OFF_REGISTER_PROPOSED].includes(elem.type));
  }
  public getOffRegister_Assigned(): Array<CapacityView> {
    return this.capacities.filter(elem => [CapacityType.OFF_REGISTER_ASSIGNED].includes(elem.type));
  }

  public getOnRegisterPolyvalent(): Array<CapacityView> {
    return this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER && elem.fleetSegment === FleetSegment.POLYVALENT);
  }
  public getOnRegisterRSWPelagic(): Array<CapacityView> {
    return this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER && elem.fleetSegment === FleetSegment.RSW_PELAGIC);
  }
  public getOnRegisterSpecific(): Array<CapacityView> {
    return this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER && elem.fleetSegment === FleetSegment.SPECIFIC);
  }
  public getOnRegisterAquaculture(): Array<CapacityView> {
    return this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER && elem.fleetSegment === FleetSegment.AQUACULTURE);
  }
  public getOnRegisterBeamTrawler(): Array<CapacityView> {
    return this.capacities.filter(elem => elem.type === CapacityType.ON_REGISTER && elem.fleetSegment === FleetSegment.BEAM_TRAWLER);
  }

  public isMultipleSubSegments(capacityType: CapacityType, fleetSegment: FleetSegment): boolean {
    let subSegmentCount: number = 0;

    if (capacityType === CapacityType.ON_REGISTER) {
      // ON REGISTER
      switch (fleetSegment) {
        case FleetSegment.POLYVALENT:
          subSegmentCount = this.onRegisterPolyvalent_under18M.length ? subSegmentCount+1 : subSegmentCount;
          subSegmentCount = this.onRegisterPolyvalent_18MorOver.length ? subSegmentCount+1 : subSegmentCount;
          subSegmentCount = this.onRegisterPolyvalent_Scallops.length ? subSegmentCount+1 : subSegmentCount;
          subSegmentCount = this.onRegisterPolyvalent_Potting.length ? subSegmentCount+1 : subSegmentCount;
          break;
        case FleetSegment.SPECIFIC:
          subSegmentCount = this.onRegisterSpecific_Scallops.length ? subSegmentCount+1 : subSegmentCount;
          subSegmentCount = this.onRegisterSpecific_General.length ? subSegmentCount+1 : subSegmentCount;
          break;
      }
    } else {
      // OFF REGISTER
      switch (fleetSegment) {
        case FleetSegment.POLYVALENT:
          subSegmentCount = this.offRegisterPolyvalent_under18M.length ? subSegmentCount + 1 : subSegmentCount;
          subSegmentCount = this.offRegisterPolyvalent_18MorOver.length ? subSegmentCount + 1 : subSegmentCount;
          subSegmentCount = this.offRegisterPolyvalent_Scallops.length ? subSegmentCount + 1 : subSegmentCount;
          subSegmentCount = this.offRegisterPolyvalent_Potting.length ? subSegmentCount + 1 : subSegmentCount;
          break;
        case FleetSegment.SPECIFIC:
          subSegmentCount = this.offRegisterSpecific_Scallops.length ? subSegmentCount + 1 : subSegmentCount;
          subSegmentCount = this.offRegisterSpecific_General.length ? subSegmentCount + 1 : subSegmentCount;
          break;
      }
    }

    return subSegmentCount >= 2;
  }

  public getFleetSegmentName(capacities: Array<CapacityView> = []): string {
    return capacities.length ? (capacities[0]).displayFleetSegment() : '';
  }

}
