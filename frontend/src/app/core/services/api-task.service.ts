import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateTaskPayload, Task, UpdateTaskPayload } from '../models/task.model';
import { TaskService } from './task.service';

@Injectable()
export class ApiTaskService extends TaskService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/tasks`;

  override list(): Observable<Task[]> {
    return this.http.get<Task[]>(this.endpoint);
  }

  override create(payload: CreateTaskPayload): Observable<Task> {
    return this.http.post<Task>(this.endpoint, payload);
  }

  override update(id: number, payload: UpdateTaskPayload): Observable<Task> {
    return this.http.patch<Task>(`${this.endpoint}/${id}`, payload);
  }

  override remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
