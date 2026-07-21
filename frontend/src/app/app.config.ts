import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { environment } from '../environments/environment';
import { ApiTaskService } from './core/services/api-task.service';
import { BrowserTaskService } from './core/services/browser-task.service';
import { TaskService } from './core/services/task.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    {
      provide: TaskService,
      useClass: environment.browserStorage ? BrowserTaskService : ApiTaskService
    }
  ]
};
