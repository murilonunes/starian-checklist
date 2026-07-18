import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskHeaderComponent } from './task-header.component';

describe('TaskHeaderComponent', () => {
  let fixture: ComponentFixture<TaskHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaskHeaderComponent] }).compileComponents();
    fixture = TestBed.createComponent(TaskHeaderComponent);
  });

  it('displays the pending task count', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.componentRef.setInput('hasError', false);
    fixture.componentRef.setInput('remainingCount', 2);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('2');
    expect(fixture.nativeElement.textContent).toContain('pendentes');
  });
});
