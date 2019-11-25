import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomsheetCloseIconComponent } from './bottomsheet-close-icon.component';

describe('BottomsheetCloseIconComponent', () => {
  let component: BottomsheetCloseIconComponent;
  let fixture: ComponentFixture<BottomsheetCloseIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomsheetCloseIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomsheetCloseIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
