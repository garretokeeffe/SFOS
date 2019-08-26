import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaEngineComponent } from './la-engine.component';

describe('LaEngineComponent', () => {
  let component: LaEngineComponent;
  let fixture: ComponentFixture<LaEngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaEngineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
