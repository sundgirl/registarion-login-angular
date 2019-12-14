import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confPassword: new FormControl('', Validators.required),
    tasks: new FormControl('')
  });
  constructor(
        private router: Router,
        private userService: UserService,
  ) {}

  ngOnInit() {
  }

  submit() {
    this.registerForm.value.tasks = this.registerForm.value.tasks.split('');
    if (!this.registerForm.invalid) {
      this.userService.register(this.registerForm.value)
        .subscribe(() => this.router.navigate(['/login']));
    }
  }

}
