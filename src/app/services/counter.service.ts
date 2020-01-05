import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Counter } from '../model/counter.interface';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class CounterService {

    constructor(
        private firestore: AngularFirestore,
        private authService: AuthService,
    ) {
    }

    userCountersDocument$(): Observable<AngularFirestoreCollection<Counter>> {
        return this.authService.getUserId$().pipe(
            map(userId => {
                if (!userId) {
                    return null;
                }
                return this.firestore.collection<Counter>(`users/${userId}/counters`);
            })
        );
    }

    fetchCounters$(): Observable<Counter[]> {
        return this.userCountersDocument$().pipe(
            switchMap(doc => {
                if (!doc) {
                    return of([]);
                }
                return doc.valueChanges();
            })
        );
    }

    saveCounter(counter: Counter): Promise<void> {
        return this.userCountersDocument$().pipe(
            take(1),
            switchMap(doc => doc.doc(counter.name).set(counter))
        ).toPromise();
    }

    deleteCounter(counter: Counter): Promise<void> {
        return this.userCountersDocument$().pipe(
            take(1),
            switchMap(doc => doc.doc(counter.name).delete())
        ).toPromise();
    }

    fetchCounter$(name: string): Observable<Counter> {
        return this.userCountersDocument$().pipe(
            switchMap(doc => doc.doc<Counter>(name).valueChanges())
        );
    }
}
