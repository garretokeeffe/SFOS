import { Filter } from "./filter.pipe";
import { SpeciesClassification } from "../types/speciesClassification";
import { QuotaRow } from "../types/quotaRow";
import { Quota } from "../types/quota";

describe('Pipe: Filter', () => {
  let pipe: Filter;
  let list: Array<SpeciesClassification> = [];
  let listAux: Array<SpeciesClassification> = [];
  let list2Levels: Array<QuotaRow> = [];
  let list2LevelsAux: Array<QuotaRow> = [];
  let quota1: Quota = new Quota();
  let quota2: Quota = new Quota();
  let quota3: Quota = new Quota();
  let list2Aux: Array<SpeciesClassification> = [];

  beforeEach(() => {
    pipe = new Filter();
    list.push(new SpeciesClassification("test1",1,"tuna"));
    list.push(new SpeciesClassification("test2",2,"sea"));
    list.push(new SpeciesClassification("test3",3,"mackarel"));
    list.push(new SpeciesClassification("test1",4,"salmon"));
    list.push(new SpeciesClassification("test1",5,"haddock"));

    listAux.push(new SpeciesClassification("test1",1,"tuna"));
    listAux.push(new SpeciesClassification("test1",4,"salmon"));
    listAux.push(new SpeciesClassification("test1",5,"haddock"));

    quota1.name = "quota1";
    quota2.name = "quota2";
    quota3.name = "quota1";

    list2Levels.push(new QuotaRow(quota1, "ABC", false));
    list2Levels.push(new QuotaRow(quota2, "ABC", false));
    list2Levels.push(new QuotaRow(quota3, "ABC", false));

    list2LevelsAux.push(new QuotaRow(quota1, "ABC", false));
    list2LevelsAux.push(new QuotaRow(quota3, "ABC", false));


    list2Aux.push(new SpeciesClassification("test2",2,"sea"));
    list2Aux.push(new SpeciesClassification("test1",4,"salmon"));
  });

  it('should filter list values by attribute', () => {
    var result = pipe.transform(list2Levels, "quota.name", "quota1", false);
    expect(result).toEqual(list2LevelsAux);
  });

  it('should filter list values by attribute 2 levels', () => {
    var result = pipe.transform(list, "code", "test1", false);
    expect(result).toEqual(listAux);
  });

  it('should filter list values by attribute and start with', () => {
    var result = pipe.transform(list, "text", "s", true);
    expect(result).toEqual(list2Aux);
  });
});
