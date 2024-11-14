import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardComponent } from './user-dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ResourcesService } from '../../services/resources.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { UpdateResourceModalComponent } from '../update-resource-modal/update-resource-modal.component';
import { UserDetailModalComponent } from '../user-detail-modal/user-detail-modal.component';

class MockResourcesService {
  getListOfResources() {
    return of([{ id: 1, name: 'Yellow' }]);
  }

  deleteResources(id: number) {
    return of({});
  }
}

class MockAuthService {
  logout() { }
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of({})
    };
  }
}

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;
  let resourcesService: ResourcesService;
  let authService: AuthService;
  let dialog: MatDialog;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDashboardComponent, HttpClientTestingModule, UpdateResourceModalComponent, UserDetailModalComponent],
      providers: [
        { provide: ResourcesService, useClass: MockResourcesService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: ChangeDetectorRef, useValue: { detectChanges: jasmine.createSpy() } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load resources on ngOnInit', () => {
    spyOn(component, 'getAllfResources').and.callThrough();

    component.ngOnInit();

    expect(component.getAllfResources).toHaveBeenCalled();
    expect(component.resources.length).toBe(1);
    expect(component.resources[0].name).toBe('Yellow');
  });
});
