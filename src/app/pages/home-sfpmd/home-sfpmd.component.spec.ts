import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSfpmdComponent } from './home-sfpmd.component';

describe('HomeSfpmdComponent', () => {
  let component: HomeSfpmdComponent;
  let fixture: ComponentFixture<HomeSfpmdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSfpmdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSfpmdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
