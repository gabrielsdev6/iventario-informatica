# Inventário de TI

Mini-dashboard para controlar equipamentos de TI (notebooks, periféricos, equipamentos de rede etc.). Foi desenvolvido como desafio técnico de desenvolvimento web full stack.

## Stack

- Backend: Node.js + Express
- Banco de dados: PostgreSQL
- Frontend: HTML e JavaScript puro, com Tailwind CSS via CDN
- Containerização: Docker e Docker Compose

Usei Express com queries SQL diretas, sem ORM, porque a API é pequena e as consultas ficam mais explícitas assim. No frontend, escolhi JS puro em vez de um framework: é uma tela única, e um build só adicionaria complexidade.

## Como rodar

Pré-requisito: Docker e Docker Compose instalados.

```bash
git clone <url-do-repositorio>
cd iventario-ti
docker-compose up -d
```

A aplicação sobe em http://localhost:3000. Na primeira execução, o Postgres cria a tabela `equipamentos` a partir de `database/init.sql`. Os dados ficam em um volume Docker e sobrevivem à reinicialização dos containers.

Para rodar sem Docker, você precisa de um Postgres local:

```bash
npm install
npm start
```

Sem variáveis de ambiente definidas, a aplicação usa `postgres`/`postgres` em `localhost:5432`, no banco `inventario_db`.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta da aplicação |
| `DB_HOST` | `localhost` (`db` dentro do Docker) | Host do Postgres |
| `DB_PORT` | `5432` | Porta do Postgres |
| `DB_USER` | `postgres` | Usuário do banco |
| `DB_PASSWORD` | `postgres` | Senha do banco |
| `DB_NAME` | `inventario_db` | Nome do banco |

O `docker-compose.yml` já define esses valores. Para trocar usuário, senha ou nome do banco, copie `.env.example` para `.env` e edite.

## Endpoints da API

Base: `/api/equipamentos`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/equipamentos` | Lista equipamentos. Aceita os query params `search` (busca por nome), `categoria` e `status` |
| POST | `/api/equipamentos` | Cria um equipamento. Body: `nome`, `quantidade`, `categoria`, `status` |
| PUT | `/api/equipamentos/:id` | Atualiza um equipamento |
| DELETE | `/api/equipamentos/:id` | Remove um equipamento |

O campo `status` aceita apenas `Disponível`, `Em uso` ou `Em manutenção`.

`GET /health` responde se a API está no ar.

## Modelo de dados

Tabela `equipamentos`:

- `id`: serial, chave primária
- `nome`: varchar
- `quantidade`: integer
- `categoria`: varchar
- `status`: varchar
- `created_at` e `updated_at`: timestamp

## Estrutura do projeto

```
src/
  config/db.js      conexão com o Postgres (pool)
  controllers/      regras de negócio da API
  routes/           rotas do Express
  server.js         ponto de entrada
public/             frontend (HTML + JS puro)
database/init.sql   schema e dados iniciais
```

## Funcionalidades

- CRUD completo de equipamentos: cadastro, listagem, edição e exclusão
- Busca por nome e filtros por categoria e status
- Status com cor: verde para Disponível, amarelo para Em uso, vermelho para Em manutenção
- Cards de resumo com o total por status
