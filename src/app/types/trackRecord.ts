
export enum TrackRecordType {
  NONE = 0,
  TIER_1_MACKERAL = 1,
  TIER_2_MACKERAL = 2,
  CS_HERRING = 3,
  NW_HERRING = 4,
  GENERAL = 5,
}

export class TrackRecord {

  public type: number = TrackRecordType['NONE']; // corresponds to TrackRecordType
  public quotaEligibility: boolean = false;

  constructor(trackRecord?: TrackRecord | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (trackRecord) {
      // copy constructor
      this.type = trackRecord.type;
      this.quotaEligibility = trackRecord.quotaEligibility;
    }
  }
}
export class TrackRecordView extends TrackRecord {

  constructor(trackRecord?: TrackRecord | any) {
    super(trackRecord);
  }

  public displayType(): string {
    // display the enum description replacing the _ with a space
    if (TrackRecordType[this.type]) {
      const s: string = TrackRecordType[this.type].replace(/_/g, ' ');
      const s2: string = this.toTitleCase(s).replace(/Cs/g, 'CS').replace(/Nw/g, 'NW');
      return s2;
    } else {
      return String(this.type);
    }
  }

  public toTitleCase(str: string): string {
    const splitStr: Array<string> = str.toLowerCase().split(' ');
    for (let i: number = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }
}

