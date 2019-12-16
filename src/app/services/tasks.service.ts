import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(private http: HttpClient) { }

  addTask(id: number, userTask: string, assignToUser: number) {
    const body = {id, userTask, assignToUser};
    return this.http.put<any>('/users/add', body)
            .subscribe((data) => data);
  }

  updateTask(id: number, index: number, userTaskId: string, userTask: string) {
    const body = {id, index, userTaskId, userTask};
    return this.http.put<any>('/users/update', body)
            .subscribe((data) => data);
  }

  deleteTask(id: number, userTask: string) {
    const body = {id, userTask};
    return this.http.put<any>(`/task/${id}`, body)
            .subscribe((data) => data);
  }
}
