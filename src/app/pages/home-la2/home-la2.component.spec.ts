import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLa2Component } from './home-la2.component';

describe('HomeLa2Component', () => {
  let component: HomeLa2Component;
  let fixture: ComponentFixture<HomeLa2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLa2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLa2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
