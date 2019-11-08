import {PenaltyPoints} from './points';
import {VesselOwner, VesselOwnerView} from './vessel-owner';
import {Gear, GearView} from './gear';
import {Licence, LicenceView} from './licence';

export enum VesselStatus {
  UNKNOWN = 0,
  PENDING_REGISTRATION = 1811006,
  REGISTERED = 1811007,
  PENDING_DEREGISTRATION = 1811008,
  DEREGISTERED = 1811009,
}

export class VesselSummary {
  public id: number = null;
  public name: string = '';
  public status: number = null; // corresponds to VESSEL_STATUS enum

  // Identifiers
  public cfr: string = '';
  public prn: string = ''; // port reg number

  // Capacity
  public gt: number = null; // Dimensions - tonnage
  public kw: number = null; // Propulsion - engine power

  constructor(vessel?: Vessel | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (vessel) {
      // copy constructor

      this.id = vessel.id;
      this.name = vessel.name ? vessel.name : '';
      this.status = vessel.status ? vessel.status : '';

      // Identifiers
      this.cfr = vessel.cfr ? vessel.cfr : '';
      this.prn = vessel.prn ? vessel.prn : '';

      // Capacity
      this.gt = vessel.gt;
      this.kw = vessel.kw;
    }
  }
}

// TODO: extend Vessel from VesselSummary and move out common attributes
export class Vessel {

  public id: number = null;
  public name: string = '';
  public status: number = null; // corresponds to VESSEL_STATUS enum
  public safetyCertificateExpiryDate: string = '';

  // Identifiers
  public cfr: string = '';
  public prn: string = ''; // port reg number
  public ircs: string = ''; // international radio call sign
  public uvi: string = ''; // IMO1234567 - uvi is the internal term for the IMO No.
  public mmsi: string = '';

  // Systems
  public vms: boolean = null;
  public ers: boolean = null;
  public ais: boolean = null;

  // Licence
  // public licence: Licence | LicenceView = new LicenceView();
  public licence: LicenceView = new LicenceView();

  // Owners
  public owners: Array<VesselOwner | VesselOwnerView> = [];

  // Gear
  public gear: Array<Gear | GearView> = [];

  // Capacity
  public gt: number = null; // Dimensions - tonnage
  public kw: number = null; // Propulsion - engine power

  // Dimensions
  public loa: number = null; // length overall
  public registeredLength: number = null;
  public draught: number = null; // depth
  public maximumDraught: number = null; // depth
  public lengthBetweenPerpendiculars: number = null;
  public boa: number = null; // breadth overall (beam)

  // Propulsion
  public propulsionType: string = '';
  public engineMake: string = '';
  public engineModel: string = '';
  public allOtherEnginePower: number = null; // kW

  // Provenance
  public vesselType: string = '';
  public constructionDate: string = '';
  public countryOfConstruction: string = '';
  public firstCountryOfRegistration: string = ''; // *** MOD - Add to UI ***
  public firstSafetyCertificateDate: string = ''; // *** MOD - Need to change position on screen ***
  public countryExportedTo: string = '';
  public countryImportedFrom: string = '';
  public currentNationality: string = '';
  public homePort: string = '';
  public firstRegisteredInIrelandDate: string = '';
  public irishRegistrationPort: string = '';
  public constructionMaterial: string = '';
  public maximumCrew: number = null;

  // Images
  public images: Array<string> = []; // Prototype Attribute

  // Penalty Points
  public penaltyPoints: Array<PenaltyPoints> = []; // Prototype Attribute

