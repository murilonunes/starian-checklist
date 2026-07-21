import { Observable } from 'rxjs';
import { CreateTaskPayload, Task, UpdateTaskPayload } from '../models/task.model';

export abstract class TaskService {
  abstract list(): Observable<Task[]>;
  abstract create(payload: CreateTaskPayload): Observable<Task>;
  abstract update(id: number, payload: UpdateTaskPayload): Observable<Task>;
  abstract remove(id: number): Observable<void>;
}
