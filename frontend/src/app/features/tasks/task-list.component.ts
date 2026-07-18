import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { TaskCollectionComponent } from './components/task-collection/task-collection.component';
import { TaskCreateComponent } from './components/task-create/task-create.component';
import { TaskHeaderComponent } from './components/task-header/task-header.component';

@Component({
  selector: 'app-task-list',
  imports: [TaskHeaderComponent, TaskCreateComponent, TaskCollectionComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit {
  private readonly taskService = inject(TaskService);

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly pendingTaskIds = signal<ReadonlySet<number>>(new Set<number>());
  readonly remainingCount = computed(() => this.tasks().filter((task) => !task.completed).length);

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.taskService.list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (tasks) => this.tasks.set(tasks),
        error: (error: HttpErrorResponse) => this.showError(error, 'carregar as tarefas')
      });
  }

  addCreatedTask(task: Task): void {
    this.tasks.update((tasks) => [task, ...tasks]);
  }

  toggleTask(task: Task): void {
    if (this.isPending(task.id)) {
      return;
    }

    this.setPending(task.id, true);
    this.errorMessage.set('');

    this.taskService.update(task.id, { completed: !task.completed })
      .pipe(finalize(() => this.setPending(task.id, false)))
      .subscribe({
        next: (updatedTask) => this.replaceTask(updatedTask),
        error: (error: HttpErrorResponse) => this.showError(error, 'atualizar a tarefa')
      });
  }

  removeTask(task: Task): void {
    if (this.isPending(task.id)) {
      return;
    }

    this.setPending(task.id, true);
    this.errorMessage.set('');

    this.taskService.remove(task.id)
      .pipe(finalize(() => this.setPending(task.id, false)))
      .subscribe({
        next: () => this.tasks.update((tasks) => tasks.filter((item) => item.id !== task.id)),
        error: (error: HttpErrorResponse) => this.showError(error, 'remover a tarefa')
      });
  }

  isPending(id: number): boolean {
    return this.pendingTaskIds().has(id);
  }

  private replaceTask(updatedTask: Task): void {
    this.tasks.update((tasks) => tasks.map((task) => task.id === updatedTask.id ? updatedTask : task));
  }

  private setPending(id: number, pending: boolean): void {
    this.pendingTaskIds.update((current) => {
      const next = new Set(current);
      pending ? next.add(id) : next.delete(id);
      return next;
    });
  }

  private showError(error: HttpErrorResponse, action: string): void {
    const message = error.status === 0
      ? 'Não foi possível conectar. Verifique sua conexão e tente novamente.'
      : `Não foi possível ${action}. Tente novamente.`;

    this.errorMessage.set(message);
  }
}
