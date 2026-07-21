import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { BrowserTaskService } from './browser-task.service';

describe('BrowserTaskService', () => {
  let service: BrowserTaskService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [BrowserTaskService] });
    service = TestBed.inject(BrowserTaskService);
  });

  afterEach(() => localStorage.clear());

  it('persists the task lifecycle in the browser', async () => {
    const createdTask = await firstValueFrom(service.create({ title: 'Publicar demonstracao' }));

    expect(await firstValueFrom(service.list())).toEqual([createdTask]);

    const updatedTask = await firstValueFrom(service.update(createdTask.id, { completed: true }));

    expect(updatedTask.completed).toBeTrue();
    expect(await firstValueFrom(service.list())).toEqual([updatedTask]);

    await firstValueFrom(service.remove(createdTask.id));

    expect(await firstValueFrom(service.list())).toEqual([]);
  });

  it('ignores invalid stored data', async () => {
    localStorage.setItem('starian-checklist.tasks', JSON.stringify([{ id: 'invalid' }]));

    expect(await firstValueFrom(service.list())).toEqual([]);
  });
});
