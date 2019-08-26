import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFishBuyerComponent } from './home-fish-buyer.component';

describe('HomeFishBuyerComponent', () => {
  let component: HomeFishBuyerComponent;
  let fixture: ComponentFixture<HomeFishBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeFishBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFishBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
