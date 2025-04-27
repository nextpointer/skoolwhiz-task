import { PatientService } from '../services/patient.service';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { of, timer } from 'rxjs';

export function uniqueUidValidator(
  patientService: PatientService,
  currentPatientId?: number
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return of(null);
    
    return timer(500).pipe(
      switchMap(() => 
        patientService.checkUidUnique(control.value, currentPatientId).pipe(
          map(isUnique => isUnique ? null : { uidExists: true }),
          catchError(() => of(null))
        )
      )
    );
  };
}