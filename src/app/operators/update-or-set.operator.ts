import { OperatorFunction } from 'rxjs';
import { DocumentReference, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';

export function updateOrSet<T extends {}>(dataToUpdateOrSet: T): OperatorFunction<DocumentReference<T>, void> {
    let docToUpdate: DocumentReference<T>;
    return source => source.pipe(
        switchMap(d => {
            docToUpdate = d;
            return getDoc(d);
        }),
        switchMap(d => !!d.data() ? updateDoc(docToUpdate, dataToUpdateOrSet) : setDoc(docToUpdate, dataToUpdateOrSet)),
    );
}