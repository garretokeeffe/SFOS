export class Gear {
  public code: string = '';
  public description: string = '';

  constructor(gear?: Gear | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (gear) {
      // copy constructor
      this.code = gear.code;
      this.description = gear.description;
    }
  }
}

export class GearView extends Gear {
  constructor(gear?: Gear | GearView | any) { // DMcD 'any' only supported for unit testing
    super(gear);
  }
}
