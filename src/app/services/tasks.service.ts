import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(private http: HttpClient) { }

  addTask(currentUser, userTask: string, assignToUser: number) {
    const body = {currentUser, userTask, assignToUser};
    return this.http.put<any>('/users/add', body)
            .subscribe((data) => data);
  }

  updateTask(currentUser, index: number, userTaskId: string, userTask: string) {
    const body = {currentUser, index, userTaskId, userTask};
    return this.http.put<any>('/users/update', body)
            .subscribe((data) => data);
  }

  deleteTask(id: number, userTask: string) {
    const body = {id, userTask};
    return this.http.put<any>(`/task/${id}`, body)
            .subscribe((data) => data);
  }

  assignTo(currentUser, task: any, assignedUserId: number) {
    const body = { currentUser, task, assignedUserId };
    return this.http.put<any>('/users/assign', body)
            .subscribe((data) => data);
  }
}
