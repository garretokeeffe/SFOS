import { OrderBy } from "./orderBy.pipe";
import { SpeciesClassification } from "../types/speciesClassification";
 
describe('Pipe: OrderBy', () => {
    let pipe: OrderBy;
    let list: Array<SpeciesClassification> = [];
    let listAux: Array<SpeciesClassification> = [];
 
    beforeEach(() => {
        pipe = new OrderBy();
        list.push(new SpeciesClassification("test1",1,"tuna"));
        list.push(new SpeciesClassification("test2",2,"cod"));
        list.push(new SpeciesClassification("test3",3,"mackarel"));
        list.push(new SpeciesClassification("test1",4,"salmon"));
        list.push(new SpeciesClassification("test1",5,"haddock"));

        listAux.push(new SpeciesClassification("test2",2,"cod"));
        listAux.push(new SpeciesClassification("test1",5,"haddock"));
        listAux.push(new SpeciesClassification("test3",3,"mackarel"));
        listAux.push(new SpeciesClassification("test1",4,"salmon"));
        listAux.push(new SpeciesClassification("test1",1,"tuna"));       
    });
 
    it('should order list values by text', () => {
        let result = pipe.transform(list, ["text"]);
 
        expect(result).toEqual(listAux);
    });
});