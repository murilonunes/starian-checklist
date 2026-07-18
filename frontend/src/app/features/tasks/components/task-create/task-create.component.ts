import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, inject, output, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Task } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';

@Component({
  selector: 'app-task-create',
  imports: [ReactiveFormsModule],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCreateComponent {
  private readonly taskService = inject(TaskService);

  @ViewChild('taskDialog') private taskDialog?: ElementRef<HTMLDialogElement>;

  readonly taskCreated = output<Task>();
  readonly titleControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(255)]
  });
  readonly taskForm = new FormGroup({ title: this.titleControl });
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  openDialog(): void {
    const dialog = this.taskDialog?.nativeElement;

    if (dialog && !dialog.open) {
      this.errorMessage.set('');
      dialog.showModal();
    }
  }

  closeDialog(): void {
    const dialog = this.taskDialog?.nativeElement;

    if (dialog?.open) {
      dialog.close();
      return;
    }

    this.resetForm();
  }

  closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.saving()) {
      this.closeDialog();
    }
  }

  resetForm(): void {
    this.taskForm.reset();
    this.errorMessage.set('');
  }

  submit(): void {
    const title = this.titleControl.value.trim();

    if (!title) {
      this.titleControl.setErrors({ required: true });
      this.titleControl.markAsTouched();
      return;
    }

    if (this.titleControl.invalid || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    this.taskService.create({ title })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (task) => {
          this.taskCreated.emit(task);
          this.closeDialog();
        },
        error: (error: HttpErrorResponse) => this.showError(error)
      });
  }

  private showError(error: HttpErrorResponse): void {
    const message = error.status === 0
      ? 'Não foi possível conectar. Verifique sua conexão e tente novamente.'
      : 'Não foi possível adicionar a tarefa. Tente novamente.';

    this.errorMessage.set(message);
  }
}
