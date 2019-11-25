// FleetSegment is an agreed value (identifier) derived by the MW and returned to the UI
export enum FleetSegment {
  NONE = 0,
  POLYVALENT = 1,
  RSW_PELAGIC = 2,
  SPECIFIC = 3,
  AQUACULTURE = 4,
  BEAM_TRAWLER = 5,
}
// FleetSubSegment is an IFIS system defined value
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
  BEAM_TRAWLER = 500,
}

/*
export class CombinedFleetSegment {
  public fleetSegment: number = FleetSegment.NONE;
  public fleetSubSegment: number = FleetSubSegment.NONE;
}
*/

export class FleetSegmentManager  {

  constructor() { }

  public static displayFleetSegment(fleetSegment: number): string {
    // display the enum description replacing the _ with a space
    if (FleetSegment[fleetSegment]) {
      let s: string = FleetSegment[fleetSegment].replace(/_/g, ' ');
      return s; // s.toLowerCase();
    } else {
      return String(fleetSegment);
    }
  }
  public static displayFleetSubSegment(fleetSubSegment: number): string {
    // display the enum description replacing the _ with a space and LT and GTE with symbols
    if (FleetSubSegment[fleetSubSegment]) {
      let s: string = FleetSubSegment[fleetSubSegment].replace(/_/g, ' ');
      s = s.replace(/ LT /g, ' < ');
      s = s.replace(/ GTE /g, ' >= ');
      return s; // s.toLowerCase();
    } else {
      return String(fleetSubSegment);
    }
  }
  public static displayFleetSubSegmentHint(fleetSubSegment: number): string {
    // display text in lieu of >= and < symbols for segments with specific LOAs

    fleetSubSegment = Number(fleetSubSegment); // the value may have come directly from a list control, in which case it will be a string

    if (fleetSubSegment === FleetSubSegment['POLYVALENT_LT_18M_LOA']) {
      return 'POLYVALENT LESS THAN 18M LOA';
    } else if (fleetSubSegment === FleetSubSegment['POLYVALENT_GTE_18M_LOA']) {
      return 'POLYVALENT 18M OR LONGER LOA';
    } else if (fleetSubSegment === FleetSubSegment['POLYVALENT_SCALLOPS_GTE_10M_LOA']) {
      return 'POLYVALENT SCALLOPS 18M OR LONGER LOA';
    } else if (fleetSubSegment === FleetSubSegment['SPECIFIC_SCALLOPS_GTE_10M_LOA']) {
      return 'SPECIFIC SCALLOPS 10M OR LONGER LOA';
    } else {
      // ignore the other segments
      return '';
    }
  }
  public static displayCombinedFleetSegment(fleetSegment: number, fleetSubSegment: number): string {
    const combinedFleetSegment: number = this.getCombinedFleetSegment(fleetSegment, fleetSubSegment);

    // display the enum description replacing the _ with a space and LT and GTE with symbols
    if (FleetSegmentView[combinedFleetSegment]) {
      let s: string = FleetSegmentView[combinedFleetSegment].replace(/_/g, ' ');
      s = s.replace(/ LT /g, ' < ');
      s = s.replace(/ GTE /g, ' >= ');
      return s; // s.toLowerCase();
    } else {
      return 'Fleet Segment: ' + String(fleetSegment) + ' Subsegment: ' + String(fleetSubSegment);
    }
  }
  private static getCombinedFleetSegment(fleetSegment: number, fleetSubSegment: number): number {
    switch (fleetSegment) {
      case FleetSegment.POLYVALENT:
        switch (fleetSubSegment) {
          case FleetSubSegment.POLYVALENT_LT_18M_LOA:
            return FleetSegmentView.POLYVALENT_LT_18M_LOA;
          case  FleetSubSegment.POLYVALENT_GTE_18M_LOA:
            return FleetSegmentView.POLYVALENT_GTE_18M_LOA;
          case  FleetSubSegment.POLYVALENT_SCALLOPS_GTE_10M_LOA:
            return FleetSegmentView.POLYVALENT_SCALLOPS_GTE_10M_LOA;
          case  FleetSubSegment.POLYVALENT_POTTING:
            return FleetSegmentView.POLYVALENT_POTTING;
          default:
            return FleetSegmentView.POLYVALENT; // shouldn't be here
        }
      case FleetSegment.SPECIFIC:
        switch (fleetSubSegment) {
          case FleetSubSegment.SPECIFIC_SCALLOPS_GTE_10M_LOA:
            return FleetSegmentView.SPECIFIC_SCALLOPS_GTE_10M_LOA;
          case  FleetSubSegment.SPECIFIC_GENERAL:
            return FleetSegmentView.SPECIFIC_GENERAL;
          default:
            return FleetSegmentView.SPECIFIC; // shouldn't be here
        }
      case FleetSegment.RSW_PELAGIC:
        return FleetSegmentView.RSW_PELAGIC;
      case FleetSegment.AQUACULTURE:
        return FleetSegmentView.AQUACULTURE;
      case FleetSegment.BEAM_TRAWLER:
        return FleetSegmentView.BEAM_TRAWLER;
      default:
        return FleetSegmentView.NONE;
    }
  }
}
