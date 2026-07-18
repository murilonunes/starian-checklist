import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task } from '../../../../core/models/task.model';
import { TaskCollectionComponent } from './task-collection.component';

describe('TaskCollectionComponent', () => {
  let fixture: ComponentFixture<TaskCollectionComponent>;

  const task: Task = {
    id: 1,
    title: 'Refatorar projeto',
    completed: false,
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaskCollectionComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaskCollectionComponent);
  });

  it('renders the collection and its total', () => {
    fixture.componentRef.setInput('tasks', [task]);
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('errorMessage', '');
    fixture.componentRef.setInput('pendingTaskIds', new Set<number>());
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('1 item');
    expect(fixture.nativeElement.textContent).toContain(task.title);
  });
});
