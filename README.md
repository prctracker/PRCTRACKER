# Atlas Médico do Brasil

Site da PRC Tracker que reúne os relatórios estaduais de mercado médico: médicos no CNES, vínculos nos hospitais e UPAs, valores pagos pelo setor público (com o documento de origem de cada número), contratos, concursos, notícias e o panorama do Brasil calculado a partir dos estados que já têm relatório.

Estados com relatório: Tocantins, Roraima, Alagoas, Rio Grande do Sul e Rondônia.

## Regra dos dados

Nenhum número é digitado à mão ou estimado. Cada linha dos conjuntos de dados traz a fonte (link) e a data da consulta; médias, medianas, valor por hora e totais do Brasil são calculados pelos scripts em `tools/`. O que não foi encontrado aparece como "Não localizado", com o motivo.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `src/<uf>/` | Relatório de cada estado: `index.html` (painel), `data/*.json` (linhas) e `datasets/*.json` (título, descrição, fonte e data de cada conjunto) |
| `site/` | Código do site: `index.html`, `app.js` e a identidade visual em `assets/` |
| `tools/` | Scripts que calculam os indicadores e montam o site |
| `geo/` | Contorno dos estados para o mapa do Brasil |
| `docs/` | Site pronto, publicado pelo GitHub Pages |
| `supabase/` | Rascunho do banco com login, perfis e registro de acessos (ainda não ligado) |

## Como gerar o site

Requisitos: Node.js 20 ou mais novo e Python 3.

```bash
cd tools
npm install
npm run build   # calcula, monta e copia o resultado para docs/
npm run qa      # abre todas as páginas num navegador sem tela e confere erros (precisa do Playwright)
```

## Como incluir um estado novo

1. Crie `src/<uf>/` com `index.html`, `data/` e `datasets/` no mesmo formato dos outros estados.
2. Em `tools/build.js`, acrescente o estado em `STATES` (nome, sigla, slug, código IBGE, link do painel, polos e data do relatório) e em `ORDER`.
3. Em `tools/compute.js`, acrescente a sigla na lista de estados.
4. Em `site/app.js`, acrescente o slug em `SLUGS` e a cor em `ST_COLOR`; em `site/index.html`, o link no menu, a cor `--st-<uf>` (tema claro e escuro) e a linha `<script src="estados/<uf>.js">`.
5. Rode `npm run build` e `npm run qa`.

## Hospedagem

O GitHub Pages publica a pasta `docs/` da branch `main` (Settings → Pages → Branch `main`, pasta `/docs`).

O GitHub Pages serve o site aberto: qualquer pessoa com o endereço consegue ver as páginas e baixar os arquivos de dados. O formulário "Valores da equipe" e o registro de acessos só funcionam dentro do claude.ai por enquanto; fora dele, o site mostra o aviso correspondente. O login próprio, com perfis e registro de acessos, depende de ligar o banco descrito em `supabase/schema.sql`.

## Atualização

Ainda manual: os relatórios estaduais são atualizados e o site é gerado de novo com `npm run build`. A atualização automática mensal (PNCP, CNES, notícias) está planejada.
