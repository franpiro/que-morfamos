import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MeasurementUnit } from '../../interfaces/measurementUnit';

@Injectable({
  providedIn: 'root'
})
export class MeasurementUnitService {

  constructor(private firestore: AngularFirestore) { }

  getAllMeasurementUnits(): Observable<MeasurementUnit[]> {
    return this.firestore.collection<MeasurementUnit>("measurementUnits").valueChanges({ idField: "id"});
  }

  getMeasurementUnitById(measurementUnitId): Observable<MeasurementUnit> {
    return this.firestore.collection<MeasurementUnit>("measurementUnits").doc(measurementUnitId).valueChanges({ idField: "id"});
  }
}
