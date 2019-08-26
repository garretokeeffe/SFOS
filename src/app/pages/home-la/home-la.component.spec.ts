import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLaComponent } from './home-la.component';

describe('HomeLaComponent', () => {
  let component: HomeLaComponent;
  let fixture: ComponentFixture<HomeLaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