  constructor(vessel?: Vessel | VesselView | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (vessel) {
      // copy constructor

      this.id = vessel.id;
      this.name = vessel.name ? vessel.name : '';
      this.status = vessel.status ? vessel.status : '';
      this.safetyCertificateExpiryDate = vessel.safetyCertificateExpiryDate ? vessel.safetyCertificateExpiryDate : '';

      // Identifiers
      this.cfr = vessel.cfr  ? vessel.cfr : '';
      this.prn = vessel.prn ? vessel.prn : '';
      this.ircs = vessel.ircs ? vessel.ircs : '';
      this.uvi = vessel.uvi ? vessel.uvi : '';
      this.mmsi = vessel.mmsi ? vessel.mmsi : '';

      // Systems
      this.vms = vessel.vms;
      this.ers = vessel.ers;
      this.ais = vessel.ais;

      // Licence
      this.licence = vessel.licence ? new LicenceView(vessel.licence) : new LicenceView();

      // Owners
      this.owners = vessel.owners ? vessel.owners : []; // Reference Copy

      // Gear
      this.gear = vessel.gear ? vessel.gear : []; // Reference Copy

      // Capacity
      this.gt = vessel.gt;
      this.kw = vessel.kw;
      this.penaltyPoints = vessel.penaltyPoints ? vessel.penaltyPoints : []; // reference copy

      // Dimensions
      this.loa = vessel.loa ? vessel.loa : null;
      this.registeredLength = vessel.registeredLength ? vessel.registeredLength : null;
      this.draught = vessel.draught ? vessel.draught : null;
      this.maximumDraught = vessel.maximumDraught ? vessel.maximumDraught : null;
      this.lengthBetweenPerpendiculars = vessel.lengthBetweenPerpendiculars ? vessel.lengthBetweenPerpendiculars : null;
      this.boa = vessel.boa ? vessel.boa : null;

      // Propulsion
      this.engineMake = vessel.engineMake ? vessel.engineMake : '';
      this.engineModel = vessel.engineModel ? vessel.engineModel : '';
      this.propulsionType = vessel.propulsionType ? vessel.propulsionType : '';
      this.allOtherEnginePower = vessel.allOtherEnginePower >= 0 ? vessel.allOtherEnginePower : null;

      // Provenance
      this.vesselType = vessel.vesselType ? vessel.vesselType : '';
      this.constructionDate = vessel.constructionDate ? vessel.constructionDate : '';
      this.countryOfConstruction = vessel.countryOfConstruction ? vessel.countryOfConstruction : '';
      this.firstCountryOfRegistration = vessel.firstCountryOfRegistration ? vessel.firstCountryOfRegistration : '';
      this.firstSafetyCertificateDate = vessel.firstSafetyCertificateDate ? vessel.firstSafetyCertificateDate : '';
      this.countryExportedTo = vessel.countryExportedTo ? vessel.countryExportedTo : '';
      this.countryImportedFrom = vessel.countryImportedFrom ? vessel.countryImportedFrom : '';
      this.currentNationality = vessel.currentNationality ? vessel.currentNationality : '';
      this.homePort = vessel.homePort ? vessel.homePort : '';
      this.firstRegisteredInIrelandDate = vessel.firstRegisteredInIrelandDate ? vessel.firstRegisteredInIrelandDate : '';
      this.irishRegistrationPort = vessel.irishRegistrationPort ? vessel.irishRegistrationPort : '';
      this.constructionMaterial = vessel.constructionMaterial ? vessel.constructionMaterial : '';
      this.maximumCrew = vessel.maximumCrew ? vessel.maximumCrew : null;

      // Images
      this.images = vessel.images ? vessel.images : []; // reference copy

      // Penalty Points
      this.penaltyPoints = vessel.penaltyPoints ? vessel.penaltyPoints : []; // reference copy
    }
  }
}

export class VesselView extends Vessel {
  constructor(vessel?: Vessel | VesselView | any) { // DMcD 'any' only supported for unit testing
    super(vessel);

    const owners: Array<VesselOwnerView> = [];
    this.owners.forEach((owner) => {
      owners.push(new VesselOwnerView(owner));
    });
    this.owners = owners;

    const gear: Array<GearView> = [];
    this.gear.forEach((gearItem) => {
      gear.push(new GearView(gearItem));
    });
    this.gear = gear;
  }

  public isRegistered(): boolean {
    return this.status === VesselStatus['REGISTERED'];
  }
}
