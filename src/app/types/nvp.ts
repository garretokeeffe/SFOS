// Name Value Pair Type

export class NVP {
  public name: string = '';
  public value: string = '';
  public icon?: string = null;

  constructor(nvp?: NVP | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (nvp) {
      // copy constructor
      this.name = nvp.name;
      this.value = nvp.value;
      this.icon = nvp.icon;
    }
  }
}

