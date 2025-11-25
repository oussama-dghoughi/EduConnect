import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { teacherGuard } from './guards/teacher.guard';

export const routes: Routes = [
  // Routes publiques
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'professeurs',
    loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent)
  },
  {
    path: 'professeur/connexion',
    loadComponent: () => import('./pages/teacher-login/teacher-login.component').then(m => m.TeacherLoginComponent)
  },
  {
    path: 'professeur/inscription',
    loadComponent: () => import('./pages/teacher-register/teacher-register.component').then(m => m.TeacherRegisterComponent)
  },
  {
    path: 'favoris',
    loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent)
  },
  {
    path: 'a-propos',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'connexion',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'inscription',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  
  // Back Office (Admin)
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'professeurs',
        loadComponent: () => import('./admin/teachers/teachers.component').then(m => m.TeachersComponent)
      },
      {
        path: 'utilisateurs',
        loadComponent: () => import('./admin/users/users.component').then(m => m.UsersComponent)
      }
    ]
  },
  
  // Espace Professeur
  {
    path: 'professeur',
    canActivate: [teacherGuard],
    loadComponent: () => import('./professor/professor-layout/professor-layout.component').then(m => m.ProfessorLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'profil',
        pathMatch: 'full'
      },
      {
        path: 'profil',
        loadComponent: () => import('./professor/profile/profile-view/profile-view.component').then(m => m.ProfileViewComponent)
      },
      {
        path: 'profil/nouveau',
        loadComponent: () => import('./professor/profile/create-profile/create-profile.component').then(m => m.CreateProfileComponent)
      },
      {
        path: 'profil/modifier',
        loadComponent: () => import('./professor/profile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
      }
    ]
  },
  
  // Route pour voir le détail d'un professeur (publique)
  {
    path: 'professeur/:id',
    loadComponent: () => import('./pages/teacher-detail/teacher-detail.component').then(m => m.TeacherDetailComponent)
  },
  
  {
    path: '**',
    redirectTo: ''
  }
];

