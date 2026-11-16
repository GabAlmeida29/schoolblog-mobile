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
| 1 | Página inicial com lista de posts (título, autor, descrição) e busca | `src/app/(tabs)/index.tsx` |
| 2 | Leitura do post completo + comentários | `src/app/posts/[id]/index.tsx` |
| 3 | Criação de postagens (professor) | `src/app/posts/new.tsx` → `src/screens/PostFormScreen.tsx` |
| 4 | Edição de postagens com dados carregados | `src/app/posts/[id]/edit.tsx` → `PostFormScreen` |
| 5 | Cadastro de professores | `src/app/teachers/new.tsx` → `src/screens/UserFormScreen.tsx` |
| 6 | Edição de professores | `src/app/teachers/[id].tsx` → `UserFormScreen` |
| 7 | Listagem paginada de professores com editar/excluir | `src/app/(tabs)/teachers.tsx` → `src/screens/UserListScreen.tsx` |
| 8 | Itens 5, 6 e 7 para alunos | `src/app/students/*`, `src/app/(tabs)/students.tsx` |
| 9 | Página administrativa de posts (visualizar, editar, excluir) | `src/app/(tabs)/manage.tsx` |
| 10 | Login e bloqueio das páginas de criação/edição/administração | `src/app/login.tsx`, `src/app/_layout.tsx` (`Stack.Protected`) |

Requisitos técnicos: React Native com **componentes funcionais e hooks**, identidade visual própria, integração com os endpoints REST de **posts, alunos, professores e autenticação**, permissões por papel (professor cria/edita, aluno só visualiza e comenta) e estado global com **Context API**.

## Stack

| Camada | Tecnologia |
| ------ | ---------- |
| Framework | Expo SDK 57 · React Native 0.86 · React 19 · TypeScript |
| Navegação | Expo Router (rotas por arquivo, `Stack` + `Tabs`, `Stack.Protected`) |
| Estado global | Context API (`AuthContext`, `ToastContext`) |
| Dados remotos | Axios + TanStack Query (cache, refetch, paginação infinita) |
| Formulários | React Hook Form + Zod (mesmas regras da API) |
| Interface | Componentes nativos do iOS (large titles, listas agrupadas, sheets, action sheets), SF Symbols via `expo-symbols`, modo claro/escuro, `expo-haptics` |
| Sessão | `expo-secure-store` (JWT no Keychain/Keystore) |
| Testes | Jest (`jest-expo`) + React Native Testing Library |
| Lint | ESLint (`eslint-config-expo`) |

## Arquitetura

```
src/
├── app/                      # Rotas (Expo Router) — cada arquivo é uma tela
│   ├── _layout.tsx           # Fontes, providers e Stack com rotas protegidas por papel
│   ├── login.tsx
│   ├── account.tsx           # Edição dos próprios dados (nome, telefone, senha)
│   ├── (tabs)/               # Início, Gerenciar*, Professores*, Alunos*, Perfil  (*professor)
│   ├── posts/new.tsx, posts/[id]/index.tsx, posts/[id]/edit.tsx
│   ├── teachers/new.tsx, teachers/[id].tsx
│   └── students/new.tsx, students/[id].tsx
├── screens/                  # Telas reutilizadas por mais de uma rota
├── components/               # Design system: AppText, Button, FormField, FormSection, PostCard...
├── constants/strings.ts      # Todos os textos da interface (pt-BR)
├── contexts/                 # AuthContext (sessão/perfil) e ToastContext (feedback)
├── hooks/                    # usePosts, useUsers, useServerStatus, useDebounce
├── api/                      # client.ts (axios + interceptors) e services.ts (endpoints)
├── schemas/                  # Schemas Zod dos formulários
├── utils/                    # Formatação, máscaras, mapeamento de formulários, feedback
├── config/env.ts             # Resolução da URL da API
├── storage/tokenStorage.ts   # SecureStore (fallback localStorage no web)
├── theme/theme.ts            # Cores, gradientes, fontes, tipografia, sombras
├── types/                    # Tipos compartilhados
└── __tests__/                # Testes unitários e de componentes
```

**Fluxo de dados:** Tela → hook (`usePosts`, `useUsers`) → `services.ts` → `client.ts` (axios, injeta `Authorization: Bearer <jwt>`) → API. Mutations invalidam o cache do TanStack Query, então as listas se atualizam após criar, editar ou excluir.

**Textos centralizados:** nenhum componente tem texto fixo; tudo vem de `src/constants/strings.ts`, o que facilita revisão e uma futura internacionalização.

**Autenticação e autorização (duas camadas):**

1. **App:** o `_layout.tsx` usa `Stack.Protected`/`Tabs.Protected` — sem login só existe a tela de login; aluno não tem as rotas nem as abas de criação, edição e gerenciamento (nem via deep link). A sessão é restaurada do SecureStore e validada em `GET /auth/me`. Resposta 401 (token expirado) faz logout automático.
2. **API:** o back-end valida o JWT e o papel em todas as rotas de escrita e administrativas. O autor do post é definido pelo servidor a partir do usuário autenticado.

**Endpoints consumidos:**

