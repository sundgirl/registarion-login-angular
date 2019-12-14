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
  userTasks: any;
  value: any;
  items: any;
  updateTask: any;
  currentUser: any;
  newObj: any;
  arr: any;
  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) { }
  ngOnInit() {
   this.user =  this.authService.currentUserValue;
   this.userId = this.authService.currentUserValue.id;
   this.userTasks = this.authService.currentUserValue.tasks;
   this.currentUser = localStorage.getItem('currentUser');
   this.newObj = JSON.parse(this.currentUser);
   this.items = this.newObj.tasks;
  }

  logout() {
    this.authService.logout();
  }

  addTask() {
    this.items = [...this.items, this.value];
    this.setNewValue();
    this.userService.updateUser(this.newObj);
  }

  deleteTask(index) {
    this.items = this.items.filter((el, idx) => idx !== index);
    this.setNewValue();
  }

  setNewValue() {
    this.newObj = {...this.newObj, tasks: this.items};
    localStorage.setItem('currentUser', JSON.stringify(this.newObj));
  }
}
