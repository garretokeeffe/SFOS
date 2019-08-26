import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSfpaComponent } from './home-sfpa.component';

describe('HomeSfpaComponent', () => {
  let component: HomeSfpaComponent;
  let fixture: ComponentFixture<HomeSfpaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSfpaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSfpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
