import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEmployeeComponent } from './profile-employee.component';

describe('ProfileEmployeeComponent', () => {
  let component: ProfileEmployeeComponent;
  let fixture: ComponentFixture<ProfileEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
