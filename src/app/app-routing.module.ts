import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './admin.guard';
import { StationComponent } from './station/station.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent }, // Menambahkan canActivate: [AuthGuard]
  { path: 'station', component: StationComponent }, // Menambahkan canActivate: [AuthGuard]
  { path: 'station/:id', component: StationComponent }, // Menambahkan canActivate: [AuthGuard]
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] }, // Route yang diproteksi
  { path: '', redirectTo: '/home', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

