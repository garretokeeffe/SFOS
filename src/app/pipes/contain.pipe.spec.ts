import { Contain } from "./contain.pipe";
import { SpeciesClassification } from "../types/speciesClassification";
 
describe('Pipe: Contain', () => {
    let pipe: Contain;
    let list: Array<SpeciesClassification> = [];
    let listTest: Array<string> = [];
    let speciesClassification = new SpeciesClassification("test1",1,"tuna");
 
    beforeEach(() => {
        pipe = new Contain();
        list.push(speciesClassification);
        list.push(new SpeciesClassification("test2",2,"cod"));
        list.push(new SpeciesClassification("test3",3,"mackarel"));
        list.push(new SpeciesClassification("xyz1",4,"salmon"));
        list.push(new SpeciesClassification("xyz2",5,"haddock"));
        listTest.push("xyz2","xyz3");
    });
 
    it('should check if Array contains a value', () => {
        var result = pipe.transform(list, speciesClassification, null, false);
        expect(result).toBeTruthy();
    });

    it('should check if Array contains a object by attribute', () => {
        var result = pipe.transform(list, "test2", "code", false);
        expect(result).toBeTruthy();
    });

    it('should check if Array contains a object by attribute starting with', () => {
        var result = pipe.transform(list, "test", "code", true);
        expect(result).toBeTruthy();
    });

    it('should check if Array contains a object from other Array by attribute', () => {
        var result = pipe.transform(list, listTest, "code", false);
        expect(result).toBeTruthy();
    });

});