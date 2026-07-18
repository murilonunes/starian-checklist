import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Task } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';
import { TaskCreateComponent } from './task-create.component';

describe('TaskCreateComponent', () => {
  let fixture: ComponentFixture<TaskCreateComponent>;
  let component: TaskCreateComponent;
  let taskService: jasmine.SpyObj<TaskService>;

  const task: Task = {
    id: 1,
    title: 'Refatorar projeto',
    completed: false,
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z'
  };

  beforeEach(async () => {
    taskService = jasmine.createSpyObj<TaskService>('TaskService', ['create']);

    await TestBed.configureTestingModule({
      imports: [TaskCreateComponent],
      providers: [{ provide: TaskService, useValue: taskService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates a task and emits the API response', () => {
    taskService.create.and.returnValue(of(task));
    spyOn(component.taskCreated, 'emit');
    component.titleControl.setValue(task.title);

    component.submit();

    expect(taskService.create).toHaveBeenCalledWith({ title: task.title });
    expect(component.taskCreated.emit).toHaveBeenCalledWith(task);
    expect(component.titleControl.value).toBe('');
  });

  it('keeps the form open and reports an API error', () => {
    taskService.create.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    component.titleControl.setValue(task.title);

    component.submit();

    expect(component.errorMessage()).toContain('Não foi possível adicionar');
  });
});
