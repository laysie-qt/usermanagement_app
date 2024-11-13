import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UsersService } from '../../services/users.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-detail-modal',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-detail-modal.component.html',
  styleUrl: './user-detail-modal.component.scss'
})
export class UserDetailModalComponent implements OnInit {
  users: any = {};

  constructor(public userService: UsersService, public dialogRef: MatDialogRef<UserDetailModalComponent>,) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.userService.getListOfUsers(1, 2, 6).subscribe({
      next: (users) => {
        this.users = users.find((user: any) => user.email === JSON.parse(localStorage.getItem('currentUser') || '{}')?.email);
      },
      error: (error) => {
        console.error('Error fetching users: ', error);
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
