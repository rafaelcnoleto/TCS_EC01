# EC01 - Gerenciamento de Alunos (DevTech Academy)

Sistema de CRUD de alunos em JavaScript puro (HTML + JS), com dados em memória e relatórios.

## Estrutura

| Arquivo | Descrição |
|---|---|
| `index.html` | Formulário, tabela e botões de relatórios (sem CSS) |
| `aluno.js` | Classe `Aluno` (construtor, `isAprovado()`, `toString()`) |
| `app.js` | CRUD, eventos (`addEventListener`), arrow functions e relatórios |
| `Dockerfile` | Imagem Nginx servindo os arquivos estáticos |
| `docker-compose.yml` | Ambiente de desenvolvimento com volumes |

## Como executar com Docker

```bash
docker compose up --build
```

Acesse: http://localhost:8080

Para parar: `docker compose down`

## Funcionalidades

- Cadastrar, listar, editar e excluir alunos (dados em um array de objetos `Aluno`)
- Mensagens com `alert()` e `console.log()` ao salvar, editar e excluir
- Relatórios: aprovados (`filter`), média das notas e idades (`map` + `reduce`),
  nomes em ordem alfabética (`sort`) e quantidade por curso (`reduce` + `forEach`)

## Versionamento (GitHub)

```bash
git init
git add .
git commit -m "EC01: gerenciamento de alunos em JavaScript"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/estudo-caso-alunos.git
git push -u origin main
```
