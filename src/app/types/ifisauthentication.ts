export enum UserGroup {
  NONE = -1,
  DEMO = 0,
  FISHERMAN = 1,
  REPRESENTATIVE = 2,
  LA = 3,
  LA2 = 4,
  SFPA = 5,
  SFPMD = 6,
  FISH_BUYER = 7
}

export class IFISAuthentication {

  // roles
  public readAccess: boolean = false;
  public writeAccess: boolean = false;
  public externalAccess: boolean = false;
  public internalAccess: boolean = false;
  public userGroup: number = UserGroup['NONE'];

  public systemDown: boolean = false;

                            // internal user groups...
  private roles: string[];  //    sfos_vessel_owner | sfos_vessel_owner_ro | sfos_representative | sfos_representative_ro | sfos_sfpa | sfos_sfpa_ro | sfos_sfpmd | sfos_sfpmd_ro
                            // external user groups
                            //    sfos_la | sfos_la_ro | sfos_la2 | sfos_la2_ro | sfos_fish_buyer | sfos_fish_buyer_ro

  constructor(roles: string[] = []) {
    this.setAuthentication(roles);
  }

  public setAuthentication(roles: string[] = []): void {
    this.roles = roles;

    // reset roles
    this.writeAccess = false;
    this.readAccess = false;
    this.externalAccess = false;
    this.internalAccess = false;
    this.userGroup = UserGroup['NONE'];

    this.roles.forEach((role) => {
      if (role === 'sfos_vessel_owner') {
        this.readAccess = true;
        this.writeAccess = true;
        this.externalAccess = true;
        this.userGroup = UserGroup['FISHERMAN'];
      }
      if (role === 'sfos_vessel_owner_ro') {
        this.readAccess = true;
        this.externalAccess = true;
        this.userGroup = UserGroup['FISHERMAN'];
      }
      if (role === 'sfos_representative') {
        this.readAccess = true;
        this.writeAccess = true;
        this.externalAccess = true;
        this.userGroup = UserGroup['REPRESENTATIVE'];
      }
      if (role === 'sfos_representative_ro') {
        this.readAccess = true;
        this.externalAccess = true;
        this.userGroup = UserGroup['REPRESENTATIVE'];
      }
      if (role === 'sfos_la') {
        this.readAccess = true;
        this.writeAccess = true;
        this.internalAccess = true;
        this.userGroup = UserGroup['LA'];
      }
      if (role === 'sfos_la_ro') {
        this.readAccess = true;
        this.internalAccess = true;
        this.userGroup = UserGroup['LA'];
      }
      if (role === 'sfos_la2') {
        this.readAccess = true;
        this.writeAccess = true;
        this.internalAccess = true;
        this.userGroup = UserGroup['LA2'];
      }
      if (role === 'sfos_la2_ro') {
        this.readAccess = true;
        this.internalAccess = true;
        this.userGroup = UserGroup['LA2'];
      }
      if (role === 'sfos_fish_buyer') {
        this.readAccess = true;
        this.writeAccess = true;
        this.internalAccess = true;
        this.userGroup = UserGroup['FISH_BUYER'];
      }
      if (role === 'sfos_fish_buyer_ro') {
        this.readAccess = true;
        this.internalAccess = true;
        this.userGroup = UserGroup['FISH_BUYER_RO'];
      }
      if (role === 'sfos_sfpa') {
        this.readAccess = true;
        this.writeAccess = true;
        this.internalAccess = true;
        this.userGroup = UserGroup['SFPA'];
      }
      if (role === 'sfos_sfpa_ro') {
        this.readAccess = true;
        this.internalAccess = true;
        this.userGroup = UserGroup['SFPA'];
      }
      if (role === 'sfos_sfpmd') {
        this.readAccess = true;
        this.writeAccess = true;
        this.internalAccess = true;
        this.userGroup = UserGroup['SFPMD'];
      }
      if (role === 'sfos_sfpmd_ro') {
        this.readAccess = true;
        this.internalAccess = true;
        this.userGroup = UserGroup['SFPMD'];
      }
    });
  }

  public set authenticated(value: boolean) { }
  public get authenticated(): boolean {
    return this.userGroup !== UserGroup['NONE'];
  }

  public getRoles(): string[] {
    return this.roles;
  }
}
