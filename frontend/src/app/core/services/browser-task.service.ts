import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { CreateTaskPayload, Task, UpdateTaskPayload } from '../models/task.model';
import { TaskService } from './task.service';

@Injectable()
export class BrowserTaskService extends TaskService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'starian-checklist.tasks';

  override list(): Observable<Task[]> {
    return this.execute(() => this.read());
  }

  override create(payload: CreateTaskPayload): Observable<Task> {
    return this.execute(() => {
      const tasks = this.read();
      const timestamp = new Date().toISOString();
      const task: Task = {
        id: tasks.reduce((highestId, item) => Math.max(highestId, item.id), 0) + 1,
        title: payload.title,
        completed: false,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      this.write([task, ...tasks]);

      return task;
    });
  }

  override update(id: number, payload: UpdateTaskPayload): Observable<Task> {
    return this.execute(() => {
      const tasks = this.read();
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex < 0) {
        throw new Error('Tarefa nao encontrada.');
      }

      const updatedTask: Task = {
        ...tasks[taskIndex],
        ...payload,
        updatedAt: new Date().toISOString()
      };

      tasks[taskIndex] = updatedTask;
      this.write(tasks);

      return updatedTask;
    });
  }

  override remove(id: number): Observable<void> {
    return this.execute(() => {
      this.write(this.read().filter((task) => task.id !== id));
    });
  }

  private execute<T>(operation: () => T): Observable<T> {
    return defer(() => of(operation()));
  }

  private read(): Task[] {
    const storedTasks = this.storage.getItem(this.storageKey);

    if (!storedTasks) {
      return [];
    }

    const parsedTasks: unknown = JSON.parse(storedTasks);

    return Array.isArray(parsedTasks) ? parsedTasks.filter(this.isTask) : [];
  }

  private write(tasks: Task[]): void {
    this.storage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  private get storage(): Storage {
    const storage = this.document.defaultView?.localStorage;

    if (!storage) {
      throw new Error('Armazenamento do navegador indisponivel.');
    }

    return storage;
  }

  private readonly isTask = (value: unknown): value is Task => {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const task = value as Record<string, unknown>;

    return typeof task['id'] === 'number'
      && typeof task['title'] === 'string'
      && typeof task['completed'] === 'boolean'
      && typeof task['createdAt'] === 'string'
      && typeof task['updatedAt'] === 'string';
  };
}
