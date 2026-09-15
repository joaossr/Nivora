# NIVORA — Seu progresso, todo dia.

App de hábitos com dashboard gamificado (níveis, XP, streaks, missões, loja e
conquistas) e tela de login. Front-end estático, sem build step: HTML, CSS e
JavaScript puros em arquivos únicos.

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

## Estado atual

- Tudo funciona no front-end com dados mockados em memória (o array
  `habits` e afins dentro do `<script>` de `index.html`). Nada é persistido
  entre recarregamentos.
- `login.html` valida os campos no cliente e simula o envio; não há
  integração com um backend de autenticação ainda.
- A logo está embutida como base64 dentro dos dois arquivos, então eles
  continuam funcionando sozinhos, sem pasta de assets.

## Próximos passos possíveis

- Conectar `login.html` a um serviço de autenticação real.
- Persistir o estado dos hábitos (localStorage, backend, etc.).
- Separar CSS/JS dos arquivos HTML se o projeto crescer.
