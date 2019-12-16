import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(delay(500));

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                // case url.match(/\/users\/\d+$/) && method === 'POST':
                //     return assignTo();
                // case url.match(/\/users\/\d+$/) && method === 'GET':
                //     return getUserById();
                // case url.match(/\/users\/\d+$/) && method === 'DELETE':
                //     return deleteUser();
                case url.endsWith('/users/add') && method === 'PUT':
                    return add();
                case url.endsWith('/users/update') && method === 'PUT':
                    return update();
                case url.match(/\/task\/\d+$/) && method === 'PUT':
                    return deleteTask();
                default:
                    return next.handle(request);
            }
        }

        function add() {
            const { id, userTask, assignToUser } = body;
            let user = users.find(u => u.id === id);
            const userTaskId = user.tasks.length ? Math.max(...user.tasks.map(x => x.id)) + 1 : 1;
            const taskObj = {id: userTaskId, content: userTask, assignTo: assignToUser, assignFrom: user.id};
            user.tasks = [...user.tasks, taskObj];
            user = {...user, tasks: user.tasks};
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function update() {
            const { id, index, userTaskId, userTask } = body;
            const user = users.find(u => u.id === id);
            const taskObj = {id: userTaskId, content: userTask, assignTo: user.assignTo, assignFrom: user.id};
            user.tasks.splice(index, 1, taskObj);
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function deleteTask() {
            const { id, userTask } = body;
            let user = users.find(u => u.id === id);
            user.tasks = userTask;
            user = {...user, tasks: user.tasks};
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function register() {
            const user = body;

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken');
            }
            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users = [...users, user];
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) {
              return error('Username or password is incorrect');
            }
            return ok({
                id: user.id,
                username: user.username,
                token: 'fake-token',
                tasks: user.tasks
            });
        }


        function getUsers() {
            return ok(users);
        }

        // function getUserById() {
        //     const user = users.find(x => x.id === idFromUrl());
        //     return ok(user);
        // }

        // function deleteUser() {
        //     if (!isLoggedIn()) {
        //       return unauthorized();
        //     }

        //     users = users.filter(x => x.id !== idFromUrl());
        //     localStorage.setItem('users', JSON.stringify(users));
        //     return ok();
        // }

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }));
        }

        // function unauthorized() {
        //     return throwError({ status: 401, error: { message: 'Unauthorised' } });
        // }

        function error(message) {
            return throwError({ error: { message } });
        }

        // function isLoggedIn() {
        //     return headers.get('Authorization') === 'Bearer fake-jwt-token';
        // }

        // function idFromUrl() {
        //     const urlParts = url.split('/');
        //     return parseInt(urlParts[urlParts.length - 1]);
        // }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
