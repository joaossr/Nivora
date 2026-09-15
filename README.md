# NIVORA — Seu progresso, todo dia.

App de hábitos com dashboard gamificado (níveis, XP, streaks, missões, loja e
conquistas), autenticação real via Supabase e dados por usuário.

**Produção:** https://nivora-app-coral.vercel.app

## Estrutura

```
.
├── index.html   # Dashboard completo (Hoje, Hábitos, Metas, Calendário,
│                # Estatísticas, Relatórios, Conquistas, Missões, Loja,
│                # Configurações)
├── login.html   # Tela de login
└── README.md
```

## Como rodar

O projeto usa [Vite](https://vitejs.dev/) apenas como servidor de desenvolvimento
(hot reload). Não há build de verdade além de empacotar os dois HTMLs.

```bash
npm install
npm run dev
# depois acesse http://localhost:5173/login.html
```

Copie `.env.example` para `.env` e preencha com as credenciais do seu projeto
Supabase (URL e chave publishable, ambas públicas por natureza):

```bash
cp .env.example .env
```

Outros comandos:

```bash
npm run build    # gera a pasta dist/ com os arquivos otimizados
npm run preview  # serve a pasta dist/ localmente, para conferir o build
```

Também dá para abrir os arquivos direto no navegador, sem servidor:

```bash
open index.html      # macOS
xdg-open index.html  # Linux
```

## Deploy

O projeto está hospedado na **Vercel** e conectado ao repositório do GitHub
(`joaossr/Nivora`) — todo push para `main` gera um deploy automático em
produção. As variáveis `NEXT_PUBLIC_SUPABASE_URL` e
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` já estão configuradas direto no
projeto da Vercel (Production, Preview e Development).

Para fazer um deploy manual (sem precisar de push):

```bash
npx vercel --prod
```

**Produção:** https://nivora-app-coral.vercel.app

## Estado atual

- **Autenticação real via Supabase Auth**: `login.html` faz login, cadastro
  (e-mail/senha), recuperação de senha (link por e-mail) e login com Google
  (`supabase.auth.signInWithOAuth`). `index.html` exige sessão — sem login,
  redireciona para `login.html` — e o botão **Sair** encerra a sessão de
  verdade (`supabase.auth.signOut()`).
- **Dados 100% por usuário**: hábitos, histórico de conclusões, metas,
  resgates de missão e perfil pertencem a um `user_id` (RLS restrita ao
  dono da linha). Cada pessoa só vê e edita os próprios dados.
- **Histórico real de hábitos** (`habit_logs`): cada conclusão vira uma
  linha com a data. Streak atual, melhor streak e taxa de conclusão de cada
  hábito são calculados a partir desse histórico, não de contadores fixos.
- **Calendário editável**: clique em qualquer dia (passado ou hoje) para
  marcar/desmarcar quais hábitos foram concluídos naquele dia — útil se
  você esqueceu de registrar na hora.
- **+ Novo hábito** e **+ Nova meta** abrem formulários reais que gravam no
  Supabase; marcar/desmarcar hábito, editar um dia no calendário e
  "Reiniciar dia" sincronizam XP com o perfil do usuário. Cada hábito
  também pode ser **editado** (nome, categoria, emoji, XP) ou **excluído**
  (o que apaga também o histórico de conclusões dele) direto no card. Metas
  também podem ser editadas e excluídas.
- **Hábitos vinculados a metas**: ao criar/editar um hábito, dá pra marcar
  quais metas ele alimenta e quanto cada conclusão soma nelas (`incremento`
  — por padrão 1, mas pode ser qualquer número, útil pra metas em dinheiro
  onde cada conclusão vale, por exemplo, R$50). Uma meta pode ter vários
  hábitos vinculados; um hábito pode alimentar várias metas ao mesmo tempo.
  O progresso da meta (`atual`, %, checkpoints, conclusão) é **recalculado
  automaticamente** — do zero, a partir do histórico de conclusões — toda
  vez que um hábito vinculado é marcado, desmarcado ou editado no
  calendário, incluindo dias retroativos. Metas sem nenhum hábito vinculado
  mantêm o último valor conhecido (o `atual` não é forçado a zero).
- **Checkpoints opcionais**: cada meta pode ter marcos intermediários
  personalizados (ex.: 15/30/60 dias de uma meta de 90). Cada checkpoint
  tem um valor numérico (o que dispara o desbloqueio automático) e um
  **rótulo em palavras opcional** (ex.: "Metade do caminho") — se não tiver
  rótulo, mostra o número com a unidade da meta. São preenchidos e
  desfeitos sozinhos conforme o progresso avança ou recua, aparecem como
  pontos na barra de progresso e como uma lista com ✓/○ no card da meta. O
  modal tem um botão "Sugerir automaticamente" (25%/50%/75% do alvo, já com
  rótulos "Começando"/"Na metade"/"Quase lá") só como atalho — o usuário
  pode adicionar, editar ou remover qualquer checkpoint livremente, e metas
  sem checkpoint nenhum funcionam normal.
- **Conquistas com desbloqueio automático**: calculadas a partir do
  progresso real (XP total, streaks, nº de hábitos, dias perfeitos, metas
  concluídas, compras na loja) — sem tabela própria, recalculadas a cada
  carregamento.
- **Missões genéricas e persistidas**: diárias e semanais que funcionam com
  qualquer hábito cadastrado (não citam hábitos específicos). Cada resgate
  grava uma linha em `mission_claims`, então não dá para resgatar duas
  vezes a mesma missão no mesmo dia/semana.
- **Estatísticas e Relatórios reais**: XP por dia da semana, conclusão por
  categoria, melhores hábitos, desempenho semanal — tudo calculado do
  histórico de hábitos do usuário logado, começando zerado para quem é novo.
- **Avatar**: em Configurações, escolha livremente entre 10 avatares (9
  imagens geradas + a coroa em SVG) — todos liberados para qualquer
  usuário, sem custo. Quem loga pelo Google usa a foto da conta por
  padrão, mas pode substituir por um avatar.
- **Favicon**: usa a mesma logo "N" do app (extraída do base64 embutido em
  `login.html`), em `public/favicon.png` e `public/apple-touch-icon.png`.
- **Frases motivacionais dinâmicas**: a frase no card inferior da página
  "Hoje" muda conforme o progresso do dia, sequência atual e taxa de
  conclusão do usuário (10 variações).
- **Notificações contextuais**: geradas a partir do estado real (sem
  hábitos ainda, sequência em risco, conquista por perto, meta em
  andamento) — não é uma lista fixa. Clicar na data de um aviso leva para
  o Calendário.
- **Perfil**: nome (editável em Configurações), avatar e nível aparecem na
  barra lateral e na saudação.
- A logo está embutida como base64 dentro dos dois arquivos, então eles
  continuam funcionando sozinhos, sem pasta de assets.

## Supabase

- Projeto: **Nivora** (`dtkgomdoraxoyofsiywh`).
- `public.profiles`: `id` (= `auth.users.id`), `nome`, `avatar_url` (do
  Google), `avatar_escolhido`, `avatares_desbloqueados` (coluna legada, não
  usada mais — os avatares deixaram de ser vendidos na Loja), `total_xp`,
  `coins`, `moedas_gastas`. Criado automaticamente por um trigger
  (`handle_new_user`) quando alguém se cadastra.
- `public.habits`: hábitos cadastrados (`nome`, `categoria`, `emoji`, `xp`).
- `public.habit_logs`: uma linha por `(habit_id, data)` — o histórico real
  de conclusões, base de streaks, taxas, calendário, estatísticas e
  relatórios.
- `public.goals`: metas do usuário (`atual`/`alvo` são `numeric`, aceitam
  decimais para metas em dinheiro). `concluida_em` marca quando o alvo foi
  atingido pela primeira vez.
- `public.habit_goals`: vínculo N:N entre `habits` e `goals`, com
  `incremento` (quanto cada conclusão do hábito soma na meta).
- `public.goal_checkpoints`: marcos opcionais de uma meta (`valor`,
  `rotulo` opcional em texto, `atingido`, `atingido_em`) — recalculados
  junto com o progresso.
- `public.mission_claims`: uma linha por `(mission_key, period_key)`
  resgatado — evita resgatar a mesma missão duas vezes no período.
- RLS em todas as tabelas: cada usuário só enxerga e altera as próprias
  linhas (`*_select_own`, `*_insert_own`, etc.), com `user_id default auth.uid()`.
- `@supabase/ssr` está instalado nas dependências (era um requisito do
  pedido original), mas ainda não é usado — o app é 100% client-side e fala
  com o Supabase direto pelo `@supabase/supabase-js`.

### Configuração manual pendente no painel do Supabase

Isso **não** dá para ser feito por código — precisa ser feito uma vez no
[painel do Supabase](https://supabase.com/dashboard/project/dtkgomdoraxoyofsiywh):

1. **Login com Google**: em *Authentication → Sign In / Providers → Google*,
   habilite o provedor e informe um *Client ID* e *Client Secret* OAuth
   criados no [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   (tipo "Web application", com a URI de callback que o próprio painel do
   Supabase mostra nessa tela, algo como
   `https://dtkgomdoraxoyofsiywh.supabase.co/auth/v1/callback`). Sem isso,
   o botão "Entrar com Google" mostra um erro do Supabase dizendo que o
   provedor não está habilitado.
2. **URLs de redirecionamento** (⚠️ pendente agora que o app está no ar): em
   *Authentication → URL Configuration*, adicione:
   - **Site URL**: `https://nivora-app-coral.vercel.app`
   - **Redirect URLs**: `https://nivora-app-coral.vercel.app/*` e
     `http://localhost:5173/*` (para continuar testando localmente)

   Sem isso, o login com Google e o link de recuperação de senha redirecionam
   para o lugar errado (ou são bloqueados pelo Supabase) em produção.
3. (Opcional) **Confirmação de e-mail**: por padrão o Supabase exige que o
   usuário confirme o e-mail antes de logar. Para testar mais rápido em
   desenvolvimento, isso pode ser desativado em
   *Authentication → Sign In / Providers → Email*.

## Loja

A Loja troca moedas por recompensas — uma mistura de vantagens no app
(congelar sequência, XP em dobro, temas, relatórios avançados, slot de meta
extra) e recompensas da vida real que o usuário se dá por progredir (doce
ou lanche favorito, pedir comida, tarde de descanso, sair para se divertir,
recompensa premium, comprar algo que quiser). Cada item tem uma imagem
própria (`public/rewards/*.svg`) que ocupa o card inteiro, não só um ícone
no meio. As recompensas "da vida real" são apenas simbólicas: comprá-las só
desconta moedas e conta para a conquista "Primeira compra" — não há nenhum
efeito automático no app (é o próprio usuário que se recompensa depois).

## Próximos passos possíveis

- Persistir os itens comprados na Loja que dão efeito dentro do app (temas,
  "XP em dobro", "congelar sequência" etc. ainda não têm efeito real).
- Login com Apple de verdade (hoje o botão é só uma demonstração).
- Separar CSS/JS dos arquivos HTML se o projeto crescer.
