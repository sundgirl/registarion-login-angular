import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`/users`);
    }

    getById(id: number) {
        return this.http.get(`/users/${id}`);
    }

    register(user: User) {
        return this.http.post(`/users/register`, user);
    }

    updateUser(user: User) {
        return this.http.put<any>('/users/update', user)
            .subscribe(() => console.log('successfull'));
    }

    delete(id: number) {
        return this.http.delete(`/users/${id}`);
    }
}
