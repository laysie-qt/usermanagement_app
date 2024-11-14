import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailModalComponent } from './user-detail-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../shared/shared.module';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { UsersService } from '../../services/users.service';

class MockUsersService {
  getListOfUsers() {
    // Mocked successful response
    return of([
      { email: 'test.user@example.com', name: 'Test User' },
      { email: 'another.user@example.com', name: 'Another User' },
    ]);
  }
}

// Mock MatDialogRef
class MockMatDialogRef {
  close = jasmine.createSpy('close'); // Mock close method
}

describe('UserDetailModalComponent', () => {
  let component: UserDetailModalComponent;
  let fixture: ComponentFixture<UserDetailModalComponent>;
  let usersService: MockUsersService;
  let matDialogRefSpy: MockMatDialogRef;

  beforeEach(async () => {
    matDialogRefSpy = new MockMatDialogRef();
    usersService = new MockUsersService();

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ email: 'test.user@example.com' }));

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, UserDetailModalComponent],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: MatDialogRef, useValue: matDialogRefSpy },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and assign user details successfully', () => {
    component.getUserDetails(); 

    expect(component.users.email).toBe('test.user@example.com');
    expect(component.users.name).toBe('Test User');
  });

  it('should handle error in fetching user details', () => {
    usersService.getListOfUsers = jasmine.createSpy().and.returnValue(throwError('Error fetching users'));
    spyOn(console, 'error'); 

    component.getUserDetails(); 
    expect(console.error).toHaveBeenCalledWith('Error fetching users: ', 'Error fetching users');
  });

  it('should close the dialog', () => {
    component.close(); 
    expect(matDialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
