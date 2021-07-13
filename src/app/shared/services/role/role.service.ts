import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private firestore: AngularFirestore) { }

  public getAllRoles(): Observable<Role[]> {
    return this.firestore.collection<Role>("roles").valueChanges({ idField: "id"});
  }

  public getRoleById(roleId: string): Observable<Role> {
    return this.firestore.collection<Role>("roles").doc(roleId).valueChanges({ idField: "id"});
  }

  public getRoleByName(roleId: string): Observable<Role[]> {
    return this.firestore.collection<Role>("roles", ref => ref.where("name", "==",  "user")).valueChanges({ idField: "id"});
  }
}
