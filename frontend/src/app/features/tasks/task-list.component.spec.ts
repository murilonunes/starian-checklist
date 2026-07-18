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
    expect(fixture.nativeElement.textContent).toContain(task.title);
  });

  it('adds a task emitted by the creation component', () => {
    component.tasks.set([]);

    component.addCreatedTask(task);

    expect(component.tasks()).toEqual([task]);
  });

  it('updates a task returned by the API', () => {
    const completedTask = { ...task, completed: true };
    taskService.update.and.returnValue(of(completedTask));

    component.toggleTask(task);

    expect(taskService.update).toHaveBeenCalledWith(task.id, { completed: true });
    expect(component.tasks()).toEqual([completedTask]);
  });

  it('shows a load error without creating local data', () => {
    taskService.list.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    component.loadTasks();
    fixture.detectChanges();

    expect(component.tasks()).toEqual([task]);
    expect(component.errorMessage()).toContain('Não foi possível');
  });
});
