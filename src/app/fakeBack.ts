import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

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
                case url.endsWith('/users/add') && method === 'PUT':
                    return add();
                case url.endsWith('/users/update') && method === 'PUT':
                    return update();
                case url.endsWith('/users/assign') && method === 'PUT':
                    return assignTo();
                case url.match(/\/task\/\d+$/) && method === 'PUT':
                    return deleteTask();
                default:
                    return next.handle(request);
            }
        }

        function add() {
            const { currentUser, userTask, assignToUser } = body;
            let user = users.find(u => u.id === currentUser.id);
            const userTaskId = user.tasks.length ? Math.max(...user.tasks.map(x => x.id)) + 1 : 1;
            const taskObj = {id: userTaskId, content: userTask, assignTo: assignToUser, assignFrom: currentUser};
            user.tasks = [...user.tasks, taskObj];
            user = {...user, tasks: user.tasks};
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function update() {
            const { currentUser, index, userTaskId, userTask } = body;
            const user = users.find(u => u.id === currentUser.id);
            const taskObj = {id: userTaskId, content: userTask, assignTo: user.tasks.assignTo, assignFrom: user.tasks.assignFrom};
            user.tasks.splice(index, 1, taskObj);
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function assignTo() {
            const { currentUser, task, assignedUserId } = body;
            const user = users.find(u => u.id == assignedUserId);
            const taskId = user.tasks.length ? Math.max(...user.tasks.map(x => x.id)) + 1 : 1;
            const taskObj = {id: taskId, content: task.content, assignTo: assignedUserId, assignFrom: currentUser };
            user.tasks = [...user.tasks, taskObj];
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

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function error(message) {
            return throwError({ error: { message } });
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
