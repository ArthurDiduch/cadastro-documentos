# Cadastro Documentos API

API RESTful em Node.js + TypeScript (NestJS) para gerenciamento de documentação de colaboradores.

## Stack

- Node.js
- TypeScript
- NestJS
- TypeORM
- PostgreSQL
- Swagger (`/docs` em ambiente nao-producao)

## Modulo Implementado (Employee)

Endpoints disponiveis:

- `POST /employees` - cadastra colaborador
- `GET /employees/:id` - busca colaborador por id
- `GET /employees` - lista paginada com filtros
- `PATCH /employees/:id` - atualiza colaborador ativo
- `DELETE /employees/:id` - soft delete
- `PATCH /employees/:id/reactivate` - reativa colaborador removido logicamente

### Regras aplicadas no modulo

- Unicidade de `email` e `registration`
- Soft delete com `deletedAt`
- Reativacao preservando historico
- Tratamento padronizado de erros com `ApplicationErrorFilter`

## Filtros de listagem (`GET /employees`)

Query params suportados:

- `page` (default `1`)
- `limit` (default `10`, max `100`)
- `name` (contains, case-insensitive)
- `email` (contains, case-insensitive)
- `registration` (contains, case-insensitive)
- `isActive` (`true` | `false`; omitido = todos)

Exemplo:

```bash
curl "http://localhost:3000/employees?page=1&limit=10&name=arthur&isActive=true"
```

## Estrutura de erro

Respostas de erro seguem formato:

```json
{
  "statusCode": 409,
  "error": "EMPLOYEE_EMAIL_ALREADY_EXISTS",
  "message": "Employee email already exists.",
  "path": "/employees",
  "timestamp": "2026-03-10T12:00:00.000Z"
}
```

## Como rodar (Local)

### 1. Pre-requisitos

- Node.js 22+
- pnpm 10+
- PostgreSQL 16+

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variaveis de ambiente

Crie um arquivo `.env` na raiz:

```env
NODE_ENV=development
APP_PORT=3000

DB_PG_HOST=localhost
DB_PG_PORT=5432
DB_PG_USERNAME=postgres
DB_PG_PASSWORD=postgres
DB_PG_NAME=cadastro_documentos
DB_PG_SCHEMA=public
DB_PG_SYNCHRONIZE=true
```

### 4. Subir aplicacao

```bash
pnpm run start:dev
```

## Como rodar (Docker)

Com `docker` e `docker compose` instalados:

```bash
docker compose up --build
```

## Swagger

- URL: `http://localhost:3000/docs`
- Disponivel quando `NODE_ENV != production`

## Testes

### Unitarios

```bash
pnpm test
```

### E2E

```bash
pnpm test:e2e
```

### Cobertura

```bash
pnpm test:cov
```

## Scripts uteis

- `pnpm build` - build de producao
- `pnpm run start` - start padrao
- `pnpm run start:dev` - desenvolvimento com watch
- `pnpm run start:prod` - executa `dist/main`
- `pnpm run lint` - lint + fix

## Observacoes

- O projeto esta com foco inicial no modulo `employee`.
- Proximos modulos (tipos de documento, vinculacoes, historico/versionamento e estatisticas) podem reaproveitar o mesmo padrao de arquitetura.
