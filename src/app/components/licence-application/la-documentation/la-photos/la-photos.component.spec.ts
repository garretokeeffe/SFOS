import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaPhotosComponent } from './la-photos.component';

describe('LaPhotosComponent', () => {
  let component: LaPhotosComponent;
  let fixture: ComponentFixture<LaPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
