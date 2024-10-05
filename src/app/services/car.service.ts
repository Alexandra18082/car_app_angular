import { Injectable } from '@angular/core';
import { carData } from '../mock/car';
import { Car } from '../interfaces/car';
import { BehaviorSubject } from 'rxjs';
import { trigger } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  //cream behavior subject si asignam valoarea initiala loadCars
  private carsSubject = new BehaviorSubject<Car[]>(this.loadCars());
  cars$ = this.carsSubject.asObservable();

  public allCars: Car[] = [];

  // aici verificam daca avem date in local storage. Daca avem, ne folosim de ele, else atunci ne vom folosi de datele din mock si totodata mock-ul il vom stoca in local storage.
  public loadCars(): Car[] {
    const storedCars = localStorage.getItem('cars');
    let parsedData = [];
    if (storedCars) {
      try {
        parsedData = JSON.parse(storedCars);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }
    //in local storage nu putem stoca elemengte tip json
    if (parsedData?.length) {
      this.allCars = parsedData;
      return parsedData;
    } else {
      localStorage.setItem('cars', JSON.stringify(carData));
      const storedCars = localStorage.getItem('cars');
      const parsedData = JSON.parse(storedCars || '') || [];
      this.allCars = parsedData;
      return this.allCars;
    }
  }

  public addCar(car: Car) {
    //ca sa faca push la ce scriem in formular in array ul de mock
    const currentCars = this.loadCars();
    currentCars.push(car);
    localStorage.setItem('cars', JSON.stringify(currentCars));
    console.log('Fa trigger la carsSubject.');
    this.carsSubject.next(currentCars); //aici ii zicem sa faca update cu masina noua adaugata in cars subject
    console.log('Masina adaugata, toate masinile acum sunt: ', this.allCars);
  }

  deleteCar(vin: string) {
    const currentCars = this.loadCars();
    const updatedCars = currentCars.filter((car) => car.vin !== vin);
    //returneaza tot in afara de ce nu e vin(din parametri)
    localStorage.setItem('cars', JSON.stringify(updatedCars));
    this.carsSubject.next(updatedCars);
    //emite o actiune pentru componentele subscrise la carSubject
    //la refresh apar iar mock pt ca sunt salvate in local storage
  }
}
