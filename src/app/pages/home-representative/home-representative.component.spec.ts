import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRepresentativeComponent } from './home-representative.component';

describe('HomeRepresentativeComponent', () => {
  let component: HomeRepresentativeComponent;
  let fixture: ComponentFixture<HomeRepresentativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeRepresentativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeRepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
