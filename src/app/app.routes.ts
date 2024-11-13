import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard], data: { role: 'super-admin' } },
    { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [authGuard], data: { role: 'user' }  },
    { path: '**', redirectTo: '/login' },
  ];
