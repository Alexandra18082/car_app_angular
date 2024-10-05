import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Car } from '../../interfaces/car';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Output() addCar = new EventEmitter<Car>();
  @Output() close = new EventEmitter<void>();

  carForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.carForm = this.fb.group({
      model: ['', Validators.required],
      make: ['', Validators.required],
      plateNumber: ['', Validators.required],
      vin: ['', Validators.required],
      manufactureYear: ['', Validators.required],
      hp: ['', Validators.required],
      engineCc: ['', Validators.required],
      engineType: ['', Validators.required],
    });
  }

  submit() {
    if (this.carForm.valid) {
      // Trimit date in tabel
      this.addCar.emit(this.carForm.value);
      this.closeModal();
    } else {
      this.carForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.close.emit();
  }
}
