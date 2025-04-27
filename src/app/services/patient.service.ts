import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Patient } from '../models/patient.model';
import { catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/patients`;
  private patients$ = new Subject<Patient[]>();

  patients = signal<Patient[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading.set(true);
    this.http.get<Patient[]>(this.apiUrl)
      .pipe(
        tap(data => this.patients$.next(data)),
        catchError(error => {
          this.error.set('Failed to load patients');
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (data) => this.patients.set(data),
        error: () => this.loading.set(false),
        complete: () => this.loading.set(false)
      });
  }

  createPatient(patient: Omit<Patient, 'id'>) {
    this.loading.set(true);
    return this.http.post<Patient>(this.apiUrl, patient)
      .pipe(
        tap(newPatient => {
          this.patients.set([...this.patients(), newPatient]);
        }),
        catchError(error => {
          this.error.set('Failed to create patient');
          return throwError(() => error);
        })
      )
      .subscribe({
        error: () => this.loading.set(false),
        complete: () => this.loading.set(false)
      });
  }

  updatePatient(patient: Patient) {
    this.loading.set(true);
    return this.http.put<Patient>(`${this.apiUrl}/${patient.id}`, patient)
      .pipe(
        tap(updatedPatient => {
          this.patients.set(this.patients().map(p => 
            p.id === patient.id ? updatedPatient : p
          ));
        }),
        catchError(error => {
          this.error.set('Failed to update patient');
          return throwError(() => error);
        })
      )
      .subscribe({
        error: () => this.loading.set(false),
        complete: () => this.loading.set(false)
      });
  }

  deletePatient(id: number) {
    this.loading.set(true);
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          this.patients.set(this.patients().filter(p => p.id !== id));
        }),
        catchError(error => {
          this.error.set('Failed to delete patient');
          return throwError(() => error);
        })
      )
      .subscribe({
        error: () => this.loading.set(false),
        complete: () => this.loading.set(false)
      });
  }
}