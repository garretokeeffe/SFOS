import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PwaTestComponent } from './pwa-test.component';

describe('PwaTestComponent', () => {
  let component: PwaTestComponent;
  let fixture: ComponentFixture<PwaTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PwaTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwaTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
