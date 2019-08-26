import { DemoService } from './demo.service';

describe('DemoService', () => {
  let httpSpy: any;
  let service: DemoService;

  beforeEach(() => {
     service = new DemoService(
     httpSpy = jasmine.createSpyObj('httpSpy', ['']),
     );
  });

});
