import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagmentAdmComponent } from './user-managment-adm.component';

describe('UserManagmentAdmComponent', () => {
  let component: UserManagmentAdmComponent;
  let fixture: ComponentFixture<UserManagmentAdmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserManagmentAdmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManagmentAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
