import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityBlockComponent } from './capacity-block.component';

describe('CapacityBlockComponent', () => {
  let component: CapacityBlockComponent;
  let fixture: ComponentFixture<CapacityBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacityBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
