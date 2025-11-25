import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const teacherGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Teacher guard checking...');
  console.log('Is authenticated:', authService.isAuthenticated());
  console.log('Token exists:', !!authService.getToken());
  
  if (!authService.isAuthenticated()) {
    console.log('Not authenticated, redirecting to login');
    router.navigate(['/professeur/connexion'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const user = authService.getUser();
  console.log('User:', user);
  console.log('User roles:', user?.roles);
  console.log('User roles type:', typeof user?.roles);
  console.log('User roles is array:', Array.isArray(user?.roles));
  
  if (user && user.roles) {
    // Gérer différents formats de rôles
    let rolesArray: string[] = [];
    
    if (Array.isArray(user.roles)) {
      rolesArray = user.roles;
    } else if (typeof user.roles === 'string') {
      
      try {
        const parsed = JSON.parse(user.roles);
        rolesArray = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        
        rolesArray = [user.roles];
      }
    } else {
      rolesArray = [String(user.roles)];
    }
    
    console.log('Roles array after processing:', rolesArray);
    const isTeacher = rolesArray.some(role => role === 'ROLE_TEACHER' || role.includes('ROLE_TEACHER'));
    console.log('Is teacher:', isTeacher);
    
    if (isTeacher) {
      console.log('User is a teacher, allowing access');
      return true;
    }
  }

  console.log('User is not a teacher, redirecting to login');
  console.log('Full user object:', JSON.stringify(user, null, 2));
  router.navigate(['/professeur/connexion'], { queryParams: { returnUrl: state.url } });
  return false;
};

