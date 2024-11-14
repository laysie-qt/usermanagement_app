import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ResourcesService } from '../../services/resources.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateResourceModalComponent } from '../update-resource-modal/update-resource-modal.component';
import { UserDetailModalComponent } from '../user-detail-modal/user-detail-modal.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  resources: any[] = [];
  isLoading: boolean = true;
  firstName: string = '';

  constructor(private resourceService: ResourcesService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef) { }


  ngOnInit(): void {
    this.getAllfResources();
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const parsedUser = JSON.parse(currentUser);
        if (parsedUser?.email) {
          this.firstName = parsedUser.email.split('.')[0];
          this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
        }
      } catch (error) {
        console.error('Error parsing currentUser from localStorage', error);
      }
    }
  }

  getAllfResources(): void {
    this.resourceService.getListOfResources(1, 2, 6).subscribe({
      next: (resources) => {
        this.resources = resources;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching resources: ', error);
        this.isLoading = false;
      },
    });
  }

  onDeleteResource(resourceId: number): void {
    this.resourceService.deleteResources(resourceId).subscribe({
      next: () => {
        this.resources = this.resources.filter((response) => response.id !== resourceId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error on deleting resources: ', error);
        this.isLoading = false;
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  openResourceModal(resource: any): void {
    const dialogRef = this.dialog.open(UpdateResourceModalComponent, {
      width: '460px',
      data: resource,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(updatedResource => {
      if (updatedResource) {
        const index = this.resources.findIndex(r => r.id === updatedResource.id);
        if (index !== -1) {
          this.resources = [
            ...this.resources.slice(0, index),
            updatedResource,
            ...this.resources.slice(index + 1)
          ];
          this.cdr.detectChanges();
        }
      }
    });
  }

  openProfileModal(): void {
    const dialogRef = this.dialog.open(UserDetailModalComponent, {
      width: '460px',
      disableClose: true,
      autoFocus: false
    });
    dialogRef.afterClosed();
  }
}
