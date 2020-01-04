import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { RegisterEmailPasswordComponent } from './register-email-password.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireAuthModule,
    ],
    exports: [RegisterEmailPasswordComponent],
    declarations: [RegisterEmailPasswordComponent],
})
export class RegisterEmailPasswordComponentModule {
}
