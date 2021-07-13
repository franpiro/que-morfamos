import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app'
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Role } from '../../interfaces/role';
import { User } from '../../interfaces/user'
import { RoleService } from '../role/role.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  public currentUser: User;
  public user: Observable<firebase.User | null >;

  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router, private roleService: RoleService) { 
    this.user = this.afAuth.authState;
  }

  public logIn(): Promise<void> { 
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider(); 
    return this.afAuth.signInWithPopup(googleAuthProvider).then((data) => { 

      this.firestore.collection<User>("users", ref => ref.where("id", "==",  data.user.uid)).valueChanges({ idField: "documentId"}).subscribe(user => {
        if (user.length != 0) {
          if (user[0].isBanned) {
            alert("Estas banea2 :C");
            this.logOut();
            return;
          }
          this.roleService.getRoleById(user[0].roleId).subscribe(role => {
            this.currentUser = {
              id: user[0].id,
              name: user[0].name,
              email: user[0].email,
              roleName: role.name,
              isBanned: user[0].isBanned,
              roleId: user[0].roleId,
              documentId: user[0].documentId
            }
          });
        } else {
          this.roleService.getRoleByName("user").subscribe(role => {
            this.firestore.collection("users").add(
            {
              id: data.user.uid,
              roleId: role[0].id,
              name: data.user.displayName,
              email: data.user.email,
              isBanned: false
            }).then((x) => {
              console.log("id", x.id);
              this.currentUser = {
                id: data.user.uid,
                name: data.user.displayName,
                email: data.user.email,
                roleName: role[0].name,
                isBanned: false,
                roleId: role[0].id,
                documentId: ""
              }
            })            
          });
        }
        return Promise;        
      })                       
    });    
  }

  public logOut() {
    this.afAuth.signOut().then(() => {
      console.log("here");
      this.currentUser = null;
      this.router.navigateByUrl("/")
    });
  }

  setCurrentUser() {
    this.currentUserAsync.subscribe(data => {
      this.firestore.collection<User>("users", ref => ref.where("id", "==",  data.uid)).valueChanges({ idField: "documentId"}).subscribe(user => {
        this.firestore.collection<Role>("roles").doc(user[0].roleId).valueChanges().subscribe(role => {
          this.currentUser = {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            roleName: role.name,
            isBanned: user[0].isBanned,
            roleId: user[0].roleId,
            documentId: user[0].documentId
          }
        })          
      })
    })    
  }

  get authenticated(): Promise<boolean> {
    return this.afAuth.authState.pipe(first()).toPromise().then(user => {
      return user ? true : false;
    }).catch(x => {
      return false;
    })
  }

  get currentUserAsync(): Observable<firebase.User | null> {
    return this.user;
  }

  public getAllUsers(): Observable<User[]> {
    return this.firestore.collection<User>("users").valueChanges({ idField: "documentId"});
  }

  public getUserById(userId: string): Observable<User[]> {
    return this.firestore.collection<User>("users", ref => ref.where("id", "==", userId)).valueChanges({ idField: "documentId"});
  }

  public updateUserRole(documentId: string, roleId: string): Promise<void> {
    return this.firestore.collection<User>("users").doc(documentId).update({ roleId: roleId});
  }

  public banUser(documentId: string): Promise<void> {
    return this.firestore.collection<User>("users").doc(documentId).update({ isBanned: true});
  }

  public unbanUser(documentId: string): Promise<void> {
    return this.firestore.collection<User>("users").doc(documentId).update({ isBanned: false});
  }
}
