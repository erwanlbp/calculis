import { OperatorFunction } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';

export function updateOrSet<T>(dataToUpdateOrSet: T): OperatorFunction<AngularFirestoreDocument<T>, void> {
    let docToUpdate: AngularFirestoreDocument<T>;
    return source => source.pipe(
        switchMap(d => {
            docToUpdate = d;
            return d.get();
        }),
        switchMap(d => !!d.data() ? docToUpdate.update(dataToUpdateOrSet) : docToUpdate.set(dataToUpdateOrSet)),
    );
}
