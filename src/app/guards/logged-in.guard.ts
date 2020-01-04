import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { catchError, map, take } from 'rxjs/operators';
import { RouteConstants } from '../constants/route.constants';

@Injectable({
    providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
    constructor(
        private router: Router,
        private firebaseAuth: AngularFireAuth,
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.firebaseAuth.authState.pipe(
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
        console.error('NOT IMPLEMENTED, WHERE TO REDIRECT');
    }
}
