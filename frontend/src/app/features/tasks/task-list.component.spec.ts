import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let component: TaskListComponent;
  let taskService: jasmine.SpyObj<TaskService>;

  const task: Task = {
    id: 1,
    title: 'Refatorar projeto',
    completed: false,
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z'
  };

  beforeEach(async () => {
    taskService = jasmine.createSpyObj<TaskService>('TaskService', ['list', 'create', 'update', 'remove']);
    taskService.list.and.returnValue(of([task]));

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [{ provide: TaskService, useValue: taskService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads and displays tasks', () => {
    expect(taskService.list).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Refatorar projeto');
  });

  it('adds a task returned by the API', () => {
    taskService.create.and.returnValue(of(task));
    component.tasks.set([]);
    component.taskTitle.setValue(task.title);

    component.addTask();

    expect(taskService.create).toHaveBeenCalledWith({ title: task.title });
    expect(component.tasks()).toEqual([task]);
  });

  it('submits a task when the add button is clicked', () => {
    taskService.create.and.returnValue(of(task));
    component.tasks.set([]);

    const input: HTMLInputElement = fixture.nativeElement.querySelector('#task-title');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.button--primary');
    input.value = task.title;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    button.click();

    expect(taskService.create).toHaveBeenCalledWith({ title: task.title });
    expect(component.tasks()).toEqual([task]);
  });

  it('does not create a fake task when the API fails', () => {
    taskService.create.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    component.tasks.set([]);
    component.taskTitle.setValue('Tarefa inválida');

    component.addTask();
    fixture.detectChanges();

    expect(component.tasks()).toEqual([]);
    expect(component.errorMessage()).toContain('Não foi possível');
    expect(fixture.nativeElement.textContent).not.toContain('Tudo em dia');
  });
});
