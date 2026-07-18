import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task } from '../../../../core/models/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-collection',
  imports: [TaskItemComponent],
  templateUrl: './task-collection.component.html',
  styleUrl: './task-collection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCollectionComponent {
  readonly tasks = input.required<readonly Task[]>();
  readonly loading = input.required<boolean>();
  readonly errorMessage = input.required<string>();
  readonly pendingTaskIds = input.required<ReadonlySet<number>>();
  readonly retryRequested = output<void>();
  readonly toggleRequested = output<Task>();
  readonly removeRequested = output<Task>();

  isPending(taskId: number): boolean {
    return this.pendingTaskIds().has(taskId);
  }
}
