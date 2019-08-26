import { NotificationView } from './notification';

export enum ApplicationID {
  LICENSING = 1,
  AUTHORISATIONS = 2,
  LOGSHEETS = 3
}

export class Application {
  public name: string;
  public id: number; // corresponding to ApplicationID
  public description: string;

  constructor(application?: Application | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (application) {
      // copy constructor
      this.name = application.name;
      this.id = application.id;
      this.description = application.description;
    }
  }
}

export class ApplicationView extends Application {
  constructor(application?: Application | ApplicationView | any) { // DMcD 'any' only supported for unit testing
    super(application);
  }
}
