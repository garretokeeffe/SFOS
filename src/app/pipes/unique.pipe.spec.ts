import { Unique } from './unique.pipe';

describe('Pipe: Unique', () => {
    let pipe: Unique;
    let list: Array<any>;
    let listAux: Array<any>;

    beforeEach(() => {
        pipe = new Unique();
        list = [];
        listAux = [];
    });
 
    it('should filter out duplicate values', () => {
        list.push("hello");
        list.push("test");
        list.push("example");
        list.push("hello");
        list.push("test");

        listAux.push("hello");
        listAux.push("test");
        listAux.push("example");

        var result = pipe.transform(list, null);
        expect(result).toEqual(listAux);
    });

    it('should filter out duplicate values for the provided key', () => {
        list.push({"name": "hello", "order": 3});
        list.push({"name": "hello", "order": 4});
        list.push({"name": "example", "order": 1});

        listAux.push({"name": "hello", "order": 3});
        listAux.push({"name": "example", "order": 1});

        var result = pipe.transform(list, "name");
        expect(result).toEqual(listAux);
    });

    it('should filter out duplicate values for the 2 keys provided', () => {
        list.push({"name": "hello", "order": 3, "code": "AX"});
        list.push({"name": "hello", "order": 4, "code": "BT"});
        list.push({"name": "example", "order": 1, "code": "BT"});
        list.push({"name": "test", "order": 2, "code": "AX"});
        list.push({"name": "etc", "order": 2, "code": "BT"});

        listAux.push({"name": "hello", "order": 3, "code": "AX"});
        listAux.push({"name": "example", "order": 1, "code": "BT"});

        var result = pipe.transform(list, ["name", "code"]);
        expect(result).toEqual(listAux);
    });

    it('should filter out duplicate values for the 3 keys provided', () => {
        list.push({"name": "hello", "order": 3, "code": "AX"});
        list.push({"name": "what", "order": 2, "code": "BT"});
        list.push({"name": "example", "order": 1, "code": "CZ"});
        list.push({"name": "test", "order": 2, "code": "FV"});
        list.push({"name": "etc", "order": 4, "code": "BT"});
        list.push({"name": "hello", "order": 5, "code": "DW"});

        listAux.push({"name": "hello", "order": 3, "code": "AX"});
        listAux.push({"name": "what", "order": 2, "code": "BT"});
        listAux.push({"name": "example", "order": 1, "code": "CZ"});

        var result = pipe.transform(list, ["name", "code", "order"]);
        expect(result).toEqual(listAux);
    });
});