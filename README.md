# Starian Checklist

[![CI](https://github.com/murilonunes/starian-checklist/actions/workflows/ci.yml/badge.svg)](https://github.com/murilonunes/starian-checklist/actions/workflows/ci.yml)

Refatoração da lista de tarefas, com Angular 20 no frontend e Laravel 13 no backend.

O trabalho foi direcionado para melhorar a organização do código, corrigir o fluxo de criação das tarefas e deixar o ambiente de desenvolvimento reproduzível.

## O que foi feito

- O backend foi organizado em Controller, Form Requests, API Resource e Model, separando validação, persistência e resposta HTTP.
- O armazenamento em arquivo JSON foi substituído por SQLite, evitando manipulação manual de arquivos e oferecendo uma persistência mais confiável.
- A API passou a disponibilizar um CRUD REST para listar, criar, atualizar e excluir tarefas.
- O projeto foi atualizado para Laravel 13 com PHP 8.3.
- O frontend foi atualizado para Angular 20 e separado em modelos, serviço HTTP e componentes por responsabilidade: cabeçalho, criação, coleção e item de tarefa.
- O estado da tela utiliza Signals e `OnPush`, reduzindo atualizações desnecessárias e mantendo o fluxo mais previsível.
- Foram tratados carregamento, validação, operações pendentes e falhas de comunicação com a API.
- A interface foi refeita para funcionar em diferentes tamanhos de tela e oferecer controles acessíveis.
- O Docker Compose foi ajustado para utilizar `npm ci`, SQLite e volumes próprios para `vendor` e `node_modules`.
- Foram adicionados testes para os endpoints do backend, o serviço HTTP e as principais interações do frontend.

## Execução

Com Docker Desktop em execução:

```bash
docker compose up --build
```

Após a inicialização:

- Frontend: http://localhost:4200
- API: http://localhost:8000/api/tasks
- Status do backend: http://localhost:8000

## Testes

Backend:

```bash
cd backend
php artisan test
```

Frontend:

```bash
cd frontend
npm test -- --watch=false --browsers=ChromeHeadless
npm run build
```

Os testes do backend utilizam SQLite em memória e não alteram o banco usado no desenvolvimento.

## Integração contínua

O GitHub Actions valida cada pull request e atualização da branch `main`. A esteira executa os testes e as verificações de qualidade do Laravel e do Angular, audita as dependências, gera o frontend e confirma a construção das imagens com Docker Compose.

O build do frontend fica disponível por sete dias como artefato da execução. Não há publicação de imagens nem implantação em produção. O Dependabot verifica semanalmente as dependências do Composer, npm, Docker e das próprias Actions.
