import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Task } from '../../../../core/models/task.model';
import { TaskItemComponent } from './task-item.component';

describe('TaskItemComponent', () => {
  let fixture: ComponentFixture<TaskItemComponent>;
  let component: TaskItemComponent;

  const task: Task = {
    id: 1,
    title: 'Refatorar projeto',
    completed: false,
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaskItemComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', task);
    fixture.componentRef.setInput('pending', false);
    fixture.detectChanges();
  });

  it('emits the task when its checkbox changes', () => {
    spyOn(component.toggleRequested, 'emit');
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');

    checkbox.dispatchEvent(new Event('change'));

    expect(component.toggleRequested.emit).toHaveBeenCalledWith(task);
  });

  it('emits the task when removal is requested', () => {
    spyOn(component.removeRequested, 'emit');
    const removeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.button--remove');

    removeButton.click();

    expect(component.removeRequested.emit).toHaveBeenCalledWith(task);
  });
});