| Recurso | Endpoints |
| ------- | --------- |
| Auth | `POST /auth/login`, `GET /auth/me`, `PUT /auth/me` |
| Posts | `GET /posts`, `GET /posts/search?q=`, `GET /posts/:id`, `POST /posts`, `PUT /posts/:id`, `DELETE /posts/:id` |
| Comentários | `GET/POST /posts/:id/comments` |
| Professores | `GET /teachers?page=&limit=&q=`, `GET/PUT/DELETE /teachers/:id`, `POST /teachers` |
| Alunos | `GET /students?page=&limit=&q=`, `GET/PUT/DELETE /students/:id`, `POST /students` |
| Saúde | `GET /health` (status do servidor no Perfil) |

## Setup inicial

Pré-requisitos: Node.js 20+, npm, Docker e o app **Expo Go** no celular (App Store / Google Play).

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

## Rodando no celular com hot reload

1. Celular e Mac **na mesma rede Wi-Fi** (redes corporativas/"guest" costumam bloquear tráfego entre dispositivos).
2. API rodando (`npm run dev` no `schoolblog-api`). Teste no navegador do **celular**: `http://<IP-do-Mac>:3000/health` deve responder `{"status":"ok"}`. IP do Mac: `ipconfig getifaddr en0`.
3. **iPhone físico:** o Expo Go exige que o computador e o celular estejam logados na **mesma conta Expo** (gratuita em expo.dev/signup):
   - no Mac: `npx expo login` (confira com `npx expo whoami`);
   - no Expo Go: ícone de conta no canto superior direito → entrar com a mesma conta;
   - reinicie o `npx expo start` depois do login.
4. `npx expo start` e escaneie o QR Code (iPhone: câmera; Android: Expo Go → "Scan QR code").
5. Edite qualquer arquivo em `src/` e salve: o **Fast Refresh** atualiza o app em ~1s mantendo o estado da tela.
6. Atalhos no terminal do Expo: `r` recarrega, `m` abre o menu de dev, `j` abre o debugger. No celular, **agitar o aparelho** abre o menu de dev.

Rede bloqueada? `npm run start:tunnel` + `EXPO_PUBLIC_API_URL` apontando para uma URL pública da API (ex.: ngrok).

## Guia de uso

Usuários de demonstração (criados pelo seed da API):

| Perfil | E-mail | Senha | Pode |
| ------ | ------ | ----- | ---- |
| Professor(a) | `felipe@gmail.com` | `123456` | tudo: publicações, gerenciamento, professores e alunos |
| Aluno(a) | `maria@gmail.com` | `123456` | ler, buscar e comentar publicações |

- **Início:** saudação personalizada, busca com debounce (full-text da API), puxar para atualizar e tempo estimado de leitura. Professor vê o botão `+` para publicar.
- **Publicação:** conteúdo completo, comentários e campo de comentário (autor = usuário logado). Professor vê o atalho de edição no cabeçalho.
- **Nova/editar publicação:** título e conteúdo obrigatórios; o autor é preenchido pelo sistema e fica bloqueado. Na edição, **Salvar** só é habilitado quando algo muda.
- **Gerenciar:** indicadores (total, minhas, autores) e lista de publicações; tocar no item abre a visualização, com botões de editar e excluir.
- **Professores / Alunos:** busca por nome, e-mail, disciplina, turma ou matrícula; lista paginada (10 por página, carrega mais ao rolar); cadastro e edição em seções. Professor: telefone, disciplina, formação e sobre. Aluno: telefone, nascimento, responsável, matrícula e turma. Campos com `*` são obrigatórios.
- **Perfil:** dados do usuário, indicadores, status de conexão com o servidor, edição dos próprios dados (nome, telefone e senha) e saída com confirmação.

## Testes e qualidade

```bash
npm test            # Jest + React Native Testing Library
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint (expo)
```

Cobertura: schemas de validação, máscaras e formatação, mapeamento de formulários, tratamento de erros da API, `PostCard`, tela de login, formulário de publicação (autor bloqueado e botão salvar condicionado a alterações) e `AuthContext` (login, perfil, atualização e sessão inválida).

## Decisões técnicas e desafios

- **Expo Router + `Stack.Protected`:** as rotas protegidas são declaradas por papel no layout. No login/logout o navegador troca de pilha sozinho, sem redirecionamentos espalhados pelas telas.
- **URL da API no celular:** `localhost` no celular é o próprio celular. O app lê o `hostUri` do Expo (IP do Mac que serviu o bundle) e monta `http://<ip>:3000`.
- **Back-end sem autenticação na Fase 02:** a Fase 04 adicionou ao `schoolblog-api` o model `User` com perfil de professor/aluno, login JWT com bcrypt, middlewares de autorização, CRUDs paginados com busca e edição do próprio perfil.
- **Visual nativo com identidade de caderno escolar:** fonte do sistema (SF), cores semânticas com modo escuro, uma única cor de destaque (azul caneta) e, como assinatura, a lista de publicações desenhada como página de caderno — data na margem vermelha e linhas azuis. Formulários abrem como sheet com Cancelar/Salvar no topo, e ações destrutivas usam action sheet nativo.
- **Formulários com estado "sujo":** o botão de salvar usa `formState.isDirty` do React Hook Form, que compara com os valores carregados — voltar ao valor original desabilita o botão novamente.
- **Uma tela, várias rotas:** professores e alunos compartilham `UserListScreen`/`UserFormScreen` (parametrizados por `kind`), mas cada requisito tem sua rota própria.
- **Expo Go no iPhone:** o Expo Go passou a exigir a mesma conta Expo no CLI e no app para abrir projetos de desenvolvimento.

## Equipe

- Gabriel Franco de Almeida — RM370570

## Licença

MIT
