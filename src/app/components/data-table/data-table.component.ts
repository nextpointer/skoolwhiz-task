import { Component, input, output, signal } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatIconModule],
})
export class DataTableComponent {
  patients = input<Patient[]>([]);
  edit = output<Patient>();
  selectionChange = output<Set<number>>(); // Changed to number

  displayedColumns = [
    'select',
    'name',
    'uid',
    'phone',
    'address',
    'height',
    'weight',
    'bloodGroup',
    'emergencyContact',
    'allergies',
    'notes',
    'picture',
    'actions',
  ];

  selection = signal<Set<number>>(new Set<number>()); // Changed to number
  allSelected = signal(false);

  toggleSelection(id: number) {
    if (!id) return;

    const newSelection = new Set(this.selection());
    newSelection.has(id) ? newSelection.delete(id) : newSelection.add(id);
    this.selection.set(newSelection);
    this.allSelected.set(newSelection.size === this.patients().length);
    this.selectionChange.emit(newSelection);
  }

  toggleAll() {
    const allSelected = !this.allSelected();
    this.allSelected.set(allSelected);
    const newSelection = allSelected
      ? new Set(
          this.patients()
            .map((p) => p.id!)
            .filter(Boolean)
        )
      : new Set<number>();
    this.selection.set(newSelection);
    this.selectionChange.emit(newSelection);
  }
}
