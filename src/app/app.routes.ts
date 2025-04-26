// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PatientListComponent } from './pages/patient-list/patient-list.component';

export const routes: Routes = [
  { path: '', component: PatientListComponent },
  { path: '**', redirectTo: '' }
];