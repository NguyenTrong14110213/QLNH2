import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueManagementComponent } from './revenue-management.component';

describe('RevenueManagementComponent', () => {
  let component: RevenueManagementComponent;
  let fixture: ComponentFixture<RevenueManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
