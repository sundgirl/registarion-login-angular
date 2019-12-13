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
  constructor(
        private router: Router,
        private authService: AuthenticationService,
  ) { }

  ngOnInit() {
  }

  submit() {
    if (!this.loginForm.invalid) {
      this.authService.login(this.loginForm.controls.username.value,
                             this.loginForm.controls.password.value)
        .subscribe(() => this.router.navigate(['/']));
    }
  }
}
