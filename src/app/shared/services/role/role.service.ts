import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Role } from '../../interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private firestore: AngularFirestore) { }

  public getAllRoles() {
    return this.firestore.collection<Role>("roles").valueChanges({ idField: "id"});
  }

  public getRoleById(roleId: string) {
    return this.firestore.collection<Role>("roles").doc(roleId).valueChanges({ idField: "id"});
  }
}
