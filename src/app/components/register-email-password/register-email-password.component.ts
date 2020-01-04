import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { RouteConstants } from '../../constants/route.constants';

@Component({
    selector: 'app-register-email-password',
    templateUrl: './register-email-password.component.html',
    styleUrls: ['./register-email-password.component.scss'],
})
export class RegisterEmailPasswordComponent implements OnInit {

    form: FormGroup;

    constructor(
        private firebaseAuth: AngularFireAuth,
        private navController: NavController,
    ) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required),
        });
    }

    register() {
        this.firebaseAuth.auth.createUserWithEmailAndPassword(this.form.controls.email.value, this.form.controls.password.value)
            .then(credentials => {
                console.log(credentials);
                this.navController.navigateRoot(RouteConstants.PLAY);
            })
            .catch(err => {
                console.log(err);
                if (err && err.code === 'auth/email-already-in-use') {
                    this.form.setErrors({email: 'Cette adresse est déjà utilisée'});
                } else if (err && err.code === 'auth/weak-password') {
                    this.form.setErrors({password: 'Password trop faible'});
                }
            });
    }

    login() {
        this.firebaseAuth.auth.signInWithEmailAndPassword(this.form.controls.email.value, this.form.controls.password.value)
            .then(credentials => {
                console.log(credentials);
                this.navController.navigateRoot(RouteConstants.PLAY);
            })
            .catch(err => {
                console.log(err);
                if (err && err.code === 'auth/user-not-found') {
                    this.form.setErrors({email: 'Cet utilisateur n\'existe pas'});
                } else if (err && err.code === 'auth/invalid-email') {
                    this.form.setErrors({email: 'Email invalide'});
                } else if (err && err.code === 'auth/wrong-password') {
                    this.form.setErrors({password: 'Password incorrect'});
                }
            });
    }
}
