import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';
import { ApiTaskService } from './api-task.service';

describe('ApiTaskService', () => {
  let service: ApiTaskService;
  let http: HttpTestingController;
  const endpoint = `${environment.apiUrl}/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ApiTaskService]
    });

    service = TestBed.inject(ApiTaskService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads tasks', () => {
    const tasks: Task[] = [{
      id: 1,
      title: 'Testar aplicação',
      completed: false,
      createdAt: '2026-07-17T00:00:00.000Z',
      updatedAt: '2026-07-17T00:00:00.000Z'
    }];

    service.list().subscribe((response) => expect(response).toEqual(tasks));

    const request = http.expectOne(endpoint);
    expect(request.request.method).toBe('GET');
    request.flush(tasks);
  });

  it('updates a task', () => {
    service.update(3, { completed: true }).subscribe();

    const request = http.expectOne(`${endpoint}/3`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ completed: true });
    request.flush({});
  });
});
