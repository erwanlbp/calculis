import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { catchError, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: Auth,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return authState(this.auth).pipe(
      take(1),
      map(user => {
        if (!user) {
          this.redirect();
          return false;
        }
        return true;
      }),
      catchError(err => {
        this.redirect();
        return of(false);
      })
    );
  }

  private redirect() {
    this.router.navigateByUrl("/");
  }
}
