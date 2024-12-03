import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    private snackBar = inject(MatSnackBar);
    private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);

    showToast(msg: string) {
        this.snackBar.open(msg, 'Fermer', { duration: 4000 });
    }

    isMobile(): Signal<boolean> {
        return toSignal(
            this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(map(state => { return state.matches; })),
            { initialValue: true },
        )
    }
}
