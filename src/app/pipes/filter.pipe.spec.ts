import { Filter } from './filter.pipe';

export class SpeciesClassification {
  public code: string;
  public id: number;
  public text: string;

  constructor(code: string, id: number, text: string) {
    this.code = code;
    this.id = id;
    this.text = text;
  }
}

describe('Pipe: Filter', () => {
  let pipe: Filter;
  const list: Array<SpeciesClassification> = [];
  const expectedResults1: Array<SpeciesClassification> = [];
  const expectedResults2: Array<SpeciesClassification> = [];

  beforeEach(() => {
    pipe = new Filter();
    list.push(new SpeciesClassification('test1', 1, 'tuna'));
    list.push(new SpeciesClassification('test2', 2, 'sea'));
    list.push(new SpeciesClassification('test3', 3, 'mackarel'));
    list.push(new SpeciesClassification('test1', 4, 'salmon'));
    list.push(new SpeciesClassification('test1', 5, 'haddock'));

    expectedResults1.push(new SpeciesClassification('test1', 1, 'tuna'));
    expectedResults1.push(new SpeciesClassification('test1', 4, 'salmon'));
    expectedResults1.push(new SpeciesClassification('test1', 5, 'haddock'));

    expectedResults2.push(new SpeciesClassification('test2', 2, 'sea'));
    expectedResults2.push(new SpeciesClassification('test1', 4, 'salmon'));
  });

  it('should filter list values by attribute 2 levels', () => {
    const result: Array<SpeciesClassification> = pipe.transform(list, 'code', 'test1', false);
    expect(result).toEqual(expectedResults1);
  });

  it('should filter list values by attribute and start with', () => {
    const result: Array<SpeciesClassification> = pipe.transform(list, 'text', 's', true);
    expect(result).toEqual(expectedResults2);
  });
});
