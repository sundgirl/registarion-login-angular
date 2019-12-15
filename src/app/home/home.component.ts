import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { first } from 'rxjs/operators';
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
  users: User[] = [];
  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) { }
  ngOnInit() {
   this.getAllUsers();
   this.user =  this.authService.currentUserValue;
   this.userId = this.authService.currentUserValue.id;
   this.userTasks = this.authService.currentUserValue.tasks;
   this.currentUser = localStorage.getItem('currentUser');
   this.newObj = JSON.parse(this.currentUser);
   this.items = this.newObj.tasks;
  }

  getAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }

  logout() {
    this.authService.logout();
  }

  addTask() {
    this.items = [...this.items, this.value];
    this.setNewValue();
    this.userService.updateUser(this.userId, this.value);
    this.value = '';
  }

  deleteTask(index) {
    this.items = this.items.filter((el, idx) => idx !== index);
    this.userService.deleteTask(this.userId, this.items);

    this.setNewValue();
  }

  setNewValue() {
    this.newObj = {...this.newObj, tasks: this.items};
    localStorage.setItem('currentUser', JSON.stringify(this.newObj));
  }
}
