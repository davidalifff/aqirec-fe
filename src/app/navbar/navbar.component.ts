import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  activePage: any;

  constructor(private authService: AuthService, private router: Router) { }

  onMenuClick(event: any, path: any) {
    var before = window.location.pathname.split("/")[1];
    this.activePage = path;

    if (event !== "") {
      event.preventDefault();
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']); // Redirect to login page after logout

      return new Promise((resolve, reject) => {
        localStorage.removeItem('activeuser');
        resolve(true);
      });
    },
    (error) => {
      // Handle login error, e.g., display error message
      console.error('Logout failed:', error);
    });
  }

  moveToStation(){
    if (!this.authService.getIsAdmin()) {
      Swal.fire({
        title: "Anda belum Login",
        text: "Silahkan Login terlebih dahulu",
        icon: "info",
        showConfirmButton: false,
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        footer: '<a href="/login">Login</a>'
      });
    } else {
      this.router.navigate(['/station']);
    }
  }
}
