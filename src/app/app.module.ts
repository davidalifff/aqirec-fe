import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MapComponent } from './map/map.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { DataDownloadService } from './services/data-download.service';
import { AdminGuard } from './admin.guard';
import { AdminComponent } from './admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecordedDataComponent } from './home/models/recorded-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { StationComponent } from './station/station.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MapComponent,
    NavbarComponent,
    HomeComponent,
    AdminComponent,
    RecordedDataComponent,
    StationComponent
  ],
  imports: [
    BrowserModule,
    NgbDropdownModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule,
    FormsModule,
    
  ],
  providers: [AuthGuard,DataDownloadService,AdminGuard,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
