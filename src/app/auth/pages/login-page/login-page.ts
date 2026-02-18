import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink],
  templateUrl: './login-page.html',
})
export class LoginPage {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(){
    console.log(this.loginForm.value);
    console.log('Di click en el botón de login');
    if(this.loginForm.invalid){
      console.log('El formulario es inválido');
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const {email = '', password = ''} = this.loginForm.value;

    this.authService.login(email!, password!).subscribe(isAuth => {
      console.log('Invoque el servicio de autenticación');
      if(isAuth){
        console.log('Esta autenticado');
        this.router.navigateByUrl('/');
        return;
      }

      this.hasError.set(true);
      console.log('Muestro el error');
      setTimeout(() => {
        console.log('Oculto el error');
        this.hasError.set(false);
      }, 2000);
    });

  }


}
