import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaApplicationCardComponent } from './la-application-card.component';

describe('LaApplicationCardComponent', () => {
  let component: LaApplicationCardComponent;
  let fixture: ComponentFixture<LaApplicationCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaApplicationCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaApplicationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
