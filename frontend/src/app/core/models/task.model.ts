export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
}

export interface UpdateTaskPayload {
  title?: string;
  completed?: boolean;
}
