import { Component, inject, signal } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { MatDialog } from '@angular/material/dialog';
import { PatientFormComponent } from '../../components/patient-form/patient-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { Patient } from '../../models/patient.model';

@Component({
  standalone: true,
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  imports: [CommonModule, MatButtonModule, DataTableComponent]
})
export class PatientListComponent {
  patientService = inject(PatientService);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  selectedPatients = signal<Set<string>>(new Set());

  async deleteMultiple() {
    const ids = Array.from(this.selectedPatients());
    try {
      await Promise.all(ids.map(id => this.patientService.deletePatient(id)));
      this.selectedPatients.set(new Set());
      this.snackBar.open(`Deleted ${ids.length} patients`, 'Close', { duration: 3000 });
      this.patientService.loadPatients();
    } catch {
      this.snackBar.open('Failed to delete selected patients', 'Close', { duration: 3000 });
    }
  }

  openForm(patient?: Patient) {
    const dialogRef = this.dialog.open(PatientFormComponent, {
      data: patient ? {...patient} : null,
      width: '90%',
      maxWidth: '800px'
    });
  
    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.patientService.loadPatients();
      }
    });
  }
}