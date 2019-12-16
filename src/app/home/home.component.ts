import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { first } from 'rxjs/operators';
import { TasksService } from '../services/tasks.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  users: User[] = [];
  currentUserId: number;
  userId: number;
  userTasks: any;
  userTaskId: number;
  value: string;
  items: any;
  currentUser: string;
  newObj: any;
  selectedOption: number;
  assignTo: number;
  assignFrom: number;
  username: string;
  selectedIndex: number;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private tasksService: TasksService
  ) { }

  ngOnInit() {
   this.getAllUsers();
   this.user =  this.authService.currentUserValue;
   this.currentUserId = this.authService.currentUserValue.id;
   this.userTasks = this.authService.currentUserValue.tasks;
   this.currentUser = localStorage.getItem('currentUser');
   this.items = this.getAllTasks();
   this.selectedIndex = -1;
  }

  private getAllTasks() {
    this.newObj = JSON.parse(this.currentUser);
    const tasks = this.newObj.tasks;
    return tasks;
  }

  public getAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }

  public logout() {
    this.authService.logout();
  }

  public setTask(): void {
    const selectedTask = this.getSelectedTasks(this.selectedIndex);
    if (this.selectedIndex === -1) {
      this.addTask();
    } else {
      this.editTask(selectedTask);
    }
    this.value = '';
  }

  public addTask(): void {
    this.userTaskId = this.items.length ? Math.max(...this.items.map(x => x.id)) + 1 : 1;
    this.items = [...this.items, {id: this.userTaskId, content: this.value,
                                  assignTo: this.assignTo, assignFrom: this.assignFrom}];
    this.setNewValue();
    this.tasksService.addTask(this.currentUserId, this.value, this.assignTo);
    this.reload();
  }

  public editTask(selectedTask): void {
    const obj = {id: selectedTask.id, content: this.value,
                assignTo: this.assignTo, assignFrom: this.assignFrom};
    this.items.splice(this.selectedIndex, 1, obj);
    this.setNewValue();
    this.tasksService.updateTask(this.currentUserId, this.selectedIndex, selectedTask.id, this.value);
    this.reload();
  }

  public deleteTask(index: number): void {
    this.items = this.items.filter((el, idx) => idx !== index);
    this.tasksService.deleteTask(this.currentUserId, this.items);
    this.setNewValue();
  }

  private setNewValue(): void {
    this.newObj = {...this.newObj, tasks: this.items};
    localStorage.setItem('currentUser', JSON.stringify(this.newObj));
  }

  private getSelectedTasks(index: number) {
    const selectedTask = this.userTasks.find((el, idx) =>
      idx === index ? el : false);
    return selectedTask;
  }

  public updateTaskFun(index: number): void {
    this.selectedIndex = index;
    const selectedTask = this.getSelectedTasks(this.selectedIndex);
    this.value = selectedTask.content;
  }

  public reload(): void {
    window.location.reload();
  }
}
