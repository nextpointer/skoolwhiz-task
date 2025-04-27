import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
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
import { uniqueUidValidator } from '../../validators/uid.validator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
  showUidValid = signal(false);

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  isSubmitting = signal(false);
  imagePreview = signal<string | null>(null);
  allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  form = this.fb.group({
    id: [null as number | null],
    name: ['', [Validators.required, Validators.maxLength(50)]],
    uid: ['', 
      [Validators.required, Validators.pattern(/^\d{11}$/)],
      [this.uidValidator.bind(this)]
    ],
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
  private uidValidator(control: AbstractControl) {
    return uniqueUidValidator(this.patientService, this.data?.id)(control);
  }
  get uidControl() {
    return this.form.get('uid');
  }

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        ...this.data,
        id: this.data.id ?? null,
        height: this.data.height ?? null,
        weight: this.data.weight ?? null,
        picture: this.data.picture ?? null,
        uid: this.data.uid
      });

      if (this.data.picture) {
        this.imagePreview.set(this.data.picture);
      }
    }

    this.uidControl?.statusChanges.subscribe(status => {
      if (status === 'PENDING') {
        this.uidControl?.setErrors(null);
      }
    });
    
    this.uidControl?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.showUidValid.set(
        !!this.uidControl?.valid && 
        !this.uidControl?.pending &&
        !this.uidControl?.hasError('uidExists')
      );
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.form.value;

    try {
      if (this.data?.id) {
        // Ensure ID is preserved
        const updateData = { ...formData, id: this.data.id };
        await this.patientService.updatePatient(updateData as Patient);
      } else {
        // Remove any existing ID for new entries
        const { id, ...createData } = formData;
        await this.patientService.createPatient(createData as Patient);
      }

      this.dialogRef.close(true);
      this.snackBar.open('Patient Update successfully', 'Close', { duration: 3000 });
    } catch (err) {
      console.error('Error saving patient:', err);
      this.snackBar.open('Patient Update failed', 'Close', { duration: 3000 });
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