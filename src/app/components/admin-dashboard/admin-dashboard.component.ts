import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailModalComponent } from '../user-detail-modal/user-detail-modal.component';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  isLoading: boolean = true;
  firstName: string = '';

  constructor(private userService: UsersService,
    private authService: AuthService,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.firstName = (JSON.parse(localStorage.getItem('currentUser') || '').email).split('.')[0];
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
  }

  getAllUsers(): void {
    this.userService.getListOfUsers(1, 2, 6).subscribe({
      next: (users) => {
        console.log(users);
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching users: ', error);
        this.isLoading = false;
      }
    });
  }

  onDeleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user.id !== userId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error in deleting users: ', error);
        this.isLoading = false
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
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
