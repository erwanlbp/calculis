import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    private snackBar = inject(MatSnackBar);

    showToast(msg: string) {
        this.snackBar.open(msg, 'Fermer', { duration: 4000 });
    }
}
