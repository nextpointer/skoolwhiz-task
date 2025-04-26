import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Patient } from '../models/patient.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, tap, Subject, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/patients`;
  private patients$ = new Subject<Patient[]>();

  patients = toSignal(this.patients$.asObservable(), { initialValue: [] });
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() { this.loadPatients(); }

  async loadPatients() {
    this.loading.set(true);
    try {
      const patients = await this.http.get<Patient[]>(this.apiUrl).toPromise();
      this.patients$.next(patients || []);
    } catch (err) {
      this.error.set('Failed to load patients');
    } finally {
      this.loading.set(false);
    }
  }

  async createPatient(patient: Patient) {
    this.loading.set(true);
    try {
      const created = await this.http.post<Patient>(this.apiUrl, patient).toPromise();
      this.patients$.next([...this.patients(), created!]);
      return created;
    } catch (err) {
      this.error.set('Failed to create patient');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async updatePatient(patient: Patient) {
    this.loading.set(true);
    try {
      const updated = await this.http.put<Patient>(`${this.apiUrl}/${patient.id}`, patient).toPromise();
      this.patients$.next(this.patients().map(p => p.id === patient.id ? updated! : p));
      return updated;
    } catch (err) {
      this.error.set('Failed to update patient');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async deletePatient(id: string) {
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
}