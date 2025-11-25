import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isAuthenticated = false;
  user: any = null;
  private authSubscription?: Subscription;
  isConnexionOpen = false;
  isInscriptionOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.checkAuth();
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.user = this.authService.getUser();
      } else {
        this.user = null;
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  checkAuth() {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.user = this.authService.getUser();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleConnexionMenu() {
    this.isConnexionOpen = !this.isConnexionOpen;
    this.isInscriptionOpen = false;
  }

  toggleInscriptionMenu() {
    this.isInscriptionOpen = !this.isInscriptionOpen;
    this.isConnexionOpen = false;
  }

  closeMenus() {
    this.isConnexionOpen = false;
    this.isInscriptionOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.auth-dropdown')) {
      this.closeMenus();
    }
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
  }

  isAdmin(): boolean {
    return this.user?.roles?.includes('ROLE_ADMIN') || false;
  }

  isTeacher(): boolean {
    return this.user?.roles?.includes('ROLE_TEACHER') || false;
  }
}

