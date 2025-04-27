import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Patient } from '../models/patient.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, Subject, throwError } from 'rxjs';

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

  async createPatient(patientData: Omit<Patient, 'id'>) {
    this.loading.set(true);
    try {
      const created = await this.http.post<Patient>(this.apiUrl, patientData).toPromise();
      if (created) {
        this.patients$.next([...this.patients(), created]);
      }
      return created;
    } catch (err) {
      this.error.set('Failed to Add patient');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async updatePatient(patient: Patient) {
    if (!patient.id) {
      throw new Error('Cannot update patient without ID');
    }
    
    this.loading.set(true);
    try {
      const updated = await this.http.put<Patient>(
        `${this.apiUrl}/${patient.id}`, 
        patient
      ).toPromise();

      if (updated) {
        const updatedPatients = this.patients().map(p => 
          p.id === patient.id ? updated : p
        );
        this.patients$.next(updatedPatients);
      }
      return updated;
    } catch (err) {
      this.error.set('Failed to update patient');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async deletePatient(id: number) {
    if (!id) {
      throw new Error('Invalid ID for deletion');
    }
    
    this.loading.set(true);
    try {
      await this.http.delete(`${this.apiUrl}/${id}`).toPromise();
      this.patients$.next(this.patients().filter(p => p.id !== id));
    } catch (err) {
      this.error.set('Failed to delete patient');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  checkUidUnique(uid: string, currentPatientId?: number): Observable<boolean> {
    return this.http.get<Patient[]>(this.apiUrl, {
      params: {
        uid: uid,
        id_ne: currentPatientId?.toString() || ''
      }
    }).pipe(
      map(patients => patients.length === 0),
      catchError(() => of(false))
    );
  }
}