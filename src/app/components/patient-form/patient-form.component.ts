import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { PatientService } from '../../services/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Patient } from '../../models/patient.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule
  ],
})
export class PatientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private dialogRef = inject(MatDialogRef);
  private snackBar = inject(MatSnackBar);
  data: Patient | null = inject(MAT_DIALOG_DATA, { optional: true });

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  isSubmitting = signal(false);
  imagePreview = signal<string | null>(null);
  allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  form = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.maxLength(50)]],
    uid: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{9,14}$/)]],
    address: [''],
    height: [null as number | null],
    weight: [null as number | null],
    picture: [null as string | null],
    bloodGroup: ['A+', Validators.required],
    emergencyContact: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{9,14}$/)]],
    allergies: [''],
    notes: ['']
  });

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        ...this.data,
        id: this.data.id ?? null,
        height: this.data.height ?? null,
        weight: this.data.weight ?? null,
        picture: this.data.picture ?? null
      });

      if (this.data.picture) {
        this.imagePreview.set(this.data.picture);
      }
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const formValue = this.form.getRawValue();

    try {
      if (this.data?.id) {
        // Update existing patient
        await this.patientService.updatePatient({ ...formValue, id: this.data.id } as Patient);
      } else {
        // Create new patient
        await this.patientService.createPatient(formValue as Patient);
      }

      this.dialogRef.close(true);
      this.snackBar.open('Operation successful', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Save error:', error);
      this.snackBar.open('Operation failed', 'Close', { duration: 3000 });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && this.allowedImageTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
        this.form.patchValue({ picture: reader.result as string });
        this.form.markAsDirty();
      };
      reader.readAsDataURL(file);
    } else if (file) {
      this.form.get('picture')?.setErrors({ invalidFileType: true });
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }
}