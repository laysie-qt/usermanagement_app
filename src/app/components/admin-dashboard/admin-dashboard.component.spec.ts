import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserDetailModalComponent } from '../user-detail-modal/user-detail-modal.component';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  const mockUsers = [
    { id: 1, name: 'Eve Holt', email: 'eve.holt@reqres.in' },
    { id: 2, name: 'Charles Morris', email: 'charles.morris@reqres.in' }
  ];

  beforeEach(async () => {
    usersServiceSpy = jasmine.createSpyObj('UsersService', ['getListOfUsers', 'deleteUser']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    usersServiceSpy.getListOfUsers.and.returnValue(of(mockUsers));
    usersServiceSpy.deleteUser.and.returnValue(of({}));
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]  // Ignore unknown elements like <app-user-detail-modal>
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set firstName correctly from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('eve.holt@reqres.in');

    component.ngOnInit();
    expect(component.firstName).toBe('');
  });

  it('should call getAllUsers and set users correctly', () => {
    component.getAllUsers();
    expect(usersServiceSpy.getListOfUsers).toHaveBeenCalledWith(1, 2, 6);
    expect(component.users).toEqual(mockUsers);
    expect(component.isLoading).toBeFalse();
  });

  it('should call onDeleteUser and update users list', () => {
    component.users = mockUsers;
    component.onDeleteUser(1);

    expect(usersServiceSpy.deleteUser).toHaveBeenCalledWith(1);
    expect(component.users.length).toBe(1);
  });

  it('should handle error when deleting a user', () => {
    usersServiceSpy.deleteUser.and.returnValue(throwError('Error deleting user'));
    component.onDeleteUser(1);

    expect(component.isLoading).toBeFalse();
    expect(component.users.length).toBe(2); 
  });

  it('should call onLogout and trigger logout', () => {
    component.onLogout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

});
