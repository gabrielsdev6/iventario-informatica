# Inventário de TI

Mini-dashboard para controlar equipamentos de TI (notebooks, periféricos, equipamentos de rede etc.). Foi feito como desafio técnico de desenvolvimento web full stack.

Você cadastra, edita e remove equipamentos, filtra por categoria e status, busca por nome e vê no topo quantos itens existem em cada status.

## Stack

- Backend: Node.js + Express
- Banco: PostgreSQL
- Frontend: HTML e JavaScript puro, com Tailwind via CDN
- Docker e Docker Compose

Usei Express com SQL direto, sem ORM, porque a API é pequena e prefiro deixar as queries à vista. No frontend fiquei com JS puro: é uma tela só, então um framework e um build seriam mais peso do que ajuda.

## Como rodar

Precisa de Docker e Docker Compose.

```bash
git clone <url-do-repositorio>
cd inventario-ti
docker-compose up -d
```

Abra `http://localhost:3000`. Na primeira execução o Postgres cria a tabela `equipamentos` a partir de `database/init.sql`, e os dados ficam num volume Docker, então sobrevivem a reinicializações.

Para rodar sem Docker, você precisa de um Postgres local:

```bash
npm install
npm start
```

Sem variáveis de ambiente, a aplicação tenta `postgres/postgres` em `localhost:5432`, banco `inventario_db`.

## Variáveis de ambiente

| Variável | Padrão | O que é |
|---|---|---|
| PORT | 3000 | Porta da aplicação |
| DB_HOST | localhost (`db` no Docker) | Host do Postgres |
| DB_PORT | 5432 | Porta do Postgres |
| DB_USER | postgres | Usuário |
| DB_PASSWORD | postgres | Senha |
| DB_NAME | inventario_db | Nome do banco |

O `docker-compose.yml` já define tudo isso. Para trocar usuário, senha ou nome do banco, copie `.env.example` para `.env` e ajuste.

## API

Base: `/api/equipamentos`

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/equipamentos` | Lista. Aceita `search` (nome), `categoria` e `status` |
| POST | `/api/equipamentos` | Cria. Body: `nome`, `quantidade`, `categoria`, `status` |
| PUT | `/api/equipamentos/:id` | Atualiza |
| DELETE | `/api/equipamentos/:id` | Remove |

`status` só aceita `Disponível`, `Em uso` ou `Em manutenção`, e `quantidade` não pode ser negativa. Existe também `GET /health` para checar se a API está no ar.

## Estrutura

```
src/
  config/db.js       pool de conexão com o Postgres
  controllers/       lógica da API
  routes/            rotas do Express
  server.js          ponto de entrada
public/              frontend (HTML + JS)
database/init.sql    schema e dados iniciais
```

## O que eu faria com mais tempo

- Paginação na listagem, que hoje traz tudo de uma vez
- Testes automatizados para os endpoints
- Validação mais completa no backend e mensagens de erro melhores no frontend
- Autenticação, já que hoje qualquer pessoa com acesso à URL pode alterar o inventário
