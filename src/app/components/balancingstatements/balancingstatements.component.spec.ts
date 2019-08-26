import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalancingstatementsComponent } from './balancingstatements.component';

describe('BalancingstatementsComponent', () => {
  let component: BalancingstatementsComponent;
  let fixture: ComponentFixture<BalancingstatementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalancingstatementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalancingstatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
