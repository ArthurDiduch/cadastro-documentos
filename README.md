# Cadastro Documentos API

API RESTful em Node.js + TypeScript (NestJS) para gerenciamento de documentação de colaboradores.

## Stack

- Node.js
- TypeScript
- NestJS
- TypeORM
- PostgreSQL
- Swagger (`/docs` em ambiente nao-producao)

## Modulos Implementados

### Employee

Endpoints disponiveis:

- `POST /employees` - cadastra colaborador
- `GET /employees/:id` - busca colaborador por id
- `GET /employees` - lista paginada com filtros
- `PATCH /employees/:id` - atualiza colaborador ativo
- `DELETE /employees/:id` - soft delete
- `PATCH /employees/:id/reactivate` - reativa colaborador removido logicamente

### Document Type

Endpoints disponiveis:

- `POST /document-types` - cadastra tipo de documento
- `GET /document-types/:id` - busca tipo de documento por id
- `GET /document-types` - lista paginada com filtros
- `PATCH /document-types/:id` - atualiza tipo de documento ativo
- `DELETE /document-types/:id` - soft delete
- `PATCH /document-types/:id/reactivate` - reativa tipo de documento removido logicamente

### Document Submission

Endpoints disponiveis:

- `POST /document-submissions` - envio logico de documento com versionamento
- `GET /document-submissions/pending` - lista documentos pendentes com paginacao e filtros

### Employee Document Type

Endpoints disponiveis:

- `POST /employee-document-types` - vincula colaborador a tipo de documento (atomico)
- `DELETE /employee-document-types` - desvincula colaborador de tipo de documento (atomico)

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

## Filtros de listagem (`GET /document-submissions/pending`)

Query params suportados:

- `page` (default `1`)
- `limit` (default `10`, max `100`)
- `employeeId` (UUID exato)
- `employeeName` (contains, case-insensitive)
- `documentTypeId` (UUID exato)
- `documentTypeName` (contains, case-insensitive)

Exemplo:

```bash
curl "http://localhost:3000/document-submissions/pending?page=1&limit=10&employeeName=arthur&documentTypeName=rg"
```

## Envio logico de documento (`POST /document-submissions`)

Exemplo de payload:

```json
{
  "employeeId": "e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973",
  "documentTypeId": "09f10f9e-c13a-4c1b-a84d-559d371f040b",
  "fileName": "rg-frente.pdf",
  "fileReference": "s3://bucket/documents/employee-1/rg-v1.pdf"
}
```

Regras aplicadas:

- Cada novo envio cria uma nova versao
- Apenas uma versao fica ativa (`isCurrent = true`) por colaborador + tipo de documento
- A troca de versao e feita em transacao
- Ao enviar uma nova versao, a pendencia do vinculo e fechada no mesmo fluxo transacional

## Vinculacao atomica (`POST/DELETE /employee-document-types`)

Exemplo de payload:

```json
{
  "employeeId": "e7d0f8fd-d6a8-4d2d-8add-f55ea8c2e973",
  "documentTypeId": "09f10f9e-c13a-4c1b-a84d-559d371f040b"
}
```

Regras aplicadas:

- Ao vincular, o sistema cria/reativa a pendencia de forma atomica
- Ao desvincular, o sistema fecha (soft delete) o vinculo e a pendencia no mesmo fluxo atomico
- A listagem de pendencias considera somente os registros ativos de `pending_documents`

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

- Modulos `employee`, `document-type`, `document-submission` e `employee-document-type` seguem o mesmo padrao de arquitetura.
- Ainda falta implementar estatisticas gerais.
