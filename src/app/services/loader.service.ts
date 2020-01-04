import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    private loading: HTMLIonLoadingElement;

    constructor(
        private loadingController: LoadingController,
    ) {
    }

    async showLoader(msg?: string): Promise<void> {
        if (this.loading) {
            await this.dismissLoader();
            return this.showLoader(msg);
        }
        this.loading = await this.loadingController.create({
            message: msg,
        });
        await this.loading.present();
    }

    dismissLoader(): Promise<void> {
        if (!this.loading) {
            return Promise.resolve();
        }
        return this.loading.dismiss().then(() => this.loading = null);
    }
}
