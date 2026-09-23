# SchoolBlog Mobile

App mobile em **React Native (Expo)** do blog educacional SchoolBlog — **Tech Challenge Fase 04** da Pós-Tech Full Stack Development (FIAP).

Consome a API REST [`schoolblog-api`](https://github.com/GabAlmeida29/schoolblog-api) (Node.js + Express + Prisma + PostgreSQL), a mesma usada pelo front web [`schoolblog-frontend`](https://github.com/GabAlmeida29/schoolblog-frontend).

## Sumário

- [Requisitos atendidos](#requisitos-atendidos)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Setup inicial](#setup-inicial)
- [Rodando no celular com hot reload](#rodando-no-celular-com-hot-reload)
- [Guia de uso](#guia-de-uso)
- [Testes e qualidade](#testes-e-qualidade)
- [Decisões técnicas e desafios](#decisões-técnicas-e-desafios)

## Requisitos atendidos

| # | Requisito | Onde |
| - | --------- | ---- |
| 1 | Lista de posts (título, autor, descrição) + busca por palavra-chave | `src/app/(tabs)/index.tsx` |
| 2 | Leitura do post completo + comentários (opcional) | `src/app/posts/[id]/index.tsx` |
| 3 | Criação de postagens (professor) | `src/app/posts/new.tsx` → `src/screens/PostFormScreen.tsx` |
| 4 | Edição de postagens com dados carregados | `src/app/posts/[id]/edit.tsx` → `PostFormScreen` |
| 5 | Cadastro de professores | `src/app/teachers/new.tsx` → `src/screens/UserFormScreen.tsx` |
| 6 | Edição de professores | `src/app/teachers/[id].tsx` → `UserFormScreen` |
| 7 | Listagem paginada de professores com editar/excluir | `src/app/(tabs)/teachers.tsx` → `src/screens/UserListScreen.tsx` |
| 8 | Itens 5, 6 e 7 para alunos | `src/app/students/*`, `src/app/(tabs)/students.tsx` |
| 9 | Página administrativa de posts (editar/excluir) | `src/app/(tabs)/admin.tsx` |
| 10 | Login e bloqueio de páginas de criação/edição/admin | `src/app/login.tsx`, `src/app/_layout.tsx` (`Stack.Protected`) |

Requisitos técnicos: React Native com **componentes funcionais e hooks**, estilização própria (mesma identidade visual do front web), integração com os endpoints REST de **posts, alunos, professores e autenticação**, permissões por papel (professor edita/cria, aluno só visualiza) e estado global com **Context API**.

## Stack

| Camada | Tecnologia |
| ------ | ---------- |
| Framework | Expo SDK 57 · React Native 0.86 · React 19 · TypeScript |
| Navegação | Expo Router (rotas por arquivo, `Stack` + `Tabs`, `Stack.Protected`) |
| Estado global | Context API (`AuthContext`) |
| Dados remotos | Axios + TanStack Query (cache, refetch, paginação infinita) |
| Formulários | React Hook Form + Zod (mesmas regras de validação da API) |
| Sessão | `expo-secure-store` (JWT no Keychain/Keystore) |
| Testes | Jest (`jest-expo`) + React Native Testing Library |
| Lint | ESLint (`eslint-config-expo`) |

## Arquitetura

```
src/
├── app/                      # Rotas (Expo Router) — cada arquivo é uma tela
│   ├── _layout.tsx           # Providers + Stack com rotas protegidas por papel
│   ├── login.tsx
│   ├── (tabs)/               # Abas: Posts, Admin*, Professores*, Alunos*, Perfil  (*professor)
│   ├── posts/new.tsx, posts/[id]/index.tsx, posts/[id]/edit.tsx
│   ├── teachers/new.tsx, teachers/[id].tsx
│   └── students/new.tsx, students/[id].tsx
├── screens/                  # Telas reutilizadas por mais de uma rota (form de post, lista/form de usuários)
├── components/               # UI: Button, FormField, PostCard, SearchBar, Fab, StateViews...
├── contexts/AuthContext.tsx  # Usuário logado, login/logout, restauração de sessão
├── hooks/                    # usePosts, useUsers (TanStack Query), useDebounce
├── api/                      # client.ts (axios + interceptors) e services.ts (endpoints)
├── schemas/                  # Schemas Zod dos formulários
├── config/env.ts             # Resolução da URL da API
├── storage/tokenStorage.ts   # SecureStore (fallback localStorage no web)
├── theme/theme.ts            # Cores, espaçamentos, tipografia
├── types/                    # Tipos compartilhados (Post, User, Paginated...)
└── __tests__/                # Testes unitários e de componentes
```

**Fluxo de dados:** Tela → hook (`usePosts`, `useUsers`) → `services.ts` → `client.ts` (axios, injeta `Authorization: Bearer <jwt>`) → API. Mutations invalidam o cache do TanStack Query, então listas são atualizadas automaticamente após criar/editar/excluir.

**Autenticação e autorização (duas camadas):**

1. **App:** `AuthContext` guarda o usuário; o `_layout.tsx` usa `Stack.Protected`/`Tabs.Protected` — sem login só existe a tela de login; aluno não tem as rotas nem as abas de criação/edição/admin (nem via deep link). Na abertura do app a sessão é restaurada do SecureStore e validada em `GET /auth/me`. Qualquer resposta 401 (token expirado) faz logout automático.
2. **API:** o back-end valida o JWT e o papel (`authorize('PROFESSOR')`) em todas as rotas de escrita e administrativas — a proteção do app é de UX, a de segurança está no servidor.

**Endpoints consumidos:**

| Recurso | Endpoints |
| ------- | --------- |
| Auth | `POST /auth/login`, `GET /auth/me` |
| Posts | `GET /posts`, `GET /posts/search?q=`, `GET /posts/:id`, `POST /posts`, `PUT /posts/:id`, `DELETE /posts/:id` |
| Comentários | `GET/POST /posts/:id/comments` |
| Professores | `GET /teachers?page=&limit=`, `GET/PUT/DELETE /teachers/:id`, `POST /teachers` |
| Alunos | `GET /students?page=&limit=`, `GET/PUT/DELETE /students/:id`, `POST /students` |

## Setup inicial

Pré-requisitos: Node.js 20+, npm, Docker, e o app **Expo Go** no celular (App Store / Google Play).

```bash
# 1. API (outro terminal) — ver README do schoolblog-api
cd ../schoolblog-api
npm install
docker compose up -d db
npx prisma migrate deploy
npm run dev            # com AUTO_SEED=true no .env para ter usuários de demonstração

# 2. App
cd ../schoolblog-mobile
npm install
npx expo start
```

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| -------- | ----------- | --------- |
| `EXPO_PUBLIC_API_URL` | não | URL da API. Se ausente, o app usa o **IP do computador que roda o Metro** (o mesmo do QR Code) na porta 3000. Defina ao usar `--tunnel` ou API em outra máquina. |

```bash
cp .env.example .env   # opcional
```

## Rodando no celular com hot reload

1. Celular e Mac **na mesma rede Wi-Fi** (redes corporativas/"guest" costumam bloquear tráfego entre dispositivos).
2. API rodando (`npm run dev` no `schoolblog-api`). Teste no navegador do **celular**: `http://<IP-do-Mac>:3000/health` deve responder `{"status":"ok"}`.
3. No app: `npx expo start` e escaneie o QR Code:
   - **iPhone:** câmera nativa → abre no Expo Go.
   - **Android:** app Expo Go → "Scan QR code".
4. Edite qualquer arquivo em `src/` e salve: o **Fast Refresh** atualiza o app no celular em ~1s mantendo o estado da tela.
5. Atalhos no terminal do Expo: `r` recarrega, `m` abre o menu de dev, `j` abre o debugger, `shift+m` mais ferramentas. No celular, **agitar o aparelho** abre o menu de dev.

Rede bloqueada? `npm run start:tunnel` + `EXPO_PUBLIC_API_URL` apontando para uma URL pública da API (ex.: ngrok).

Descobrir o IP do Mac: `ipconfig getifaddr en0`.

## Guia de uso

Credenciais de demonstração (criadas pelo seed da API):

| Perfil | E-mail | Senha | Pode |
| ------ | ------ | ----- | ---- |
| Professor(a) | `professor@schoolblog.com` | `docente123` | tudo: posts, admin, professores, alunos |
| Aluno(a) | `aluno@schoolblog.com` | `aluno123` | ler posts, buscar e comentar |

Em modo desenvolvimento, a tela de login tem atalhos que preenchem essas credenciais.

- **Posts:** lista com busca (debounce de 400 ms, busca full-text da API), puxar para atualizar, toque no card para ler. Professor vê o botão `+` para criar.
- **Leitura:** conteúdo completo, comentários e formulário de comentário (autor = usuário logado). Professor vê o ícone de edição no cabeçalho.
- **Admin:** todas as publicações com editar/excluir (confirmação antes de excluir).
- **Professores / Alunos:** lista paginada (10 por página, carrega a próxima ao rolar), editar, excluir e `+` para cadastrar. Na edição, senha em branco mantém a atual. O próprio usuário não pode se excluir.
- **Perfil:** dados do usuário, papel, URL da API em uso e botão Sair.

## Testes e qualidade

```bash
npm test            # Jest + React Native Testing Library
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint (expo)
```

Cobertura dos testes: schemas de validação, tratamento de erros da API, formatação, `PostCard`, tela de login (validação, envio e erro) e `AuthContext` (login professor/aluno, restauração e descarte de sessão).

## Decisões técnicas e desafios

- **Expo Router + `Stack.Protected`:** as rotas protegidas são declaradas por papel no layout. Quando o usuário faz login/logout, o navegador troca de pilha sozinho — não há `navigate('/login')` espalhado pelas telas.
- **URL da API no celular:** `localhost` no celular é o próprio celular. O app lê o `hostUri` do Expo (IP do Mac que serviu o bundle) e monta `http://<ip>:3000`, então funciona na mesma rede sem configurar nada.
- **Back-end sem autenticação na Fase 02:** a Fase 04 exigiu adicionar ao `schoolblog-api` o model `User` (professor/aluno), login JWT com bcrypt, middlewares de autenticação/autorização e os CRUDs paginados de professores e alunos. As rotas de escrita de posts passaram a exigir professor.
- **Uma tela, várias rotas:** professores e alunos compartilham `UserListScreen`/`UserFormScreen` (parametrizados por `kind`), mas cada requisito tem sua rota própria.
- **JWT no SecureStore** em vez de AsyncStorage: o token fica no Keychain (iOS) / Keystore (Android).
- **Versões compatíveis:** dependências nativas instaladas com `npx expo install` para casar com o SDK 57 do Expo Go.

## Equipe

- Gabriel Franco de Almeida — RM370570

## Licença

MIT
