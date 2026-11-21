# 🕹️ Fliperama IA - Escola 11 de Outubro

Portal de jogos em Pixel Art estilo fliperama, reunindo os jogos desenvolvidos pelos alunos do curso de Inteligência Artificial usando "Vibe Coding" (HTML, CSS e JavaScript).

- **Repositório:** `https://github.com/11outubro-projetos-ia/vibecode-games`
- **Endereço do Site:** `https://11outubro-projetos-ia.github.io/vibecode-games/`
- **Estrutura:** 100% estático (GitHub Pages), sem servidor, sem banco de dados, sem Node/build.

---

## 📁 Estrutura de Pastas

```text
/
├── .gitignore                   ← Ignora a pasta _originais no Git
├── index.html                   ← Página inicial (fliperama retrô com player modal)
├── README.md                    ← Guia do projeto e passo a passo
├── img/
│   └── logo.png                 ← Logo da escola (se ausente, exibe controle pixel art)
├── _originais/                  ← Backup seguro dos arquivos originais dos alunos (NÃO vai pro site)
├── jogos/
│   ├── catch-the-stars.html     ← Jogo arquivo único
│   ├── f1-armagedom.html        ← Jogo arquivo único
│   ├── neon-run.html            ← Jogo arquivo único
│   └── meu-jogo-complexo/       ← Exemplo para jogo com assets (imagens/sons)
│       ├── meu-jogo-complexo.html
│       └── assets/
└── thumbs/
    ├── catch-the-stars.png      ← Capa do jogo (16:9, ex: 640x360)
    ├── f1-armagedom.png
    └── neon-run.png
```

---

## 🚀 Como Adicionar um Novo Jogo

Quando receber o arquivo HTML de um aluno, siga estes 4 passos:

### Passo 1: Salve o original e prepare o nome do arquivo
1. Guarde uma cópia intacta do arquivo original em `_originais/`.
2. Renomeie o arquivo para o padrão do site:
   - **Tudo em minúsculas**, **sem acentos**, **sem espaços**, palavras separadas por hífen (`-`).
   - *Exemplo:* `jogo-da-cobrinha.html` (nunca use `index.html`).
3. Se o jogo for um arquivo único, coloque em `jogos/jogo-da-cobrinha.html`.
4. Se o jogo tiver imagens ou sons próprios, crie uma pasta com o mesmo nome: `jogos/jogo-da-cobrinha/jogo-da-cobrinha.html`.

### Passo 2: Ajustes recomendados no HTML do jogo
Para garantir que funcione perfeitamente no celular, tablet e computador:
- **Viewport no `<head>`:**
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```
- **Sem barras de rolagem:** Garanta `overflow: hidden` no `html, body` e ajuste o `<canvas>` para dimensionar responsivamente.
- **Controles de Toque (Mobile):** Se o jogo original só usa teclas do teclado, adicione botões virtuais na tela para telas de toque (`@media (pointer: coarse)`).
- **Sem alertas bloqueantes:** Não utilize `alert()` no carregamento inicial da página.
- **Sem botão de voltar interno:** O `index.html` já possui a barra do fliperama com botão de voltar.

### Passo 3: Criar a Thumbnail (Opcional)
- Tire um print do jogo em proporção **16:9** (por exemplo, 640x360 pixels).
- Salve em `thumbs/nome-do-jogo.png`.
- *Dica:* Se deixar `thumb: ""`, o `index.html` gera automaticamente uma capa em pixel art procedural exclusiva para o jogo!

### Passo 4: Cadastrar no `index.html`
Abra o `index.html` e adicione o jogo no array `JOGOS` dentro da tag `<script>` (mantenha em ordem alfabética por `titulo`):

```javascript
const JOGOS = [
  { titulo: "Catch the Stars Arcade", arquivo: "jogos/catch-the-stars.html", thumb: "thumbs/catch-the-stars.png" },
  { titulo: "F1 Armagedom",            arquivo: "jogos/f1-armagedom.html",    thumb: "thumbs/f1-armagedom.png" },
  { titulo: "Neon Run",                arquivo: "jogos/neon-run.html",        thumb: "thumbs/neon-run.png" },
  { titulo: "Novo Jogo Legal",         arquivo: "jogos/novo-jogo.html",       thumb: "thumbs/novo-jogo.png" },
];
```

---

## 🛠️ Como Testar Localmente

Você pode testar abrindo pelo navegador ou iniciando um servidor estático local:

```bash
# Com Node.js
npx serve .

# Ou com Python (se disponível)
python -m http.server 8080
```

Abra no navegador em `http://localhost:8080` e aperte `F12` para alternar a visualização para celular (largura de 390px).

---

## 📦 Como Publicar no GitHub Pages

1. Inicialize ou atualize o repositório Git:
   ```bash
   git init
   git remote add origin https://github.com/11outubro-projetos-ia/vibecode-games.git
   git add .
   git commit -m "Publicação dos jogos vibe coding"
   git branch -M main
   git push -u origin main
   ```
2. No GitHub: Vá em **Settings** > **Pages** > **Build and deployment**:
   - Branch: `main` / Folder: `/ (root)`
   - Salve. O site estará ativo no endereço final em alguns minutos!
