import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'li[app-task-item]',
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.task-item--completed]': 'task().completed'
  }
})
export class TaskItemComponent {
  readonly task = input.required<Task>();
  readonly pending = input(false);
  readonly toggleRequested = output<Task>();
  readonly removeRequested = output<Task>();
}
