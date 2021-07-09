import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  constructor(private storage: AngularFireStorage) {}

  public uploadFile(fileName: string, data: any) {
    return this.storage.upload(fileName, data);
  }

  public getFileReference(fileName: string) {
    return this.storage.ref(fileName);
  }
}
