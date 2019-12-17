import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  message: string;
  error: boolean;
  constructor(
        private router: Router,
        private authService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.error = false;
  }

  submit() {
    if (!this.loginForm.invalid) {
      this.authService.login(this.loginForm.controls.username.value,
                             this.loginForm.controls.password.value)
        .subscribe(x => x,
                  err => this.getErrorMessage(err.error.message),
                  () => this.router.navigate(['/']));
    }
  }
  getErrorMessage(message) {
    this.error = true;
    this.message = message;
  }
}
