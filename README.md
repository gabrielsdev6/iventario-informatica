# Inventário de TI

Mini-dashboard para controle de equipamentos de TI (notebooks, periféricos, equipamentos de rede etc.), desenvolvido como desafio técnico de desenvolvimento web full stack.

## Stack

- Backend: Node.js + Express
- Banco de dados: PostgreSQL
- Frontend: HTML e JavaScript puro, com Tailwind CSS via CDN
- Containerização: Docker e Docker Compose

Optei por Express com queries SQL diretas (sem ORM) porque o escopo da API é pequeno e as consultas ficam mais explícitas assim. No frontend, JS puro em vez de um framework, já que a aplicação é uma tela única e não justificaria a complexidade extra de um build.

## Como rodar

Pré-requisito: Docker e Docker Compose instalados.

```bash
git clone <url-do-repositorio>
cd iventario-ti
docker-compose up -d
A aplicação fica disponível em http://localhost:3000. Na primeira execução, o Postgres cria a tabela equipamentos automaticamente a partir de database/init.sql, e os dados persistem em um volume Docker entre reinicializações dos containers.

Para rodar sem Docker (é preciso ter um Postgres local disponível):

npm install
npm start
Nesse caso, sem variáveis de ambiente definidas, a aplicação assume postgres/postgres em localhost:5432, banco inventario_db.

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| PORT | 3000 | Porta da aplicação |
| DB_HOST | localhost (db dentro do Docker) | Host do Postgres |
| DB_PORT | 5432 | Porta do Postgres |
| DB_USER | postgres | Usuário do banco |
| DB_PASSWORD | postgres | Senha do banco |
| DB_NAME | inventario_db | Nome do banco |

O docker-compose.yml já define esses valores; para sobrescrever usuário/senha/nome do banco, copie .env.example para .env e ajuste.

## Endpoints da API

Base: /api/equipamentos

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/equipamentos | Lista equipamentos. Aceita os query params search (busca por nome), categoria e status |
| POST | /api/equipamentos | Cria um equipamento. Body: nome, quantidade, categoria, status |
| PUT | /api/equipamentos/:id | Atualiza um equipamento existente |
| DELETE | /api/equipamentos/:id | Remove um equipamento |

status aceita apenas Disponível, Em uso ou Em manutenção.

Há também um GET /health para checar se a API está no ar.

## Modelo de dados

Tabela equipamentos (definida em database/init.sql):

id — serial, chave primária
nome — varchar
quantidade — integer, não pode ser negativo
categoria — varchar
status — varchar, restrito aos três valores citados acima
created_at / updated_at — timestamp
## Estrutura do projeto

src/
  config/db.js         conexão com o Postgres (pool)
  controllers/          regras de negócio da API
  routes/                definição das rotas do Express
  server.js              ponto de entrada da aplicação
public/                  frontend (HTML + JS puro)
database/init.sql        schema e dados iniciais
## Funcionalidades implementadas

CRUD completo de equipamentos (cadastro, listagem, edição e exclusão)
Filtro por categoria e status, e busca por nome
Indicação visual do status por cor (verde para disponível, amarelo para em uso, vermelho para em manutenção)
Cards de resumo com totais por status
```