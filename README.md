# Connect Digital School - Dashboard Architecture

## 🏗️ Estrutura de Rotas

O projeto foi reorganizado usando **Next.js Route Groups** para uma separação clara de contextos:

```
app/
├── (public)/          # Páginas públicas (landing page)
├── (auth)/           # Autenticação (login, register, etc.)
├── (student)/        # Dashboard do aluno
├── (teacher)/        # Dashboard do professor
└── (admin)/          # Dashboard administrativo
```

## 🚀 Começando

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

### 3. Testar diferentes roles

Acesse: **http://localhost:3000/login-helper**

Esta página permite simular login com diferentes roles:
- **Aluno** → Redireciona para `/student/dashboard`
- **Professor** → Redireciona para `/teacher/dashboard`
- **Administrador** → Redireciona para `/admin/dashboard`

## 📋 Dashboards e Funcionalidades

### 👨‍🎓 Aluno (Student)
- **Dashboard**: Visão geral do progresso, XP, streak
- **Cursos**: Lista de cursos disponíveis
- **Lições**: Acesso a lições individuais
- **Quizzes**: Testes e avaliações
- **Fórum**: Discussões e perguntas
- **Perfil**: Informações pessoais e histórico

### 👨‍🏫 Professor (Teacher)
- **Dashboard**: Métricas dos seus cursos e alunos
- **Alunos**: Gerenciar e acompanhar alunos
- **Cursos**: Editar conteúdo dos cursos
- **Analytics**: Métricas de performance
- **Configurações**: Preferências pessoais

### 👨‍💼 Administrador (Admin)
- **Dashboard**: Visão geral da plataforma
- **Usuários**: Gerenciar alunos e professores
  - `/admin/users/students` - Lista de alunos
  - `/admin/users/teachers` - Lista de professores
- **Cursos**: CRUD de cursos
- **Conteúdo**: Gerenciar lições e quizzes
- **Analytics**: Métricas completas da plataforma
- **Configurações**: Configurações gerais

## 🔐 Autenticação (Mock)

Atualmente usando **autenticação simulada** para desenvolvimento:

- Os roles são armazenados em `localStorage` e `cookies`
- Middleware protege rotas baseado no role
- Para implementação real, substituir por:
  - NextAuth.js
  - Clerk
  - Supabase Auth
  - Custom JWT

### Arquivos de autenticação:
- `lib/auth.ts` - Funções auxiliares de autenticação
- `types/user.ts` - Tipos de usuário e roles
- `middleware.ts` - Proteção de rotas

## 🎨 Componentes Principais

### Layouts
- `(public)/layout.tsx` - Navbar + Footer público
- `(auth)/layout.tsx` - Layout de autenticação
- `(student)/layout.tsx` - AppShell com navegação de aluno
- `(teacher)/layout.tsx` - AppShell com navegação de professor
- `(admin)/layout.tsx` - AppShell com navegação de admin

### Navegação
- `components/app-shell.tsx` - Container principal com sidebar
- `components/app-sidebar.tsx` - Sidebar responsiva com variantes
- `components/mobile-nav.tsx` - Navegação mobile com variantes

## 🛣️ Rotas Principais

| Role | Dashboard | Outras Rotas |
|------|-----------|--------------|
| **Aluno** | `/student/dashboard` | `/student/courses`, `/student/forum`, `/student/profile` |
| **Professor** | `/teacher/dashboard` | `/teacher/students`, `/teacher/courses`, `/teacher/analytics` |
| **Admin** | `/admin/dashboard` | `/admin/users`, `/admin/courses`, `/admin/analytics` |
| **Público** | `/` | `/sobre`, `/contato` |
| **Auth** | - | `/login`, `/register`, `/forgot-password` |

## 🔄 Redirects

O middleware automaticamente redireciona usuários baseado em autenticação:
- Usuários não autenticados → `/login`
- Usuários autenticados tentando acessar `/login` → Dashboard do seu role
- Tentativa de acesso não autorizado → `/unauthorized`

## 📦 Próximos Passos

1. **Implementar autenticação real**
   - Escolher provider (NextAuth, Clerk, etc.)
   - Substituir mock auth em `lib/auth.ts`
   - Atualizar middleware

2. **Conectar ao backend**
   - Integrar com API/database
   - Implementar CRUD real
   - Adicionar loading states

3. **Adicionar mais páginas**
   - Páginas de conteúdo do admin
   - Páginas de gerenciamento detalhado
   - Páginas de relatórios

4. **Implementar permissões granulares**
   - Sub-roles e permissões específicas
   - Feature flags
   - Acesso condicional a funcionalidades

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

## 📝 Notas Importantes

- ⚠️ **Mock Auth**: Autenticação atual é apenas para desenvolvimento
- 🎨 **Placeholders**: Algumas páginas admin/teacher são placeholders
- 🔄 **Hot Reload**: Mudanças de route groups podem precisar de restart do servidor
- 🍪 **Cookies**: Role é armazenado em cookie para o middleware funcionar

## 🐛 Troubleshooting

### Middleware não está funcionando
- Limpe cookies do navegador
- Restart do dev server
- Verifique console por erros

### Rotas não encontradas
- Verifique que parenteses estão corretos: `(admin)` não `[admin]`
- Restart do servidor após criar novos route groups

### Navegação não atualiza
- Force refresh (Ctrl+Shift+R)
- Limpe cache do Next.js: `rm -rf .next`
