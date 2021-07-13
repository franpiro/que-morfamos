import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of, pipe } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth'
import { first, mergeMap, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router, private userService: UserService) {}

  canActivate(): Observable<boolean> {
    return this.userService.currentUserAsync
      .pipe(
        mergeMap(x => {
          return this.userService.getUserById(x.uid)
        }),
        switchMap(currentDocumentUser => {
          if (!currentDocumentUser[0]) {
            this.router.navigateByUrl("/");
            return of(false);
          }
      
          if (currentDocumentUser[0].isBanned) {
            alert("Estas banea2 :C")
            this.router.navigateByUrl("/");
            return of(false);
          }
        
          return of(true);
        })
      );        
  }
}