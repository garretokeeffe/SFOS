export enum DocumentationRequiredCategory {
  GENERAL = 0,
  PHOTOGRAPHS = 1,
  PERSONAL = 2,
  VESSEL = 3,
  CAPACITY = 4,
}

export class DocumentationRequired {
  public url: string = '';
  public title: string = '';
  public category: number = DocumentationRequiredCategory.GENERAL; // corresponds to DocumentationRequiredCategory enum
  public letterOfOfferTermId: number = null; // join to condition in letter of offer

  constructor(documentationRequired?: DocumentationRequired | any) { // DMcD: added any option to permit unit testing with incomplete mock data
    if (documentationRequired) {
      // copy constructor
      this.url = documentationRequired.url ? documentationRequired.url : '';
      this.title = documentationRequired.title;
      this.category = documentationRequired.category;
      this.letterOfOfferTermId = documentationRequired.letterOfOfferTermId ? documentationRequired.letterOfOfferTermId : null;
    }
  }
}
