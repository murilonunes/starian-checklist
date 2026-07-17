<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_lists_tasks(): void
    {
        Task::query()->create(['title' => 'Escrever testes']);

        $this->getJson('/api/tasks')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.title', 'Escrever testes')
            ->assertJsonPath('0.completed', false);
    }

    public function test_it_creates_a_task(): void
    {
        $this->postJson('/api/tasks', ['title' => 'Refatorar API'])
            ->assertCreated()
            ->assertJsonPath('title', 'Refatorar API')
            ->assertJsonPath('completed', false);

        $this->assertDatabaseHas('tasks', [
            'title' => 'Refatorar API',
            'completed' => false,
        ]);
    }

    public function test_it_validates_a_task_title(): void
    {
        $this->postJson('/api/tasks', ['title' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('title');
    }

    public function test_it_updates_a_task(): void
    {
        $task = Task::query()->create(['title' => 'Publicar projeto']);

        $this->patchJson("/api/tasks/{$task->id}", ['completed' => true])
            ->assertOk()
            ->assertJsonPath('completed', true);

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'completed' => true,
        ]);
    }

    public function test_it_deletes_a_task(): void
    {
        $task = Task::query()->create(['title' => 'Remover tarefa']);

        $this->deleteJson("/api/tasks/{$task->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    public function test_it_returns_not_found_for_an_unknown_task(): void
    {
        $this->getJson('/api/tasks/999')->assertNotFound();
    }
}
