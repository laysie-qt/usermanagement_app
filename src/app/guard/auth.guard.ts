import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getRole();
  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data['role'];

  if (requiredRole && requiredRole !== userRole) {
    router.navigate(['/login']);
    return false;
  } 

  return true;
};
