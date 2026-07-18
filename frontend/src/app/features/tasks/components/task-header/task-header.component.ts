import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-task-header',
  templateUrl: './task-header.component.html',
  styleUrl: './task-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHeaderComponent {
  readonly loading = input.required<boolean>();
  readonly hasError = input.required<boolean>();
  readonly remainingCount = input.required<number>();
}
