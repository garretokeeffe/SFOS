import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsheetsComponent } from './logsheets.component';

describe('LogsheetsComponent', () => {
  let component: LogsheetsComponent;
  let fixture: ComponentFixture<LogsheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogsheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
