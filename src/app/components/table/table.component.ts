import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community'; // Column Definition Type Interface - tip de date pt coloanele tabelului din ag grid - wrapping
import { Car } from '../../interfaces/car';
import { CarService } from '../../services/car.service';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [AgGridAngular, ModalComponent, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit, OnDestroy {
  isModalOpen: boolean = false; //cand e false se inchde, cand e true se deschide
  private subscription!: Subscription;
  selectedCar: Car | null = null;
  rowData: Car[] = [];
  colDefs: ColDef<Car>[] = [
    // Specify the type here
    { headerName: 'Model', field: 'model' },
    { headerName: 'Make', field: 'make' },
    { headerName: 'Plate Number', field: 'plateNumber' },
    { headerName: 'VIN', field: 'vin' },
    { headerName: 'Manufacture Year', field: 'manufactureYear' },
    { headerName: 'HP', field: 'hp' },
    { headerName: 'Engine CC', field: 'engineCc' },
    { headerName: 'Engine Type', field: 'engineType' },
  ];

  constructor(private carService: CarService) {}
  ngOnInit() {
    this.rowData = this.carService.loadCars();
    this.subscription = this.carService.cars$.subscribe((cars) => {
      this.rowData = cars;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addNewCar(car: Car) {
    // Trimit masina in serciviu
    this.carService.addCar(car);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openModal() {
    this.isModalOpen = true;
  }

  deleteCar() {
    if (this.selectedCar) {
      //mai intai trebuie sa verifice daca nu este null prin if
      this.carService.deleteCar(this.selectedCar.vin);
      this.selectedCar = null;
    }
  }

  onRowSelected(event: any) {
    console.log(event);
    if (event.node.selected) {
      this.selectedCar = event.data;
    }
  }
}
