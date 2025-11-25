import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService, TeacherListItem } from '../../services/admin.service';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.css'
})
export class TeachersComponent implements OnInit {
  teachers: TeacherListItem[] = [];
  isLoading = true;
  errorMessage = '';
  currentPage = 1;
  total = 0;
  limit = 20;
  selectedStatut: string = '';

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedStatut = params['statut'] || '';
      this.currentPage = parseInt(params['page'] || '1', 10);
      this.loadTeachers();
    });
  }

  loadTeachers() {
    this.isLoading = true;
    this.adminService.getTeachers(this.selectedStatut, this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.teachers = response.data;
        this.total = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des professeurs';
        this.isLoading = false;
      }
    });
  }

  onStatutChange(statut: string) {
    this.selectedStatut = statut;
    this.currentPage = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { statut: statut || null, page: 1 },
      queryParamsHandling: 'merge'
    });
  }

  approveTeacher(id: number) {
    if (confirm('Êtes-vous sûr de vouloir approuver ce professeur ?')) {
      this.adminService.approveTeacher(id).subscribe({
        next: () => {
          this.loadTeachers();
        },
        error: (error) => {
          alert(error.error?.message || 'Erreur lors de l\'approbation');
        }
      });
    }
  }

  rejectTeacher(id: number) {
    if (confirm('Êtes-vous sûr de vouloir rejeter ce professeur ?')) {
      this.adminService.rejectTeacher(id).subscribe({
        next: () => {
          this.loadTeachers();
        },
        error: (error) => {
          alert(error.error?.message || 'Erreur lors du rejet');
        }
      });
    }
  }

  deleteTeacher(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce professeur ? Cette action est irréversible.')) {
      this.adminService.deleteTeacher(id).subscribe({
        next: () => {
          this.loadTeachers();
        },
        error: (error) => {
          alert(error.error?.message || 'Erreur lors de la suppression');
        }
      });
    }
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'statut-pending',
      'approved': 'statut-approved',
      'rejected': 'statut-rejected'
    };
    return classes[statut] || '';
  }

  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'approved': 'Approuvé',
      'rejected': 'Rejeté'
    };
    return labels[statut] || statut;
  }

  changePage(page: number) {
    this.currentPage = page;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }
}
