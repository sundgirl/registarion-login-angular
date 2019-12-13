import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  userId: any;
  value: any;
  items: any;
  updateTask: any;
  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) { }
  ngOnInit() {
   this.user =  this.authService.currentUserValue;
   this.userId = this.authService.currentUserValue.id;
   this.items = ['dfh'];
  }

  logout() {
    this.authService.logout();
  }

  addTask() {
    this.items = [...this.items, this.value];
    this.userService.update(this.user).subscribe(() => console.log(this.user));
  }
}
