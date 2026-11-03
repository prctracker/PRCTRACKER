/* Painel de Alagoas: marca\u00e7\u00e3o e script originais do relat\u00f3rio, publicados em https://claude.ai/code/artifact/89be2483-da32-4a59-aea9-0c307ce767a0 */
window.MX_ESTADOS = window.MX_ESTADOS || {};
window.MX_ESTADOS.al = {
  css: "\n.tm{font-family:var(--font-anthropic-sans);color:var(--color-fg);display:flex;flex-direction:column;gap:var(--cds-gap-xl)}\n.tm-head{display:flex;flex-direction:column;gap:var(--cds-gap-sm)}\n.tm-title{font-family:var(--font-anthropic-serif);font-weight:400;font-size:var(--cds-font-size-title);margin:0;line-height:1.15}\n.tm-take{margin:0;font-size:var(--cds-font-size-body);line-height:1.55;max-width:78ch}\n.tm .tm-take b,.tm .tm-card-n b,.tm .tm-sec-p b,.tm .tm-kpi-n b{font-weight:600}\n.tm-nav{display:flex;flex-wrap:wrap;gap:var(--cds-gap-xs)}\n.tm-nav button,.tm-seg button{font:inherit;font-size:var(--cds-font-size-caption);padding:var(--cds-pad-xs) var(--cds-pad-sm);border:1px solid var(--color-border-line);background:var(--color-panel);color:var(--color-fg);border-radius:var(--cds-radius);cursor:pointer}\n.tm-seg button[aria-pressed=true]{background:var(--color-fg);color:var(--color-bg);border-color:var(--color-fg)}\n.tm-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,11.5rem),1fr));gap:var(--cds-gap-md)}\n.tm-kpi{background:var(--color-panel);border:1px solid var(--color-border-line);border-radius:var(--cds-radius);padding:var(--cds-pad-md);display:flex;flex-direction:column;gap:var(--cds-gap-xs)}\n.tm-kpi-l{font-size:var(--cds-font-size-caption);color:var(--color-fg-muted)}\n.tm-kpi-v{font-family:var(--font-anthropic-serif);font-weight:400;font-size:var(--cds-font-size-title);font-variant-numeric:tabular-nums;line-height:1.1;min-height:1.1em}\n.tm-kpi-n{font-size:var(--cds-font-size-caption);color:var(--color-fg-muted)}\n.tm-sec{display:flex;flex-direction:column;gap:var(--cds-gap-md);scroll-margin-top:var(--cds-gap-md)}\n.tm-sec-h{font-size:var(--cds-font-size-heading);font-weight:var(--cds-font-weight-medium);margin:0}\n.tm-sec-p{margin:0;color:var(--color-fg-muted);font-size:var(--cds-font-size-body);line-height:1.5;max-width:80ch}\n.tm-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr));gap:var(--cds-gap-md)}\n.tm-grid-map{grid-template-columns:repeat(auto-fit,minmax(min(100%,26rem),1fr))}\n.tm-stack{display:flex;flex-direction:column;gap:var(--cds-gap-md);min-width:0}\n.tm-card{background:var(--color-panel);border:1px solid var(--color-border-line);border-radius:var(--cds-radius);padding:var(--cds-pad-lg);display:flex;flex-direction:column;gap:var(--cds-gap-sm);min-width:0}\n.tm-card-h{font-size:var(--cds-font-size-heading);font-weight:var(--cds-font-weight-medium);margin:0}\n.tm-card-n{font-size:var(--cds-font-size-caption);color:var(--color-fg-muted);margin:0;line-height:1.45}\n.tm-ctrl{display:flex;flex-wrap:wrap;gap:var(--cds-gap-sm);align-items:center}\n.tm-seg{display:flex;flex-wrap:wrap;gap:var(--cds-gap-xs)}\n.tm-chk{font-size:var(--cds-font-size-caption);display:flex;gap:var(--cds-gap-xs);align-items:center;color:var(--color-fg-muted)}\n.tm-map{position:relative;min-height:520px}\n.tm-chart{position:relative;min-height:180px}\n.tm-chart svg,.tm-map svg{display:block;overflow:visible}\n.tm-tip{position:absolute;pointer-events:none;background:var(--cds-surface-popover);border:1px solid var(--cds-border);border-radius:var(--cds-radius);box-shadow:var(--cds-shadow-popover);padding:var(--cds-pad-xs) var(--cds-pad-sm);font-size:var(--cds-font-size-caption);max-width:17rem;z-index:3;line-height:1.45}\n.tm-tip-h{color:var(--cds-text-secondary);margin-bottom:2px}\n.tm-tbl-wrap{max-height:30rem;overflow:auto}\n.tm-tbl-wrap.tm-short{max-height:19rem}\n.tm-tbl{width:100%;border-collapse:collapse;font-size:var(--cds-font-size-caption);font-variant-numeric:tabular-nums}\n.tm-tbl th{position:sticky;top:0;background:var(--color-panel);text-align:left;font-weight:var(--cds-font-weight-medium);color:var(--color-fg-muted);padding:var(--cds-pad-xs) var(--cds-pad-sm);border-bottom:1px solid var(--color-border-line);white-space:nowrap;z-index:1}\n.tm-tbl th button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}\n.tm-tbl th[aria-sort=ascending] button::after{content:\" \u2191\"}\n.tm-tbl th[aria-sort=descending] button::after{content:\" \u2193\"}\n.tm-tbl td{padding:var(--cds-pad-xs) var(--cds-pad-sm);border-bottom:1px solid var(--color-border-line);vertical-align:top}\n.tm-tbl .num{text-align:right;white-space:nowrap}\n.tm-tbl a{color:inherit;text-underline-offset:2px}\n.tm-bar{display:inline-block;height:.45rem;border-radius:2px;margin-right:var(--cds-gap-xs);vertical-align:middle}\n.tm-search{font:inherit;font-size:var(--cds-font-size-caption);padding:var(--cds-pad-xs) var(--cds-pad-sm);border:1px solid var(--color-border-line);border-radius:var(--cds-radius);background:var(--color-bg);color:var(--color-fg);width:min(100%,20rem)}\n.tm-legend{display:flex;flex-wrap:wrap;gap:var(--cds-gap-xs) var(--cds-gap-md);font-size:var(--cds-font-size-caption);color:var(--color-fg-muted)}\n.tm-sw{display:inline-block;width:.65rem;height:.65rem;border-radius:2px;margin-right:4px;vertical-align:-1px}\n.tm-fail{display:flex;align-items:center;justify-content:center;gap:var(--cds-gap-xs);min-height:inherit;color:var(--color-fg-muted);font-size:var(--cds-font-size-caption)}\n.tm-fail::before{content:\"\";width:.375rem;height:.375rem;border-radius:50%;background:var(--color-bad)}\n.tm-notes{font-size:var(--cds-font-size-caption);color:var(--color-fg-muted);display:flex;flex-direction:column;gap:var(--cds-gap-sm);max-width:85ch;line-height:1.5}\n.tm-notes p{margin:0}\n.tm-kpis-sm .tm-kpi-v{font-size:var(--cds-font-size-heading)}\n.tm [data-dash-source-state=empty]{color:transparent}\n.tm [data-dash-source-state=refreshing]{opacity:.5;transition:opacity var(--cds-dur-slow)}\n@media (max-width:640px){.tm-hide-sm{display:none}}\n",
  markup: "<div class=\"tm\">\n  <header class=\"tm-head\" id=\"topo\">\n    <h1 class=\"tm-title\">Mapeamento m\u00e9dico de Alagoas</h1>\n    <p class=\"tm-take\">Macei\u00f3 e Arapiraca concentram <b data-draw=\"val\" data-source=\"kpi\" data-field=\"conc_share\" data-fmt=\"pct\">\u2014</b> dos m\u00e9dicos com v\u00ednculo no CNES, e <b data-draw=\"val\" data-source=\"kpi\" data-field=\"mun_baixa\">\u2014</b> dos <b data-draw=\"val\" data-source=\"kpi\" data-field=\"n_mun\">\u2014</b> munic\u00edpios ficam abaixo de <b data-draw=\"val\" data-source=\"kpi\" data-field=\"limite_baixa\">\u2014</b> m\u00e9dico por mil habitantes. Nos hospitais e UPAs, s\u00f3 <b data-draw=\"val\" data-source=\"kpi_vinc\" data-field=\"share_est\" data-fmt=\"pct\">\u2014</b> dos v\u00ednculos m\u00e9dicos s\u00e3o de concursados: <b data-draw=\"val\" data-source=\"kpi_vinc\" data-field=\"share_pf\" data-fmt=\"pct\">\u2014</b> s\u00e3o de aut\u00f4nomos pessoa f\u00edsica e <b data-draw=\"val\" data-source=\"kpi_vinc\" data-field=\"share_tmp\" data-fmt=\"pct\">\u2014</b> de contratos por prazo determinado, o v\u00ednculo dos prestadores de plant\u00e3o da rede estadual.</p>\n    <nav class=\"tm-nav\" aria-label=\"Se\u00e7\u00f5es\">\n      <button type=\"button\" data-go=\"mapa\">Mapa de calor</button>\n      <button type=\"button\" data-go=\"demografia\">Dados demogr\u00e1ficos</button>\n      <button type=\"button\" data-go=\"hospitais\">Hospitais e m\u00e9dicos</button>\n      <button type=\"button\" data-go=\"contratacao\">Contrata\u00e7\u00e3o e valores</button>\n      <button type=\"button\" data-go=\"concursos\">Concursos e sal\u00e1rios</button>\n      <button type=\"button\" data-go=\"ociosas\">Vagas ociosas</button>\n      <button type=\"button\" data-go=\"noticias\">Not\u00edcias</button>\n      <button type=\"button\" data-go=\"metodo\">M\u00e9todo e fontes</button>\n    </nav>\n  </header>\n\n  <div class=\"tm-kpis\">\n    <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">M\u00e9dicos com v\u00ednculo no CNES</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"kpi\" data-field=\"medicos\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"kpi\" data-field=\"medicos_sus\">\u2014</b> atendem pelo SUS</span></div>\n    <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">M\u00e9dicos por mil habitantes</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"kpi\" data-field=\"dens\" data-fmt=\"dec2\">\u2014</span><span class=\"tm-kpi-n\">Popula\u00e7\u00e3o estimada: <b data-draw=\"val\" data-source=\"kpi\" data-field=\"pop\">\u2014</b></span></div>\n    <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Munic\u00edpios abaixo de <span data-draw=\"val\" data-source=\"kpi\" data-field=\"limite_baixa\">\u2014</span> m\u00e9dico por mil hab.</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"kpi\" data-field=\"mun_baixa\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"kpi\" data-field=\"mun_zero\">\u2014</b> sem nenhum m\u00e9dico registrado</span></div>\n    <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">V\u00ednculos de concursados em hospitais e UPAs</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"kpi_vinc\" data-field=\"share_est\" data-fmt=\"pct\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"kpi_vinc\" data-field=\"share_pf\" data-fmt=\"pct\">\u2014</b> aut\u00f4nomos PF \u00b7 <b data-draw=\"val\" data-source=\"kpi_vinc\" data-field=\"share_tmp\" data-fmt=\"pct\">\u2014</b> prazo determinado</span></div>\n    <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Vagas de m\u00e9dico no concurso SESAU-AL 2026</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=cs_med\" data-field=\"valor\">\u2014</span><span class=\"tm-kpi-n\">Concurso de 2021: <b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=cs_2021\" data-field=\"valor\">\u2014</b> vagas de m\u00e9dico</span></div>\n    <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">M\u00e9dico efetivo da SESAU, remunera\u00e7\u00e3o m\u00e9dia do m\u00eas</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"salarios\" data-where=\"id=s1\" data-field=\"valor_min\" data-fmt=\"brl0\">\u2014</span><span class=\"tm-kpi-n\">Uncisal: <b data-draw=\"val\" data-source=\"salarios\" data-where=\"id=s2\" data-field=\"valor_min\" data-fmt=\"brl0\">\u2014</b> \u00b7 agosto de 2026</span></div>\n  </div>\n\n  <section class=\"tm-sec\" id=\"mapa\">\n    <h2 class=\"tm-sec-h\">Mapa de calor da concentra\u00e7\u00e3o m\u00e9dica</h2>\n    <div class=\"tm-grid tm-grid-map\">\n      <div class=\"tm-card\">\n        <h3 class=\"tm-card-h\">M\u00e9dicos por munic\u00edpio</h3>\n        <p class=\"tm-card-n\">Quanto mais escuro, maior o valor. Listrado: nenhum m\u00e9dico registrado no munic\u00edpio. C\u00edrculos: hospitais e UPAs, do tamanho do corpo m\u00e9dico. Passe o cursor para ver os n\u00fameros.</p>\n        <div class=\"tm-ctrl\">\n          <div class=\"tm-seg\" role=\"group\" aria-label=\"Indicador do mapa\">\n            <button type=\"button\" data-metric=\"dens\" aria-pressed=\"true\">M\u00e9dicos por mil hab.</button>\n            <button type=\"button\" data-metric=\"dens_sus\" aria-pressed=\"false\">M\u00e9dicos SUS por mil hab.</button>\n            <button type=\"button\" data-metric=\"med\" aria-pressed=\"false\">Total de m\u00e9dicos</button>\n            <button type=\"button\" data-metric=\"pct_60mais\" aria-pressed=\"false\">Popula\u00e7\u00e3o com 60 anos ou mais</button>\n          </div>\n          <label class=\"tm-chk\"><input type=\"checkbox\" class=\"tm-hosp-toggle\" checked> Mostrar hospitais e UPAs</label>\n        </div>\n        <div class=\"tm-map dash-skeleton\" id=\"mapa-calor\" data-draw=\"mapa\" data-source=\"malha municipios hospitais\"></div>\n      </div>\n      <div class=\"tm-stack\">\n        <div class=\"tm-card\">\n          <h3 class=\"tm-card-h\">M\u00e9dicos por mil habitantes, por regi\u00e3o de sa\u00fade</h3>\n          <p class=\"tm-card-n\">As dez regi\u00f5es de sa\u00fade (CIR) do estado, identificadas pelo maior munic\u00edpio. Em destaque, as que est\u00e3o acima da m\u00e9dia estadual, marcada pela linha tracejada.</p>\n          <div class=\"tm-chart dash-skeleton\" id=\"regioes\" data-draw=\"reg\" data-source=\"regioes kpi\"></div>\n        </div>\n        <div class=\"tm-card\">\n          <h3 class=\"tm-card-h\">Vazios assistenciais</h3>\n          <p class=\"tm-card-n\"><b data-draw=\"val\" data-source=\"kpi\" data-field=\"mun_vazio\">\u2014</b> munic\u00edpios com menos de <b data-draw=\"val\" data-source=\"kpi\" data-field=\"limite_vazio\" data-fmt=\"dec1\">\u2014</b> m\u00e9dico por mil habitantes, do mais desassistido para o menos.</p>\n          <div class=\"tm-tbl-wrap tm-short\">\n            <table class=\"tm-tbl\" data-source=\"municipios\" data-row-key=\"id\">\n              <thead><tr><th data-field=\"nome\">Munic\u00edpio</th><th data-field=\"cir_nome\" class=\"tm-hide-sm\">Regi\u00e3o de sa\u00fade</th><th data-field=\"pop\" class=\"num\">Popula\u00e7\u00e3o</th><th data-field=\"med\" class=\"num\">M\u00e9dicos</th><th data-field=\"dens\" class=\"num\">Por mil hab.</th></tr></thead>\n              <tbody data-draw=\"vazios\"></tbody>\n            </table>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"tm-sec\" id=\"demografia\">\n    <h2 class=\"tm-sec-h\">Dados demogr\u00e1ficos</h2>\n    <p class=\"tm-sec-p\">Quem \u00e9 atendido: tamanho da popula\u00e7\u00e3o, crescimento, estrutura de idade e quanto dela depende s\u00f3 do SUS. As idades v\u00eam do Censo 2022; a popula\u00e7\u00e3o atual, da estimativa do IBGE para 2025.</p>\n    <div class=\"tm-kpis tm-kpis-sm\">\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Popula\u00e7\u00e3o estimada (IBGE 2025)</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"kpi\" data-field=\"pop\">\u2014</span><span class=\"tm-kpi-n\">Censo 2022: <b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=pop22\" data-field=\"valor\">\u2014</b></span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Crescimento desde o Censo 2022</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"demo\" data-field=\"cresc\" data-fmt=\"pct1\">\u2014</span><span class=\"tm-kpi-n\">Macei\u00f3: <b data-draw=\"val\" data-source=\"demo\" data-field=\"cresc_mcz\" data-fmt=\"pct1\">\u2014</b></span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Crian\u00e7as de 0 a 14 anos</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"demo\" data-field=\"share_0a14\" data-fmt=\"pct1\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=pop22_0a14\" data-field=\"valor\">\u2014</b> pessoas no Censo 2022</span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Pessoas com 60 anos ou mais</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"demo\" data-field=\"share_60\" data-fmt=\"pct1\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=pop22_60\" data-field=\"valor\">\u2014</b> pessoas no Censo 2022</span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Idade mediana (anos)</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=idade_med\" data-field=\"valor\">\u2014</span><span class=\"tm-kpi-n\">\u00cdndice de envelhecimento: <b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=ind_env\" data-field=\"valor\" data-fmt=\"dec1\">\u2014</b> idosos por 100 crian\u00e7as</span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Popula\u00e7\u00e3o com plano de sa\u00fade</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"demo\" data-field=\"cobertura\" data-fmt=\"pct1\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=ans_benef\" data-field=\"valor\">\u2014</b> benefici\u00e1rios em dez/2025; o resto depende s\u00f3 do SUS</span></div>\n    </div>\n    <div class=\"tm-grid\">\n      <div class=\"tm-card\">\n        <h3 class=\"tm-card-h\">Parcela da popula\u00e7\u00e3o e dos m\u00e9dicos, por regi\u00e3o de sa\u00fade</h3>\n        <p class=\"tm-card-n\">Barra clara: parcela dos habitantes do estado. Barra escura: parcela dos m\u00e9dicos. Onde a escura \u00e9 menor, a regi\u00e3o tem menos m\u00e9dicos do que seu peso na popula\u00e7\u00e3o.</p>\n        <div class=\"tm-legend\"><span><i class=\"tm-sw\" data-sw=\"m\"></i>Popula\u00e7\u00e3o</span><span><i class=\"tm-sw\" data-sw=\"0\"></i>M\u00e9dicos</span></div>\n        <div class=\"tm-chart dash-skeleton\" id=\"demo-reg\" data-draw=\"demoreg\" data-source=\"demo_reg\"></div>\n      </div>\n      <div class=\"tm-card\">\n        <h3 class=\"tm-card-h\">Idade e crescimento por regi\u00e3o de sa\u00fade</h3>\n        <p class=\"tm-card-n\">Parcelas de idade do Censo 2022 ponderadas pela popula\u00e7\u00e3o de cada munic\u00edpio; crescimento de 2022 para 2025.</p>\n        <div class=\"tm-tbl-wrap\">\n          <table class=\"tm-tbl\" data-source=\"demo_reg\" data-row-key=\"regiao\">\n            <thead><tr><th data-field=\"regiao\">Regi\u00e3o</th><th data-field=\"pop\" class=\"num\">Popula\u00e7\u00e3o</th><th data-field=\"cresc\" class=\"num tm-hide-sm\">Cresc. 22\u201325</th><th data-field=\"share_0a14\" class=\"num\">0 a 14 anos</th><th data-field=\"share_60\" class=\"num\">60 anos ou mais</th><th data-field=\"dens\" class=\"num\">M\u00e9dicos por mil</th></tr></thead>\n            <tbody data-draw=\"demotbl\"></tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"tm-sec\" id=\"hospitais\">\n    <h2 class=\"tm-sec-h\">Hospitais, UPAs e corpo m\u00e9dico</h2>\n    <p class=\"tm-sec-p\">Cada unidade com os m\u00e9dicos cadastrados no CNES e o tipo de v\u00ednculo. A rede estadual se apoia em prestadores com contrato por prazo determinado; filantr\u00f3picos, privados e boa parte das prefeituras pagam o m\u00e9dico como aut\u00f4nomo pessoa f\u00edsica. Contrata\u00e7\u00e3o por PJ \u00e9 minoria, concentrada em algumas unidades municipais do interior.</p>\n    <div class=\"tm-grid\">\n      <div class=\"tm-card\">\n        <h3 class=\"tm-card-h\">Como os m\u00e9dicos est\u00e3o contratados</h3>\n        <p class=\"tm-card-n\">Parcela dos v\u00ednculos m\u00e9dicos por tipo, segundo quem mant\u00e9m a unidade. Um m\u00e9dico pode ter mais de um v\u00ednculo.</p>\n        <div class=\"tm-legend\">\n          <span><i class=\"tm-sw\" data-sw=\"0\"></i>Estatut\u00e1rio</span>\n          <span><i class=\"tm-sw\" data-sw=\"1\"></i>Prazo determinado</span>\n          <span><i class=\"tm-sw\" data-sw=\"2\"></i>PJ</span>\n          <span><i class=\"tm-sw\" data-sw=\"3\"></i>Aut\u00f4nomo PF</span>\n          <span><i class=\"tm-sw\" data-sw=\"m\"></i>CLT, cooperado, residente e outros</span>\n        </div>\n        <div class=\"tm-chart dash-skeleton\" id=\"vinculos\" data-draw=\"vinc\" data-source=\"vinc_grupo kpi_vinc\"></div>\n      </div>\n      <div class=\"tm-card\">\n        <h3 class=\"tm-card-h\">Maiores corpos m\u00e9dicos</h3>\n        <p class=\"tm-card-n\">As <b data-draw=\"lim\" data-k=\"top\">\u2014</b> unidades com mais m\u00e9dicos, com a mesma divis\u00e3o por v\u00ednculo.</p>\n        <div class=\"tm-chart dash-skeleton\" id=\"maiores\" data-draw=\"top\" data-source=\"hospitais\"></div>\n      </div>\n    </div>\n    <div class=\"tm-card\">\n      <h3 class=\"tm-card-h\">Todas as unidades</h3>\n      <p class=\"tm-card-n\"><b data-draw=\"val\" data-source=\"kpi_vinc\" data-field=\"unidades\">\u2014</b> hospitais, UPAs, prontos atendimentos e unidades mistas ativos. Clique no cabe\u00e7alho para ordenar; os v\u00ednculos CLT, cooperado, residente e outros entram s\u00f3 no total. Intermediado \u00e9 o v\u00ednculo feito por empresa, cooperativa ou entidade que fornece o m\u00e9dico \u00e0 unidade, e j\u00e1 est\u00e1 contado nas colunas de tipo.</p>\n      <input class=\"tm-search\" type=\"search\" placeholder=\"Buscar unidade, munic\u00edpio ou mantenedor\" aria-label=\"Buscar unidade, munic\u00edpio ou mantenedor\">\n      <div class=\"tm-tbl-wrap\">\n        <table class=\"tm-tbl tm-hosp\" data-source=\"hospitais\" data-row-key=\"cnes\">\n          <thead><tr>\n            <th data-field=\"cnes\"><button type=\"button\" data-sort=\"cnes\">CNES</button></th>\n            <th data-field=\"unidade\"><button type=\"button\" data-sort=\"unidade\">Unidade</button></th>\n            <th data-field=\"municipio\"><button type=\"button\" data-sort=\"municipio\">Munic\u00edpio</button></th>\n            <th data-field=\"tipo\" class=\"tm-hide-sm\"><button type=\"button\" data-sort=\"tipo\">Tipo</button></th>\n            <th data-field=\"grupo\" class=\"tm-hide-sm\"><button type=\"button\" data-sort=\"grupo\">Mantenedor</button></th>\n            <th data-field=\"medicos\" class=\"num\" aria-sort=\"descending\"><button type=\"button\" data-sort=\"medicos\">M\u00e9dicos</button></th>\n            <th data-field=\"estatutario\" class=\"num\"><button type=\"button\" data-sort=\"estatutario\">Estatut\u00e1rios</button></th>\n            <th data-field=\"temporario\" class=\"num\"><button type=\"button\" data-sort=\"temporario\">Prazo det.</button></th>\n            <th data-field=\"pj\" class=\"num\"><button type=\"button\" data-sort=\"pj\">PJ</button></th>\n            <th data-field=\"autonomo_pf\" class=\"num tm-hide-sm\"><button type=\"button\" data-sort=\"autonomo_pf\">Aut\u00f4nomo PF</button></th>\n            <th data-field=\"intermediado\" class=\"num tm-hide-sm\"><button type=\"button\" data-sort=\"intermediado\">Intermediado</button></th>\n          </tr></thead>\n          <tbody data-draw=\"hosp\"></tbody>\n        </table>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"tm-sec\" id=\"contratacao\">\n    <h2 class=\"tm-sec-h\">Contrata\u00e7\u00e3o de m\u00e9dicos e valores praticados</h2>\n    <p class=\"tm-sec-p\">Levantamento em editais, credenciamentos e contratos do PNCP, editais de concurso e sele\u00e7\u00e3o municipais, folha e despesas do Portal da Transpar\u00eancia de Alagoas e programas federais, com link para a fonte em cada linha: <b data-draw=\"val\" data-source=\"val_kpi\" data-field=\"n_registros\">\u2014</b> valores de remunera\u00e7\u00e3o de <b data-draw=\"val\" data-source=\"val_kpi\" data-field=\"n_contratantes\">\u2014</b> contratantes, <b data-draw=\"val\" data-source=\"cons_kpi\" data-field=\"n\">\u2014</b> pre\u00e7os de consulta e exame e <b data-draw=\"val\" data-source=\"contr_kpi\" data-field=\"n\">\u2014</b> contratos e credenciados. As prefeituras alagoanas publicam pouca contrata\u00e7\u00e3o m\u00e9dica no PNCP; a maior parte do pagamento a m\u00e9dicos no estado passa por plant\u00f5es pagos a pessoa f\u00edsica, que n\u00e3o aparecem como edital.</p>\n    <div class=\"tm-kpis\">\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Plant\u00e3o de 24h em prefeituras (mediana)</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"val_kpi\" data-field=\"p24\" data-fmt=\"brl0\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"val_kpi\" data-field=\"p24h\" data-fmt=\"brl2\">\u2014</b> por hora \u00b7 <b data-draw=\"val\" data-source=\"val_kpi\" data-field=\"n24\">\u2014</b> valores</span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Plant\u00f5es extras de m\u00e9dicos pagos pela SESAU, m\u00e9dia por m\u00eas em 2026</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=pl_mes\" data-field=\"valor\" data-fmt=\"brlmi\">\u2014</span><span class=\"tm-kpi-n\">pagos a pessoa f\u00edsica, fora da folha</span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">M\u00e9dicos prestadores, n\u00e3o efetivos, em cinco hospitais estaduais</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=prest_pct\" data-field=\"valor\" data-fmt=\"pct1\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=prest_n\" data-field=\"valor\">\u2014</b> de <b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=prest_tot\" data-field=\"valor\">\u2014</b> registros, dados da SESAU</span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">M\u00e9dico efetivo da SESAU, remunera\u00e7\u00e3o m\u00e9dia do m\u00eas</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"valores\" data-where=\"id=r020\" data-field=\"valor\" data-fmt=\"brl0\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"valores\" data-where=\"id=r020\" data-field=\"quantidade\">\u2014</b> m\u00e9dicos ativos na folha de agosto de 2026</span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Generalista PSF concursado, Matriz de Camaragibe, 40h</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"valores\" data-where=\"id=r015\" data-field=\"valor\" data-fmt=\"brl0\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"valores\" data-where=\"id=r015\" data-field=\"valor_hora\" data-fmt=\"brl2\">\u2014</b> por hora de vencimento</span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Mais M\u00e9dicos, bolsa mensal, 40h</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"valores\" data-where=\"id=r022\" data-field=\"valor\" data-fmt=\"brl0\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"valores\" data-where=\"id=r022\" data-field=\"valor_hora\" data-fmt=\"brl2\">\u2014</b> por hora</span></div>\n    </div>\n    <div class=\"tm-card\">\n      <h3 class=\"tm-card-h\">Quanto vale a hora m\u00e9dica, por forma de contrata\u00e7\u00e3o</h3>\n      <p class=\"tm-card-n\">Cada ponto \u00e9 um valor levantado, em reais por hora: o plant\u00e3o dividido pelas suas horas e o valor mensal dividido pela carga do m\u00eas. O tra\u00e7o vertical marca a mediana do grupo. A SESAU n\u00e3o publica o valor do seu plant\u00e3o extra, por isso a rede estadual fica fora; o gasto total aparece mais abaixo. Passe o cursor sobre um ponto para ver o documento.</p>\n      <div class=\"tm-legend\"><span><i class=\"tm-sw\" data-sw=\"0\"></i>Prefeituras</span><span><i class=\"tm-sw\" data-sw=\"3\"></i>Governo federal</span></div>\n      <div class=\"tm-chart dash-skeleton\" id=\"valor-hora\" data-draw=\"horas\" data-source=\"hora\"></div>\n    </div>\n    <div class=\"tm-grid\">\n      <div class=\"tm-card\">\n        <h3 class=\"tm-card-h\">Como cada contratante contrata</h3>\n        <div class=\"tm-notes\">\n          <p><b>Governo do Estado (SESAU):</b> poucos m\u00e9dicos efetivos (<b data-draw=\"val\" data-source=\"valores\" data-where=\"id=r020\" data-field=\"quantidade\">\u2014</b> na folha de agosto) e a maior parte da escala feita por prestadores, pagos como servi\u00e7o de pessoa f\u00edsica na rubrica \"plant\u00f5es extras\" do Fundo Estadual de Sa\u00fade. No CNES esse v\u00ednculo aparece como contrato por prazo determinado. N\u00e3o h\u00e1 edital de credenciamento de empresas para escala hospitalar no PNCP, e o concurso de 2026 n\u00e3o tem vaga de m\u00e9dico.</p>\n          <p><b>Uncisal:</b> mant\u00e9m a Maternidade Escola Santa M\u00f4nica, o Hospital Escola H\u00e9lvio Auto e o Portugal Ramalho, com efetivos e tamb\u00e9m plant\u00f5es pagos a pessoa f\u00edsica.</p>\n          <p><b>Macei\u00f3:</b> as UPAs municipais e o Hospital da Cidade s\u00e3o geridos pela Macei\u00f3 Sa\u00fade, servi\u00e7o social aut\u00f4nomo; os m\u00e9dicos aparecem no CNES como aut\u00f4nomos pessoa f\u00edsica, e parte atua como PJ.</p>\n          <p><b>Prefeituras do interior:</b> sele\u00e7\u00e3o tempor\u00e1ria ou concurso com valor por plant\u00e3o de 24h, credenciamento de PF ou PJ para plant\u00f5es e consultas especializadas, e preg\u00f5es em que uma empresa fornece os profissionais por hora ou plant\u00e3o. H\u00e1 unidades inteiramente PJ, como o hospital regional e a UPA de Santana do Ipanema e a UPA de Palmeira dos \u00cdndios.</p>\n          <p><b>Filantr\u00f3picos e privados:</b> Santa Casa de Macei\u00f3, Veredas e Sanat\u00f3rio, entre outros, registram quase todo o corpo m\u00e9dico como aut\u00f4nomo pessoa f\u00edsica.</p>\n        </div>\n      </div>\n      <div class=\"tm-card\">\n        <h3 class=\"tm-card-h\">Plant\u00f5es extras de m\u00e9dicos pagos pela SESAU, por m\u00eas</h3>\n        <p class=\"tm-card-n\">Valor pago no m\u00eas na rubrica de servi\u00e7os m\u00e9dicos de pessoa f\u00edsica do Fundo Estadual de Sa\u00fade. O \u00faltimo m\u00eas ainda est\u00e1 em aberto.</p>\n        <div class=\"tm-chart dash-skeleton\" id=\"plantoes-mes\" data-draw=\"plmes\" data-source=\"plantoes\"></div>\n      </div>\n    </div>\n    <div class=\"tm-card\">\n      <h3 class=\"tm-card-h\">Gasto da SESAU: plant\u00f5es extras pagos a pessoa f\u00edsica e folha de pessoal</h3>\n      <p class=\"tm-card-n\">Valores pagos no ano. Plant\u00f5es de m\u00e9dicos e de outros profissionais v\u00eam da rubrica de servi\u00e7os de pessoa f\u00edsica; a folha \u00e9 a de vencimentos e vantagens fixas dos servidores. Em 2026, de janeiro a outubro.</p>\n      <div class=\"tm-legend\"><span><i class=\"tm-sw\" data-sw=\"0\"></i>Plant\u00f5es de m\u00e9dicos</span><span><i class=\"tm-sw\" data-sw=\"1\"></i>Plant\u00f5es de outros profissionais</span><span><i class=\"tm-sw\" data-sw=\"m\"></i>Folha de servidores</span></div>\n      <div class=\"tm-chart dash-skeleton\" id=\"gasto-ano\" data-draw=\"gasto\" data-source=\"gasto\"></div>\n    </div>\n    <div class=\"tm-card\">\n      <h3 class=\"tm-card-h\">Consultas e exames: pre\u00e7o por atendimento</h3>\n      <p class=\"tm-card-n\">Pre\u00e7o unit\u00e1rio por consulta especializada, ultrassonografia e laudo em credenciamentos e preg\u00f5es de prefeituras. Cada pre\u00e7o, com seu edital e link, est\u00e1 no mapa de pre\u00e7os abaixo.</p>\n      <div class=\"tm-tbl-wrap tm-short\">\n        <table class=\"tm-tbl\" data-source=\"cons_esp\" data-row-key=\"especialidade\">\n          <thead><tr><th data-field=\"especialidade\">Especialidade</th><th data-field=\"registros\" class=\"num\">Valores</th><th data-field=\"municipios\" class=\"num tm-hide-sm\">Munic\u00edpios</th><th data-field=\"mediana\" class=\"num\">Mediana</th><th data-field=\"minimo\" class=\"num\">M\u00ednimo</th><th data-field=\"maximo\" class=\"num\">M\u00e1ximo</th></tr></thead>\n          <tbody data-draw=\"cons\"></tbody>\n        </table>\n      </div>\n    </div>\n    <div class=\"tm-card\" id=\"mapa-precos\">\n      <h3 class=\"tm-card-h\">Mapa de pre\u00e7os: cada valor e sua refer\u00eancia</h3>\n      <p class=\"tm-card-n\">Uma linha por valor encontrado, com o \u00f3rg\u00e3o, o documento de origem (edital, chamamento, folha de pagamento ou portaria), o n\u00famero de controle no PNCP, o item, a quantidade e o link para conferir. Estimado \u00e9 o pre\u00e7o de refer\u00eancia do edital; edital \u00e9 o vencimento fixado em concurso ou sele\u00e7\u00e3o; pago \u00e9 a m\u00e9dia da folha. S\u00e3o <b data-draw=\"val\" data-source=\"mapa_kpi\" data-field=\"valores\">\u2014</b> valores tirados de <b data-draw=\"val\" data-source=\"mapa_kpi\" data-field=\"documentos\">\u2014</b> documentos, todos consultados em <b data-draw=\"val\" data-source=\"mapa_kpi\" data-field=\"consultado_em\" data-fmt=\"data\">\u2014</b>.</p>\n      <div class=\"tm-ctrl\">\n        <input class=\"tm-search tm-search-mapa\" type=\"search\" placeholder=\"Buscar munic\u00edpio, \u00f3rg\u00e3o, especialidade, documento ou empresa\" aria-label=\"Buscar no mapa de pre\u00e7os\">\n        <div class=\"tm-seg\" role=\"group\" aria-label=\"Tipo de valor\">\n          <button type=\"button\" data-tipo=\"\" aria-pressed=\"true\">Todos</button>\n          <button type=\"button\" data-tipo=\"Remunera\u00e7\u00e3o\" aria-pressed=\"false\">Remunera\u00e7\u00e3o</button>\n          <button type=\"button\" data-tipo=\"Consulta\" aria-pressed=\"false\">Consultas</button>\n          <button type=\"button\" data-tipo=\"Exame com laudo\" aria-pressed=\"false\">Exames</button>\n        </div>\n      </div>\n      <p class=\"tm-card-n\"><b data-draw=\"mapacount\">\u2014</b></p>\n      <div class=\"tm-tbl-wrap\">\n        <table class=\"tm-tbl tm-mapa\" data-source=\"mapa\" data-row-key=\"id\">\n          <thead><tr><th data-field=\"id\">N\u00ba</th><th data-field=\"data\">Data</th><th data-field=\"municipio\">Munic\u00edpio</th><th data-field=\"orgao\" class=\"tm-hide-sm\">\u00d3rg\u00e3o</th><th data-field=\"fonte_tipo\" class=\"tm-hide-sm\">Tipo de fonte</th><th data-field=\"documento\">Documento</th><th data-field=\"item\" class=\"num tm-hide-sm\">Item</th><th data-field=\"descricao\">Descri\u00e7\u00e3o</th><th data-field=\"unidade\" class=\"tm-hide-sm\">Unidade</th><th data-field=\"quantidade\" class=\"num tm-hide-sm\">Qtd.</th><th data-field=\"valor\" class=\"num\">Valor</th><th data-field=\"base\">Base</th><th data-field=\"valor_hora\" class=\"num\">Por hora</th><th data-field=\"contratado\" class=\"tm-hide-sm\">Contratado</th><th data-field=\"url\">Link da fonte</th></tr></thead>\n          <tbody data-draw=\"mapatbl\"></tbody>\n        </table>\n      </div>\n    </div>\n    <div class=\"tm-card\">\n      <h3 class=\"tm-card-h\">Contratos com empresas m\u00e9dicas e credenciados</h3>\n      <p class=\"tm-card-n\">Contratos e credenciamentos de servi\u00e7o m\u00e9dico publicados por prefeituras no PNCP, sem laborat\u00f3rios, com valor mensal calculado pela vig\u00eancia. Em Campo Alegre, o valor \u00e9 o homologado para cada credenciado.</p>\n      <input class=\"tm-search tm-search-contr\" type=\"search\" placeholder=\"Buscar munic\u00edpio, empresa, CNPJ ou objeto\" aria-label=\"Buscar nos contratos\">\n      <div class=\"tm-tbl-wrap\">\n        <table class=\"tm-tbl\" data-source=\"contratos\" data-row-key=\"id\">\n          <thead><tr><th data-field=\"municipio\">Munic\u00edpio</th><th data-field=\"fornecedor\">Contratado</th><th data-field=\"cnpj\" class=\"tm-hide-sm\">CNPJ/CPF</th><th data-field=\"tipo_pessoa\" class=\"tm-hide-sm\">Pessoa</th><th data-field=\"objeto\" class=\"tm-hide-sm\">Objeto</th><th data-field=\"valor_global\" class=\"num\">Valor global</th><th data-field=\"meses\" class=\"num tm-hide-sm\">Meses</th><th data-field=\"valor_mes\" class=\"num\">Por m\u00eas</th><th data-field=\"inicio\" class=\"tm-hide-sm\">Vig\u00eancia</th></tr></thead>\n          <tbody data-draw=\"contr\"></tbody>\n        </table>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"tm-sec\" id=\"concursos\">\n    <h2 class=\"tm-sec-h\">Concursos, sal\u00e1rios e vagas</h2>\n    <p class=\"tm-sec-p\">O concurso da SESAU-AL de 2026, com prova no come\u00e7o de novembro, tem <b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=cs_total\" data-field=\"valor\">\u2014</b> vagas e <b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=cs_med\" data-field=\"valor\">\u2014</b> de m\u00e9dico; o de 2021 ofereceu <b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=cs_2021\" data-field=\"valor\">\u2014</b>. Enquanto isso, o n\u00famero de m\u00e9dicos efetivos na folha estadual cai a cada ano, e a escala segue com prestadores.</p>\n    <div class=\"tm-card\">\n      <h3 class=\"tm-card-h\">Sal\u00e1rios de refer\u00eancia</h3>\n      <p class=\"tm-card-n\">Remunera\u00e7\u00e3o m\u00e9dia paga aos efetivos do Estado e vencimentos de concursos e sele\u00e7\u00f5es municipais recentes. Clique na refer\u00eancia para abrir a fonte.</p>\n      <div class=\"tm-tbl-wrap\">\n        <table class=\"tm-tbl\" data-source=\"salarios\" data-row-key=\"id\">\n          <thead><tr><th data-field=\"orgao\">\u00d3rg\u00e3o</th><th data-field=\"cargo\">Cargo</th><th data-field=\"vinculo\">V\u00ednculo</th><th data-field=\"carga\" class=\"tm-hide-sm\">Carga</th><th data-field=\"valor_min\" class=\"num\">A partir de</th><th data-field=\"valor_max\" class=\"num\">At\u00e9</th><th data-field=\"referencia\" class=\"tm-hide-sm\">Refer\u00eancia</th></tr></thead>\n          <tbody data-draw=\"sal\"></tbody>\n        </table>\n      </div>\n    </div>\n    <div class=\"tm-grid\">\n      <div class=\"tm-card\">\n        <h3 class=\"tm-card-h\">M\u00e9dicos efetivos na folha estadual</h3>\n        <p class=\"tm-card-n\">Servidores ativos no cargo de M\u00e9dico em agosto de cada ano, na SESAU e na Uncisal.</p>\n        <div class=\"tm-legend\"><span><i class=\"tm-sw\" data-sw=\"0\"></i>SESAU</span><span><i class=\"tm-sw\" data-sw=\"2\"></i>Uncisal</span></div>\n        <div class=\"tm-chart dash-skeleton\" id=\"folha-chart\" data-draw=\"folhachart\" data-source=\"folha\"></div>\n      </div>\n      <div class=\"tm-card\">\n        <h3 class=\"tm-card-h\">Remunera\u00e7\u00e3o m\u00e9dia do m\u00e9dico efetivo</h3>\n        <p class=\"tm-card-n\">Folha bruta do m\u00eas dividida pelo n\u00famero de m\u00e9dicos ativos, em agosto de cada ano.</p>\n        <div class=\"tm-tbl-wrap tm-short\">\n          <table class=\"tm-tbl\" data-source=\"folha\" data-row-key=\"id\">\n            <thead><tr><th data-field=\"ano\">Ano</th><th data-field=\"orgao\">\u00d3rg\u00e3o</th><th data-field=\"medicos\" class=\"num\">M\u00e9dicos</th><th data-field=\"folha_total\" class=\"num tm-hide-sm\">Folha do m\u00eas</th><th data-field=\"media\" class=\"num\">M\u00e9dia por m\u00e9dico</th></tr></thead>\n            <tbody data-draw=\"folhatbl\"></tbody>\n          </table>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"tm-sec\" id=\"ociosas\">\n    <h2 class=\"tm-sec-h\">Vagas ociosas e sinais de falta</h2>\n    <p class=\"tm-sec-p\">Onde a vaga existe e n\u00e3o h\u00e1 m\u00e9dico: postos do Mais M\u00e9dicos abertos, cargos efetivos que n\u00e3o s\u00e3o oferecidos, especialidades quase ausentes do cadastro e credenciamentos sem interessados.</p>\n    <div class=\"tm-kpis tm-kpis-sm\">\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Mais M\u00e9dicos: vagas abertas no estado</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=mm_vagas\" data-field=\"valor\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=mm_ativos\" data-field=\"valor\">\u2014</b> m\u00e9dicos do programa em atividade, <b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=mm_vagas\" data-field=\"data\" data-fmt=\"mesano\">\u2014</b></span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Cargos efetivos de m\u00e9dico em concurso</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=cs_med\" data-field=\"valor\">\u2014</span><span class=\"tm-kpi-n\">hoje h\u00e1 <b data-draw=\"val\" data-source=\"kpi_vinc\" data-field=\"est\">\u2014</b> v\u00ednculos estatut\u00e1rios nos hospitais e UPAs</span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Munic\u00edpios sem m\u00e9dico registrado</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"kpi\" data-field=\"mun_zero\">\u2014</span><span class=\"tm-kpi-n\">e <b data-draw=\"val\" data-source=\"kpi\" data-field=\"mun_vazio\">\u2014</b> abaixo de <b data-draw=\"val\" data-source=\"kpi\" data-field=\"limite_vazio\" data-fmt=\"dec1\">\u2014</b> por mil hab.</span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Intensivistas com registro no CNES</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"especialidades\" data-where=\"especialidade=M\u00e9dico em medicina intensiva\" data-field=\"total\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"ind_calc\" data-field=\"int_100k\" data-fmt=\"dec2\">\u2014</b> por 100 mil habitantes</span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Pediatras por 100 mil crian\u00e7as de 0 a 14 anos</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"ind_calc\" data-field=\"ped_100k\" data-fmt=\"dec1\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"especialidades\" data-where=\"especialidade=Pediatra\" data-field=\"total\">\u2014</b> pediatras no CNES</span></div>\n      <div class=\"tm-kpi\"><span class=\"tm-kpi-l\">Mais M\u00e9dicos Especialistas em atividade</span><span class=\"tm-kpi-v dash-skeleton\" data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=mme_ativos\" data-field=\"valor\">\u2014</span><span class=\"tm-kpi-n\"><b data-draw=\"val\" data-source=\"indicadores\" data-where=\"id=mme_vagas\" data-field=\"valor\">\u2014</b> vagas no ciclo de julho de 2026</span></div>\n    </div>\n    <div class=\"tm-grid\">\n      <div class=\"tm-card\">\n        <h3 class=\"tm-card-h\">M\u00e9dicos por especialidade registrada</h3>\n        <p class=\"tm-card-n\">Fora do gr\u00e1fico, para n\u00e3o achatar as barras: <b data-draw=\"val\" data-source=\"especialidades\" data-where=\"especialidade=Cl\u00ednico geral\" data-field=\"total\">\u2014</b> cl\u00ednicos gerais e <b data-draw=\"val\" data-source=\"especialidades\" data-where=\"especialidade=M\u00e9dico da ESF (fam\u00edlia)\" data-field=\"total\">\u2014</b> m\u00e9dicos da Sa\u00fade da Fam\u00edlia.</p>\n        <div class=\"tm-legend\"><span><i class=\"tm-sw\" data-sw=\"0\"></i>Atende pelo SUS</span><span><i class=\"tm-sw\" data-sw=\"m\"></i>S\u00f3 fora do SUS</span></div>\n        <div class=\"tm-chart dash-skeleton\" id=\"especialidades\" data-draw=\"espec\" data-source=\"especialidades\"></div>\n      </div>\n      <div class=\"tm-card\">\n        <h3 class=\"tm-card-h\">Evolu\u00e7\u00e3o dos m\u00e9dicos no CNES</h3>\n        <p class=\"tm-card-n\">M\u00e9dicos com v\u00ednculo ativo no estado, compet\u00eancia de setembro de cada ano.</p>\n        <div class=\"tm-chart dash-skeleton\" id=\"evolucao\" data-draw=\"serie\" data-source=\"serie\"></div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"tm-sec\" id=\"noticias\">\n    <h2 class=\"tm-sec-h\">Not\u00edcias recentes sobre falta de m\u00e9dicos</h2>\n    <p class=\"tm-sec-p\">Resumos pr\u00f3prios das reportagens e publica\u00e7\u00f5es, da mais recente para a mais antiga. Clique no resumo para abrir a fonte.</p>\n    <div class=\"tm-card\">\n      <div class=\"tm-tbl-wrap\">\n        <table class=\"tm-tbl\" data-source=\"noticias\" data-row-key=\"id\">\n          <thead><tr><th data-field=\"data\">Data</th><th data-field=\"local\">Local</th><th data-field=\"tema\" class=\"tm-hide-sm\">Tema</th><th data-field=\"resumo\">Resumo</th><th data-field=\"veiculo\" class=\"tm-hide-sm\">Ve\u00edculo</th></tr></thead>\n          <tbody data-draw=\"news\"></tbody>\n        </table>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"tm-sec\" id=\"metodo\">\n    <h2 class=\"tm-sec-h\">M\u00e9todo e fontes</h2>\n    <div class=\"tm-notes\">\n      <p><b>M\u00e9dicos por munic\u00edpio e por especialidade:</b> CNES/DataSUS, TabNet de Recursos Humanos (profissionais segundo CBO), compet\u00eancia de setembro, m\u00e9dicos com v\u00ednculo ativo em qualquer estabelecimento, p\u00fablico ou privado. Um m\u00e9dico que trabalha em dois munic\u00edpios conta em cada um, por isso o total \u00e9 de v\u00ednculos por munic\u00edpio e n\u00e3o de pessoas.</p>\n      <p><b>M\u00e9dicos por hospital e tipo de v\u00ednculo:</b> consulta direta ao CNES por estabelecimento em 02/11/2026 (a primeira vers\u00e3o usou a consulta de outubro), contando os profissionais com ocupa\u00e7\u00e3o de m\u00e9dico em cada hospital, UPA, pronto atendimento e unidade mista ativos; a lista bate com a contagem de estabelecimentos do TabNet. Estatut\u00e1rio inclui servidores cedidos e comissionados; prazo determinado \u00e9 o contrato por tempo determinado, p\u00fablico ou privado; PJ \u00e9 o m\u00e9dico contratado por meio de pessoa jur\u00eddica (aut\u00f4nomo PJ ou intermediado por empresa); intermediado \u00e9 o v\u00ednculo registrado no CNES como feito por empresa, cooperativa ou entidade que fornece o m\u00e9dico, j\u00e1 contado nas colunas de tipo; aut\u00f4nomo PF \u00e9 o m\u00e9dico pago como pessoa f\u00edsica. A soma das unidades passa do total municipal, porque o mesmo m\u00e9dico aparece em mais de uma unidade. Unidades desativadas no CNES ficaram de fora, como os hospitais de campanha e o antigo Hospital do Cora\u00e7\u00e3o.</p>\n      <p><b>Plant\u00f5es extras e folha da SESAU:</b> Portal da Transpar\u00eancia de Alagoas, consulta avan\u00e7ada de despesas (\u00f3rg\u00e3o Secretaria de Estado da Sa\u00fade, valores pagos por rubrica e favorecido \"Plant\u00f5es extras\") e de pessoal (cargo M\u00e9dico, servidores ativos, agosto). O portal agrupa os pagamentos de plant\u00e3o em um \u00fanico favorecido, sem valor por plant\u00e3o nem por m\u00e9dico.</p>\n      <p><b>Valores de prefeituras:</b> itens de editais e credenciamentos de servi\u00e7o m\u00e9dico publicados no PNCP por munic\u00edpios de Alagoas, com o pre\u00e7o de refer\u00eancia do edital, e editais de concurso e sele\u00e7\u00e3o municipais noticiados. O valor por hora divide o plant\u00e3o pelas suas horas e o valor mensal pela carga semanal vezes 4,345 semanas. Ficaram de fora laborat\u00f3rios, itens sem pre\u00e7o e valores globais sem pre\u00e7o unit\u00e1rio.</p>\n      <p><b>Popula\u00e7\u00e3o e idade:</b> estimativa municipal do IBGE para 2025 e Censo 2022 (idade e crescimento). <b>Planos de sa\u00fade:</b> benefici\u00e1rios de planos m\u00e9dico-hospitalares (ANS, compilado pelo IESS) divididos pela popula\u00e7\u00e3o estimada. <b>Mapa:</b> malha municipal do IBGE. <b>Vagas ociosas:</b> Minist\u00e9rio da Sa\u00fade e imprensa, cada n\u00famero com data e fonte.</p>\n      <p>Os n\u00fameros do CNES dependem do que cada unidade informa: uma escala real pode ter menos m\u00e9dicos do que o cadastro mostra. Para decis\u00f5es de contrata\u00e7\u00e3o, confirme com a escala publicada ou com a pr\u00f3pria unidade.</p>\n    </div>\n  </section>\n</div>",
  run: function (dash) {

dash.calc('kpi', {
  inputs: ['municipios'],
  title: 'Indicadores do estado',
  description: 'Totais dos munic\u00edpios: m\u00e9dicos, popula\u00e7\u00e3o, m\u00e9dicos por mil habitantes, parcela de Macei\u00f3 e Arapiraca e munic\u00edpios abaixo dos limites.',
  fn: (municipios) => {
    const limite_baixa = 1, limite_vazio = 0.5;
    const soma = (k) => municipios.reduce((a, r) => a + (Number(r[k]) || 0), 0);
    const medicos = soma('med'), pop = soma('pop');
    const polos = municipios.filter((r) => r.nome === 'Macei\u00f3' || r.nome === 'Arapiraca').reduce((a, r) => a + Number(r.med), 0);
    return [{
      medicos, medicos_sus: soma('med_sus'), pop, dens: medicos / pop * 1000, n_mun: municipios.length,
      mun_baixa: municipios.filter((r) => Number(r.dens) < limite_baixa).length,
      mun_vazio: municipios.filter((r) => Number(r.dens) < limite_vazio).length,
      mun_zero: municipios.filter((r) => Number(r.med) === 0).length,
      conc_share: polos / medicos, limite_baixa, limite_vazio
    }];
  }
});
dash.calc('kpi_vinc', {
  inputs: ['hospitais'],
  title: 'V\u00ednculos m\u00e9dicos nas unidades',
  description: 'Soma dos v\u00ednculos m\u00e9dicos de hospitais e UPAs por tipo e a parcela de cada tipo no total.',
  fn: (hospitais) => {
    const s = (k) => hospitais.reduce((a, r) => a + (Number(r[k]) || 0), 0);
    const est = s('estatutario'), tmp = s('temporario'), pj = s('pj'), pf = s('autonomo_pf');
    const outros = s('clt') + s('cooperado') + s('residente') + s('outros');
    const total = est + tmp + pj + pf + outros;
    return [{ unidades: hospitais.length, vinculos: total, est, tmp, pj, pf, outros, share_est: est / total, share_tmp: tmp / total, share_pj: pj / total, share_pf: pf / total }];
  }
});
dash.calc('vinc_grupo', {
  inputs: ['hospitais'],
  title: 'V\u00ednculos por mantenedor da unidade',
  description: 'V\u00ednculos m\u00e9dicos por tipo, somados por quem mant\u00e9m a unidade (rede estadual, municipal, federal, filantr\u00f3picos e privados).',
  fn: (hospitais) => {
    const g = {};
    for (const r of hospitais) {
      const o = g[r.grupo] || (g[r.grupo] = { grupo: r.grupo, unidades: 0, est: 0, tmp: 0, pj: 0, pf: 0, outros: 0 });
      o.unidades += 1; o.est += Number(r.estatutario); o.tmp += Number(r.temporario); o.pj += Number(r.pj); o.pf += Number(r.autonomo_pf);
      o.outros += Number(r.clt) + Number(r.cooperado) + Number(r.residente) + Number(r.outros);
    }
    return Object.values(g).map((o) => ({ ...o, total: o.est + o.tmp + o.pj + o.pf + o.outros })).sort((a, b) => b.total - a.total);
  }
});
dash.calc('regioes', {
  inputs: ['municipios'],
  title: 'M\u00e9dicos por regi\u00e3o de sa\u00fade',
  description: 'M\u00e9dicos e popula\u00e7\u00e3o somados por regi\u00e3o de sa\u00fade, e m\u00e9dicos por mil habitantes.',
  fn: (municipios) => {
    const g = {};
    for (const r of municipios) {
      const o = g[r.cir_nome] || (g[r.cir_nome] = { regiao: r.cir_nome, n_mun: 0, pop: 0, med: 0 });
      o.n_mun += 1; o.pop += Number(r.pop); o.med += Number(r.med);
    }
    return Object.values(g).map((o) => ({ ...o, dens: o.med / o.pop * 1000 })).sort((a, b) => b.dens - a.dens);
  }
});
dash.calc('demo', {
  inputs: ['municipios', 'indicadores'],
  title: 'Perfil demogr\u00e1fico do estado',
  description: 'Crescimento da popula\u00e7\u00e3o de 2022 a 2025, parcelas de 0 a 14 e de 60 anos ou mais no Censo 2022 e cobertura de planos de sa\u00fade.',
  fn: (municipios, indicadores) => {
    const v = (id) => Number((indicadores.find((r) => r.id === id) || {}).valor) || 0;
    const pop = municipios.reduce((a, r) => a + Number(r.pop), 0), pop22 = municipios.reduce((a, r) => a + Number(r.pop2022), 0);
    const mcz = municipios.find((r) => r.nome === 'Macei\u00f3') || {};
    return [{ cresc: pop / pop22 - 1, cresc_mcz: Number(mcz.pop) / Number(mcz.pop2022) - 1, share_0a14: v('pop22_0a14') / v('pop22'), share_60: v('pop22_60') / v('pop22'), cobertura: v('ans_benef') / pop }];
  }
});
dash.calc('demo_reg', {
  inputs: ['municipios'],
  title: 'Demografia por regi\u00e3o de sa\u00fade',
  description: 'Popula\u00e7\u00e3o, crescimento, parcelas de idade (ponderadas pela popula\u00e7\u00e3o do Censo 2022) e m\u00e9dicos por regi\u00e3o de sa\u00fade.',
  fn: (municipios) => {
    const g = {}, totPop = municipios.reduce((a, r) => a + Number(r.pop), 0), totMed = municipios.reduce((a, r) => a + Number(r.med), 0);
    for (const r of municipios) {
      const o = g[r.cir_nome] || (g[r.cir_nome] = { regiao: r.cir_nome, pop: 0, pop2022: 0, kids: 0, old: 0, med: 0 });
      o.pop += Number(r.pop); o.pop2022 += Number(r.pop2022); o.med += Number(r.med);
      o.kids += Number(r.pct_0a14) / 100 * Number(r.pop2022); o.old += Number(r.pct_60mais) / 100 * Number(r.pop2022);
    }
    return Object.values(g).map((o) => ({ regiao: o.regiao, pop: o.pop, med: o.med, cresc: o.pop / o.pop2022 - 1, share_0a14: o.kids / o.pop2022, share_60: o.old / o.pop2022,
      dens: o.med / o.pop * 1000, share_pop: o.pop / totPop, share_med: o.med / totMed })).sort((a, b) => b.pop - a.pop);
  }
});
dash.calc('ind_calc', {
  inputs: ['especialidades', 'municipios', 'indicadores'],
  title: 'Especialistas por habitante',
  description: 'Intensivistas por 100 mil habitantes e pediatras por 100 mil crian\u00e7as de 0 a 14 anos (Censo 2022).',
  fn: (especialidades, municipios, indicadores) => {
    const e = (n) => Number((especialidades.find((r) => r.especialidade === n) || {}).total) || 0;
    const pop = municipios.reduce((a, r) => a + Number(r.pop), 0);
    const kids = Number((indicadores.find((r) => r.id === 'pop22_0a14') || {}).valor) || 1;
    return [{ int_100k: e('M\u00e9dico em medicina intensiva') / pop * 1e5, ped_100k: e('Pediatra') / kids * 1e5 }];
  }
});

const TM_L = d3.formatLocale({ decimal: ',', thousands: '.', grouping: [3], currency: ['R$ ', ''] });
const TM_F = {
  int: TM_L.format(',d'), dec1: TM_L.format(',.1f'), dec2: TM_L.format(',.2f'), pct: TM_L.format('.0%'),
  brl0: TM_L.format('$,.0f'), brl2: TM_L.format('$,.2f'), raw: (v) => String(v), pct1: TM_L.format('.1%'),
  brlmi: (v) => 'R$ ' + TM_L.format(',.1f')(Number(v) / 1e6) + ' mi',
  mesano: (v) => new Date(String(v).slice(0, 10) + 'T12:00:00Z').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }),
  data: (v) => { const p = String(v).slice(0, 10).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
};
const TM_TEXT = { raw: 1, mesano: 1, data: 1 };
const TM_LIM = { top: 12 };
window.TM = { metric: 'dens', showHosp: true, sort: { key: 'medicos', dir: -1 }, q: '' };

function tmRows(id) { const d = dash.data(id); return d.status === 'ok' ? (d.data || []) : []; }
function tmStatus(ids) {
  let s = 'ok';
  for (const id of ids) {
    const st = dash.data(id).status;
    if (st === 'error' || st === 'declined' || st === 'missing' || st === 'connect') return 'error';
    if (st !== 'ok') s = 'loading';
  }
  return s;
}
function tmPending(el, st) {
  if (st === 'error') {
    el.classList.remove('dash-skeleton');
    const d = document.createElement('div'); d.className = 'tm-fail'; d.textContent = 'N\u00e3o carregou';
    el.replaceChildren(d);
  } else { el.replaceChildren(); el.classList.add('dash-skeleton'); }
}
function tmWhere(rs, w) {
  if (!w) return rs[0];
  const pairs = w.split('&').map((p) => p.split('=').map((x) => decodeURIComponent(x)));
  return rs.find((r) => pairs.every(([k, v]) => String(r[k]) === v));
}
function tmColor(el, c) {
  const s = document.createElement('span'); s.style.color = c; s.style.display = 'none'; el.appendChild(s);
  const css = getComputedStyle(s).color; s.remove();
  try {
    const cv = document.createElement('canvas'); cv.width = 1; cv.height = 1;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#808080'; ctx.fillStyle = css; ctx.fillRect(0, 0, 1, 1);
    const p = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
  } catch (e) { return css; }
}
function tmTip(el) {
  const t = document.createElement('div'); t.className = 'tm-tip'; t.hidden = true; el.appendChild(t);
  return {
    show(ev, head, lines) {
      t.replaceChildren();
      const h = document.createElement('div'); h.className = 'tm-tip-h'; h.textContent = head; t.appendChild(h);
      for (const [label, val, color] of lines) {
        const d = document.createElement('div');
        if (color) { const sw = document.createElement('i'); sw.className = 'tm-sw'; sw.style.background = color; d.appendChild(sw); }
        d.appendChild(document.createTextNode(label + ': '));
        const b = document.createElement('b'); b.textContent = val; d.appendChild(b); t.appendChild(d);
      }
      t.hidden = false;
      const r = el.getBoundingClientRect();
      let x = ev.clientX - r.left + 14, y = ev.clientY - r.top + 14;
      if (x + t.offsetWidth > r.width) x = Math.max(0, ev.clientX - r.left - t.offsetWidth - 14);
      if (y + t.offsetHeight > r.height) y = Math.max(0, ev.clientY - r.top - t.offsetHeight - 14);
      t.style.left = x + 'px'; t.style.top = y + 'px';
    },
    hide() { t.hidden = true; }
  };
}
function tmSvg(el, W, H) {
  return d3.create('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`)
    .style('font-family', 'var(--font-anthropic-sans)').style('font-size', 'var(--cds-font-size-caption)');
}
function tmShort(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + '\u2026' : s; }

// Horizontal bars with the label above each bar; segments stack left to right.
function tmBars(el, items, opts = {}) {
  const W = Math.max(260, el.clientWidth || 400);
  const rowH = 36, top = opts.ref ? 18 : 0, H = top + items.length * rowH + 2;
  const svg = tmSvg(el, W, H);
  el.replaceChildren(svg.node());
  const fmt = opts.fmt || TM_F.int;
  const totals = items.map((it) => it.segs.reduce((a, s) => a + s.v, 0));
  const maxV = opts.max || d3.max(totals) || 1;
  const probe = svg.append('text').text(fmt(maxV));
  const valW = opts.norm ? 0 : probe.node().getComputedTextLength() + 8;
  probe.remove();
  const x = d3.scaleLinear([0, maxV], [0, Math.max(40, W - valW)]);
  const tip = tmTip(el);
  items.forEach((it, i) => {
    const y = top + i * rowH;
    const g = svg.append('g').attr('transform', `translate(0,${y})`);
    g.append('text').attr('x', 0).attr('y', 12).attr('fill', 'var(--color-fg)').text(tmShort(it.label, Math.max(18, Math.floor(W / 7))));
    let x0 = 0;
    it.segs.forEach((s) => {
      const w = Math.max(0, x(s.v));
      if (w > 0) g.append('rect').attr('x', x0).attr('y', 18).attr('width', w).attr('height', 12).attr('rx', 2).attr('fill', s.color);
      if (opts.norm && w > 34) g.append('text').attr('x', x0 + w / 2).attr('y', 28).attr('text-anchor', 'middle').attr('fill', 'var(--color-bg)').style('font-size', '10px').text(TM_F.pct(s.v));
      x0 += w;
    });
    if (!opts.norm) g.append('text').attr('x', x0 + 6).attr('y', 28).attr('fill', 'var(--color-fg-muted)').text(fmt(totals[i]));
    g.append('rect').attr('x', 0).attr('y', 0).attr('width', W).attr('height', rowH).attr('fill', 'transparent')
      .on('pointermove', (ev) => tip.show(ev, it.tip.head, it.tip.lines)).on('pointerleave', () => tip.hide());
  });
  if (opts.ref) {
    const rx = x(opts.ref.v);
    svg.append('line').attr('x1', rx).attr('x2', rx).attr('y1', 14).attr('y2', H).attr('stroke', 'var(--cds-chart-reference)').attr('stroke-dasharray', '4 3');
    const lt = svg.append('text').attr('x', rx).attr('y', 10).attr('fill', 'var(--color-fg-muted)').text(opts.ref.label);
    const lw = lt.node().getComputedTextLength();
    lt.attr('text-anchor', rx + lw / 2 > W ? 'end' : rx - lw / 2 < 0 ? 'start' : 'middle');
  }
}

dash.draw('val', (el) => {
  const d = dash.data(el.dataset.source);
  if (d.status !== 'ok') { el.textContent = '\u2014'; return; }
  const r = tmWhere(d.data || [], el.dataset.where);
  const v = r ? r[el.dataset.field] : null;
  const f = el.dataset.fmt || 'int';
  el.textContent = (v === null || v === undefined || v === '') ? '\u2014' : TM_F[f](TM_TEXT[f] ? v : Number(v));
  el.classList.remove('dash-skeleton');
});
dash.draw('lim', (el) => { el.textContent = TM_F.int(TM_LIM[el.dataset.k]); });

dash.draw('mapa', (el) => {
  const st = tmStatus(['malha', 'municipios', 'hospitais']);
  if (st !== 'ok') { tmPending(el, st); return; }
  el.classList.remove('dash-skeleton');
  el.replaceChildren();
  const malha = tmRows('malha'), mun = tmRows('municipios'), hosp = tmRows('hospitais');
  const byId = new Map(mun.map((r) => [String(r.id), r]));
  const feats = malha.map((r) => ({ id: String(r.id), geom: typeof r.geom === 'string' ? JSON.parse(r.geom) : r.geom }));
  const each = (g, f) => { const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates; for (const p of polys) for (const ring of p) for (const pt of ring) f(pt); };
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  feats.forEach((ft) => each(ft.geom, ([x, y]) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }));
  const kx = Math.cos(((y0 + y1) / 2) * Math.PI / 180);
  const W = Math.max(280, el.clientWidth || 560);
  const H = Math.min(W * (y1 - y0) / ((x1 - x0) * kx), 760);
  const sc = Math.min((W - 16) / ((x1 - x0) * kx), (H - 16) / (y1 - y0));
  const ox = (W - (x1 - x0) * kx * sc) / 2, oy = (H - (y1 - y0) * sc) / 2;
  const P = ([x, y]) => [ox + (x - x0) * kx * sc, oy + (y1 - y) * sc];
  const pathOf = (g) => { const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates; let d = ''; for (const p of polys) for (const ring of p) d += 'M' + ring.map((pt) => P(pt).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z'; return d; };
  const center = (g) => { let sx = 0, sy = 0, n = 0; each(g, (pt) => { const q = P(pt); sx += q[0]; sy += q[1]; n += 1; }); return [sx / n, sy / n]; };

  const metric = window.TM.metric;
  const BINS = { dens: [0.5, 1, 2, 3], dens_sus: [0.5, 1, 2, 3], med: [5, 10, 20, 50, 200], pct_60mais: [11, 12.5, 14, 15.5] };
  const NAMES = { dens: 'M\u00e9dicos por mil hab.', dens_sus: 'M\u00e9dicos SUS por mil hab.', med: 'Total de m\u00e9dicos', pct_60mais: 'Popula\u00e7\u00e3o com 60 anos ou mais' };
  const th = BINS[metric];
  const lo = tmColor(el, 'var(--color-panel)'), hi = tmColor(el, dash.colors[0]);
  const crit = tmColor(el, 'var(--cds-chart-status-critical)');
  const ramp = d3.interpolateRgb(lo, hi);
  const fills = th.concat([Infinity]).map((_, i, a) => ramp(0.16 + 0.84 * i / (a.length - 1)));
  const binOf = (v) => { for (let i = 0; i < th.length; i += 1) if (v < th[i]) return i; return th.length; };
  const fmtT = metric === 'med' ? TM_F.int : metric === 'pct_60mais' ? ((v) => TM_F.dec1(v) + '%') : TM_F.dec1;
  const hatchOn = metric !== 'pct_60mais';

  const svg = tmSvg(el, W, H).attr('role', 'img').attr('aria-label', 'Mapa de calor de m\u00e9dicos por munic\u00edpio de Alagoas');
  el.appendChild(svg.node());
  const defs = svg.append('defs');
  const pat = defs.append('pattern').attr('id', 'tm-hatch').attr('width', 6).attr('height', 6).attr('patternUnits', 'userSpaceOnUse').attr('patternTransform', 'rotate(45)');
  pat.append('rect').attr('width', 6).attr('height', 6).attr('fill', lo);
  pat.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 6).attr('stroke', crit).attr('stroke-width', 2);
  const tip = tmTip(el);
  const gm = svg.append('g');
  feats.forEach((ft) => {
    const r = byId.get(ft.id); if (!r) return;
    const v = Number(r[metric]);
    gm.append('path').attr('d', pathOf(ft.geom))
      .attr('fill', hatchOn && Number(r.med) === 0 ? 'url(#tm-hatch)' : fills[binOf(v)])
      .attr('stroke', 'var(--color-bg)').attr('stroke-width', 0.6)
      .on('pointermove', function (ev) {
        d3.select(this).attr('stroke', 'var(--color-fg)').attr('stroke-width', 1.4).raise();
        tip.show(ev, r.nome + ' \u00b7 ' + r.cir_nome, [
          ['M\u00e9dicos', TM_F.int(Number(r.med))], ['Atendem SUS', TM_F.int(Number(r.med_sus))],
          ['Por mil hab.', TM_F.dec2(Number(r.dens))], ['Popula\u00e7\u00e3o', TM_F.int(Number(r.pop))],
          ['Hospitais e UPAs', TM_F.int(Number(r.n_unid))], ['60 anos ou mais', TM_F.dec1(Number(r.pct_60mais)) + '%'], ['0 a 14 anos', TM_F.dec1(Number(r.pct_0a14)) + '%']]);
      })
      .on('pointerleave', function () { d3.select(this).attr('stroke', 'var(--color-bg)').attr('stroke-width', 0.6); tip.hide(); });
  });
  const lab = svg.append('g').attr('pointer-events', 'none');
  mun.slice().sort((a, b) => Number(b.med) - Number(a.med)).slice(0, 6).forEach((r) => {
    const ft = feats.find((f) => f.id === String(r.id)); if (!ft) return;
    const [cx, cy] = center(ft.geom);
    lab.append('text').attr('x', cx).attr('y', cy - 8).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)')
      .attr('stroke', 'var(--color-panel)').attr('stroke-width', 3).attr('paint-order', 'stroke').style('font-weight', 600).text(r.nome);
  });
  if (window.TM.showHosp) {
    const rs = d3.scaleSqrt([0, d3.max(hosp, (h) => Number(h.medicos)) || 1], [0, Math.max(10, W / 34)]);
    const gh = svg.append('g');
    hosp.slice().sort((a, b) => Number(b.medicos) - Number(a.medicos)).forEach((h) => {
      const [cx, cy] = P([Number(h.lon), Number(h.lat)]);
      gh.append('circle').attr('cx', cx).attr('cy', cy).attr('r', Math.max(2.5, rs(Number(h.medicos))))
        .attr('fill', dash.colors[1]).attr('fill-opacity', 0.55).attr('stroke', 'var(--color-panel)').attr('stroke-width', 1)
        .on('pointermove', (ev) => tip.show(ev, h.unidade, [
          ['Munic\u00edpio', h.municipio], ['Mantenedor', h.grupo], ['M\u00e9dicos', TM_F.int(Number(h.medicos))],
          ['Estatut\u00e1rios', TM_F.int(Number(h.estatutario))], ['Prazo determinado', TM_F.int(Number(h.temporario))],
          ['PJ', TM_F.int(Number(h.pj))], ['Aut\u00f4nomo PF', TM_F.int(Number(h.autonomo_pf))], ['Intermediado', TM_F.int(Number(h.intermediado))]]))
        .on('pointerleave', () => tip.hide());
    });
  }
  const leg = document.createElement('div'); leg.className = 'tm-legend';
  const ttl = document.createElement('span'); ttl.textContent = NAMES[metric] + ':'; leg.appendChild(ttl);
  fills.forEach((c, i) => {
    const s = document.createElement('span'); const sw = document.createElement('i'); sw.className = 'tm-sw'; sw.style.background = c; s.appendChild(sw);
    s.appendChild(document.createTextNode(i === 0 ? 'abaixo de ' + fmtT(th[0]) : i === th.length ? fmtT(th[i - 1]) + ' ou mais' : fmtT(th[i - 1]) + ' a ' + fmtT(th[i])));
    leg.appendChild(s);
  });
  const z = document.createElement('span'); const zs = document.createElement('i'); zs.className = 'tm-sw';
  zs.style.background = `repeating-linear-gradient(45deg, ${crit} 0 2px, ${lo} 2px 5px)`; z.appendChild(zs); z.appendChild(document.createTextNode('sem m\u00e9dico')); leg.appendChild(z);
  if (window.TM.showHosp) {
    const hc = document.createElement('span'); const hs = document.createElement('i'); hs.className = 'tm-sw'; hs.style.borderRadius = '50%'; hs.style.background = dash.colors[1]; hs.style.opacity = '.7';
    hc.appendChild(hs); hc.appendChild(document.createTextNode('hospital ou UPA')); leg.appendChild(hc);
  }
  el.appendChild(leg);
});

dash.draw('reg', (el) => {
  const st = tmStatus(['regioes', 'kpi']);
  if (st !== 'ok') { tmPending(el, st); return; }
  el.classList.remove('dash-skeleton');
  const R = tmRows('regioes'), k = tmRows('kpi')[0];
  tmBars(el, R.map((r) => ({
    label: r.regiao,
    segs: [{ v: Number(r.dens), color: Number(r.dens) >= k.dens ? dash.colors[0] : 'var(--cds-chart-muted)' }],
    tip: { head: r.regiao, lines: [['M\u00e9dicos por mil hab.', TM_F.dec2(Number(r.dens))], ['M\u00e9dicos', TM_F.int(Number(r.med))], ['Popula\u00e7\u00e3o', TM_F.int(Number(r.pop))], ['Munic\u00edpios', TM_F.int(Number(r.n_mun))]] }
  })), { fmt: TM_F.dec2, ref: { v: k.dens, label: 'm\u00e9dia do estado ' + TM_F.dec2(k.dens) } });
});

dash.draw('vazios', (el) => {
  const st = tmStatus(['municipios', 'kpi']);
  if (st !== 'ok') { el.replaceChildren(); return; }
  const lim = tmRows('kpi')[0].limite_vazio;
  const rs = tmRows('municipios').filter((r) => Number(r.dens) < lim).sort((a, b) => Number(a.dens) - Number(b.dens) || Number(b.pop) - Number(a.pop));
  el.replaceChildren(...rs.map((r) => {
    const tr = document.createElement('tr'); tr.dataset.key = String(r.id);
    const cells = [[r.nome], [r.cir_nome, 'tm-hide-sm'], [TM_F.int(Number(r.pop)), 'num'], [TM_F.int(Number(r.med)), 'num'], [TM_F.dec2(Number(r.dens)), 'num']];
    for (const [t, c] of cells) { const td = document.createElement('td'); if (c) td.className = c; td.textContent = t; tr.appendChild(td); }
    return tr;
  }));
});

const TM_SEGS = [['est', 'estatutario', 'Estatut\u00e1rio', 0], ['tmp', 'temporario', 'Prazo determinado', 1], ['pj', 'pj', 'PJ', 2], ['pf', 'autonomo_pf', 'Aut\u00f4nomo PF', 3]];
dash.draw('vinc', (el) => {
  const st = tmStatus(['vinc_grupo', 'kpi_vinc']);
  if (st !== 'ok') { tmPending(el, st); return; }
  el.classList.remove('dash-skeleton');
  const G = tmRows('vinc_grupo'), T = tmRows('kpi_vinc')[0];
  const all = G.map((g) => ({ nome: g.grupo, unidades: g.unidades, est: g.est, tmp: g.tmp, pj: g.pj, pf: g.pf, outros: g.outros, total: g.total }));
  all.push({ nome: 'Todas as unidades', unidades: T.unidades, est: T.est, tmp: T.tmp, pj: T.pj, pf: T.pf, outros: T.outros, total: T.vinculos });
  tmBars(el, all.map((g) => ({
    label: g.nome + ' \u00b7 ' + TM_F.int(g.unidades) + ' unidades \u00b7 ' + TM_F.int(g.total) + ' v\u00ednculos',
    segs: TM_SEGS.map(([k, , , c]) => ({ v: g[k] / g.total, color: dash.colors[c] })).concat([{ v: g.outros / g.total, color: 'var(--cds-chart-muted)' }]),
    tip: { head: g.nome, lines: TM_SEGS.map(([k, , n, c]) => [n, TM_F.int(g[k]) + ' (' + TM_F.pct(g[k] / g.total) + ')', dash.colors[c]]).concat([['CLT, cooperado, residente e outros', TM_F.int(g.outros), 'var(--cds-chart-muted)']]) }
  })), { norm: true, max: 1 });
});

dash.draw('top', (el) => {
  const st = tmStatus(['hospitais']);
  if (st !== 'ok') { tmPending(el, st); return; }
  el.classList.remove('dash-skeleton');
  const H = tmRows('hospitais').slice().sort((a, b) => Number(b.medicos) - Number(a.medicos)).slice(0, TM_LIM.top);
  tmBars(el, H.map((h) => {
    const outros = Number(h.clt) + Number(h.cooperado) + Number(h.residente) + Number(h.outros);
    return {
      label: h.unidade + ' \u00b7 ' + h.municipio,
      segs: TM_SEGS.map(([, f, , c]) => ({ v: Number(h[f]), color: dash.colors[c] })).concat([{ v: outros, color: 'var(--cds-chart-muted)' }]),
      tip: { head: h.unidade, lines: [['M\u00e9dicos (pessoas)', TM_F.int(Number(h.medicos))]].concat(TM_SEGS.map(([, f, n, c]) => [n, TM_F.int(Number(h[f])), dash.colors[c]])).concat([['CLT, cooperado, residente e outros', TM_F.int(outros), 'var(--cds-chart-muted)']]) }
    };
  }));
});

dash.draw('hosp', (el) => {
  const st = tmStatus(['hospitais']);
  if (st !== 'ok') { el.replaceChildren(); return; }
  const all = tmRows('hospitais');
  const max = d3.max(all, (h) => Number(h.medicos)) || 1;
  const norm = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const q = norm(window.TM.q || '');
  const { key, dir } = window.TM.sort;
  const numeric = ['medicos', 'estatutario', 'temporario', 'pj', 'autonomo_pf', 'intermediado'].includes(key);
  const rs = all.filter((h) => !q || norm([h.unidade, h.municipio, h.tipo, h.grupo, h.mantenedora, h.cnes].join(' ')).includes(q))
    .sort((a, b) => numeric ? dir * (Number(a[key]) - Number(b[key])) : dir * String(a[key]).localeCompare(String(b[key]), 'pt-BR'));
  const barColor = dash.colors[0];
  el.replaceChildren(...rs.map((h) => {
    const tr = document.createElement('tr'); tr.dataset.key = String(h.cnes);
    const add = (t, c) => { const td = document.createElement('td'); if (c) td.className = c; td.textContent = t; tr.appendChild(td); return td; };
    add(h.cnes); add(h.unidade); add(h.municipio); add(h.tipo, 'tm-hide-sm'); add(h.grupo, 'tm-hide-sm');
    const td = add('', 'num');
    const bar = document.createElement('span'); bar.className = 'tm-bar'; bar.style.width = Math.max(2, Number(h.medicos) / max * 56) + 'px'; bar.style.background = barColor;
    td.appendChild(bar); td.appendChild(document.createTextNode(TM_F.int(Number(h.medicos))));
    add(TM_F.int(Number(h.estatutario)), 'num'); add(TM_F.int(Number(h.temporario)), 'num'); add(TM_F.int(Number(h.pj)), 'num'); add(TM_F.int(Number(h.autonomo_pf)), 'num tm-hide-sm'); add(TM_F.int(Number(h.intermediado)), 'num tm-hide-sm');
    return tr;
  }));
});

dash.draw('sal', (el) => {
  const st = tmStatus(['salarios']);
  if (st !== 'ok') { el.replaceChildren(); return; }
  el.replaceChildren(...tmRows('salarios').map((s) => {
    const tr = document.createElement('tr'); tr.dataset.key = String(s.id);
    const add = (t, c) => { const td = document.createElement('td'); if (c) td.className = c; td.textContent = t; tr.appendChild(td); return td; };
    add(s.orgao); add(s.cargo); add(s.vinculo); add(s.carga, 'tm-hide-sm'); add(TM_F.brl2(Number(s.valor_min)), 'num'); add(TM_F.brl2(Number(s.valor_max)), 'num');
    const td = document.createElement('td'); td.className = 'tm-hide-sm';
    if (/^https:\/\//.test(String(s.fonte))) { const a = document.createElement('a'); a.href = s.fonte; a.target = '_blank'; a.rel = 'noopener'; a.textContent = s.referencia; td.appendChild(a); } else td.textContent = s.referencia;
    tr.appendChild(td);
    return tr;
  }));
});

dash.draw('espec', (el) => {
  const st = tmStatus(['especialidades']);
  if (st !== 'ok') { tmPending(el, st); return; }
  el.classList.remove('dash-skeleton');
  const skip = ['Cl\u00ednico geral', 'M\u00e9dico da ESF (fam\u00edlia)'];
  const R = tmRows('especialidades').filter((r) => !skip.includes(r.especialidade)).sort((a, b) => Number(b.total) - Number(a.total));
  tmBars(el, R.map((r) => ({
    label: r.especialidade,
    segs: [{ v: Number(r.sus), color: dash.colors[0] }, { v: Number(r.nao_sus), color: 'var(--cds-chart-muted)' }],
    tip: { head: r.especialidade, lines: [['Atende pelo SUS', TM_F.int(Number(r.sus)), dash.colors[0]], ['S\u00f3 fora do SUS', TM_F.int(Number(r.nao_sus)), 'var(--cds-chart-muted)'], ['Total', TM_F.int(Number(r.total))]] }
  })));
});

dash.draw('serie', (el) => {
  const st = tmStatus(['serie']);
  if (st !== 'ok') { tmPending(el, st); return; }
  el.classList.remove('dash-skeleton');
  const R = tmRows('serie');
  const W = Math.max(260, el.clientWidth || 400), H = 220, mt = 22, mb = 24;
  const svg = tmSvg(el, W, H);
  el.replaceChildren(svg.node());
  const x = d3.scaleBand(R.map((r) => r.competencia), [0, W]).padding(0.32);
  const y = d3.scaleLinear([0, d3.max(R, (r) => Number(r.medicos)) * 1.08], [H - mb, mt]);
  const lab = (c) => { const [a, m] = String(c).split('-'); return new Date(Date.UTC(+a, +m - 1, 15)).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric', timeZone: 'UTC' }).replace(' de ', '/').replace('.', ''); };
  svg.append('line').attr('x1', 0).attr('x2', W).attr('y1', H - mb).attr('y2', H - mb).attr('stroke', 'var(--cds-chart-axis)');
  const tip = tmTip(el);
  R.forEach((r, i) => {
    const bx = x(r.competencia), bw = Math.min(32, x.bandwidth()), cx = bx + x.bandwidth() / 2;
    const v = Number(r.medicos), prev = i > 0 ? Number(R[i - 1].medicos) : null;
    svg.append('rect').attr('x', cx - bw / 2).attr('y', y(v)).attr('width', bw).attr('height', y(0) - y(v)).attr('rx', 2).attr('fill', i === R.length - 1 ? dash.colors[0] : 'var(--cds-chart-muted)');
    svg.append('text').attr('x', cx).attr('y', y(v) - 6).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').text(TM_F.int(v));
    svg.append('text').attr('x', cx).attr('y', H - 6).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(lab(r.competencia));
    svg.append('rect').attr('x', bx).attr('y', 0).attr('width', x.bandwidth()).attr('height', H).attr('fill', 'transparent')
      .on('pointermove', (ev) => tip.show(ev, lab(r.competencia), [['M\u00e9dicos', TM_F.int(v)]].concat(prev ? [['Varia\u00e7\u00e3o no ano', (v >= prev ? '+' : '') + TM_F.pct(v / prev - 1)]] : [])))
      .on('pointerleave', () => tip.hide());
  });
});

dash.draw('news', (el) => {
  const st = tmStatus(['noticias']);
  if (st !== 'ok') { el.replaceChildren(); return; }
  const rs = tmRows('noticias').slice().sort((a, b) => String(b.data).localeCompare(String(a.data)));
  el.replaceChildren(...rs.map((n) => {
    const tr = document.createElement('tr'); tr.dataset.key = String(n.id);
    const add = (t, c) => { const td = document.createElement('td'); if (c) td.className = c; td.textContent = t; tr.appendChild(td); return td; };
    add(TM_F.data(n.data), 'num'); add(n.local); add(n.tema, 'tm-hide-sm');
    const td = document.createElement('td');
    if (/^https:\/\//.test(String(n.url))) { const a = document.createElement('a'); a.href = n.url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = n.resumo; td.appendChild(a); } else td.textContent = n.resumo;
    tr.appendChild(td); add(n.veiculo, 'tm-hide-sm');
    return tr;
  }));
});

for (const sw of document.querySelectorAll('.tm [data-sw]')) {
  sw.style.background = sw.dataset.sw === 'm' ? 'var(--cds-chart-muted)' : dash.colors[Number(sw.dataset.sw)];
}
for (const b of document.querySelectorAll('.tm-seg button[data-metric]')) {
  b.addEventListener('click', () => {
    window.TM.metric = b.dataset.metric;
    for (const o of document.querySelectorAll('.tm-seg button[data-metric]')) o.setAttribute('aria-pressed', String(o === b));
    dash.draw('mapa');
  });
}
for (const c of document.querySelectorAll('.tm-hosp-toggle')) {
  c.addEventListener('change', () => { window.TM.showHosp = c.checked; dash.draw('mapa'); });
}
for (const s of document.querySelectorAll('.tm-search:not(.tm-search-mapa):not(.tm-search-contr)')) {
  s.addEventListener('input', () => { window.TM.q = s.value; dash.draw('hosp'); });
}
for (const b of document.querySelectorAll('.tm-hosp th button[data-sort]')) {
  b.addEventListener('click', () => {
    const key = b.dataset.sort, cur = window.TM.sort;
    const numeric = ['medicos', 'estatutario', 'temporario', 'pj', 'autonomo_pf', 'intermediado'].includes(key);
    window.TM.sort = { key, dir: cur.key === key ? -cur.dir : (numeric ? -1 : 1) };
    for (const t of document.querySelectorAll('.tm-hosp th')) {
      const bb = t.querySelector('button[data-sort]');
      if (bb && bb.dataset.sort === key) t.setAttribute('aria-sort', window.TM.sort.dir > 0 ? 'ascending' : 'descending'); else t.removeAttribute('aria-sort');
    }
    dash.draw('hosp');
  });
}
dash.calc('val_kpi', {
  inputs: ['valores'],
  title: 'Valores de refer\u00eancia',
  description: 'Mediana do plant\u00e3o de 24h em prefeituras (PNCP, concursos e sele\u00e7\u00f5es), em valor e por hora, e totais do levantamento.',
  fn: (valores) => {
    const med = (a) => { const s = a.filter((x) => x > 0).sort((x, y) => x - y); const m = Math.floor(s.length / 2); return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : null; };
    const p24 = valores.filter((r) => String(r.grupo).startsWith('Prefeituras') && r.forma === 'Plant\u00e3o 24h');
    return [{
      n_registros: valores.length, n_contratantes: new Set(valores.map((r) => r.contratante)).size,
      p24: med(p24.map((r) => Number(r.valor))), p24h: med(p24.map((r) => Number(r.valor_hora))), n24: p24.length
    }];
  }
});
dash.calc('hora', {
  inputs: ['valores'],
  title: 'Valor por hora por forma de contrata\u00e7\u00e3o',
  description: 'Valores com hora calcul\u00e1vel, agrupados por contratante e forma de pagamento.',
  fn: (valores) => {
    const ordem = ['Plant\u00e3o por credenciamento (PNCP)', 'Profissional terceirizado por hora (preg\u00e3o PNCP)', 'Plant\u00e3o em concurso ou sele\u00e7\u00e3o municipal', 'Carga semanal em concurso municipal', 'Mais M\u00e9dicos (bolsa)'];
    const grupo = (r) => {
      if (r.grupo === 'Prefeituras (PNCP)') return String(r.forma).startsWith('Plant\u00e3o') ? ordem[0] : (r.forma === 'Hora' ? ordem[1] : null);
      if (r.grupo === 'Prefeituras (concurso)') return String(r.forma).startsWith('Plant\u00e3o') ? ordem[2] : ordem[3];
      if (r.vinculo === 'Bolsa (Mais M\u00e9dicos)') return ordem[4];
      return null;
    };
    return valores.filter((r) => Number(r.valor_hora) > 0 && grupo(r)).map((r) => ({
      id: r.id, categoria: grupo(r), ordem: ordem.indexOf(grupo(r)), esfera: r.esfera, contratante: r.contratante, municipio: r.municipio,
      forma: r.forma, especialidade: r.especialidade, vinculo: r.vinculo, valor: Number(r.valor), valor_hora: Number(r.valor_hora), data: r.data, documento: r.documento
    }));
  }
});
dash.calc('cons_esp', {
  inputs: ['consultas'],
  title: 'Pre\u00e7o de consulta por especialidade',
  description: 'Consultas, ultrassonografias e laudos agrupados por especialidade: n\u00famero de valores, munic\u00edpios, mediana, m\u00ednimo e m\u00e1ximo.',
  fn: (consultas) => {
    const g = {};
    for (const r of consultas) {
      const k = r.tipo === 'Consulta' ? r.especialidade : (r.especialidade === 'Ultrassonografia' ? 'Ultrassonografia (exame)' : r.especialidade);
      const o = g[k] || (g[k] = { especialidade: k, v: [], m: new Set() });
      o.v.push(Number(r.valor)); o.m.add(r.municipio);
    }
    return Object.values(g).map((o) => {
      const s = o.v.slice().sort((a, b) => a - b), h = Math.floor(s.length / 2);
      return { especialidade: o.especialidade, registros: s.length, municipios: o.m.size, mediana: s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2, minimo: s[0], maximo: s[s.length - 1] };
    }).sort((a, b) => b.registros - a.registros || b.mediana - a.mediana);
  }
});
dash.calc('cons_kpi', {
  inputs: ['consultas'],
  title: 'Pre\u00e7os de consulta e exame',
  description: 'Quantidade de pre\u00e7os de consulta e exame levantados.',
  fn: (consultas) => [{ n: consultas.length }]
});
dash.calc('contr_kpi', {
  inputs: ['contratos'],
  title: 'Contratos de servi\u00e7o m\u00e9dico',
  description: 'Quantidade de contratos e credenciados levantados.',
  fn: (contratos) => [{ n: contratos.length }]
});

dash.draw('plmes', (el) => {
  const st = tmStatus(['plantoes']);
  if (st !== 'ok') { tmPending(el, st); return; }
  el.classList.remove('dash-skeleton');
  const R = tmRows('plantoes');
  const W = Math.max(260, el.clientWidth || 420), H = 230, mt = 14, mb = 24;
  const svg = tmSvg(el, W, H);
  el.replaceChildren(svg.node());
  const fmt = (v) => TM_F.brlmi(v);
  const maxV = d3.max(R, (r) => Number(r.valor_pago)) || 1;
  const y = d3.scaleLinear([0, maxV * 1.08], [H - mb, mt]);
  const ticks = y.ticks(4);
  const probe = svg.append('text').text(fmt(ticks[ticks.length - 1]));
  const ml = probe.node().getComputedTextLength() + 8; probe.remove();
  const x = d3.scaleBand(R.map((r) => r.competencia), [ml, W]).padding(0.25);
  ticks.forEach((t) => {
    svg.append('line').attr('x1', ml).attr('x2', W).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)');
    svg.append('text').attr('x', ml - 6).attr('y', y(t) + 4).attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text(fmt(t));
  });
  const anos = Array.from(new Set(R.map((r) => String(r.competencia).slice(0, 4))));
  const tip = tmTip(el);
  R.forEach((r) => {
    const v = Number(r.valor_pago), ano = String(r.competencia).slice(0, 4), m = Number(String(r.competencia).slice(5, 7));
    const last = ano === anos[anos.length - 1];
    svg.append('rect').attr('x', x(r.competencia)).attr('y', y(v)).attr('width', x.bandwidth()).attr('height', y(0) - y(v)).attr('rx', 1.5)
      .attr('fill', last ? dash.colors[0] : 'var(--cds-chart-muted)').attr('fill-opacity', r.parcial === true || r.parcial === 'true' ? 0.45 : 1);
    if (m === 1) svg.append('text').attr('x', x(r.competencia)).attr('y', H - 6).attr('fill', 'var(--color-fg-muted)').text(ano);
    svg.append('rect').attr('x', x(r.competencia) - x.step() * x.paddingInner() / 2).attr('y', 0).attr('width', x.step()).attr('height', H).attr('fill', 'transparent')
      .on('pointermove', (ev) => tip.show(ev, new Date(Date.UTC(+ano, m - 1, 15)).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }), [['Pago', TM_F.brl0(v)]].concat(r.parcial === true || r.parcial === 'true' ? [['Situa\u00e7\u00e3o', 'm\u00eas em aberto']] : [])))
      .on('pointerleave', () => tip.hide());
  });
  svg.append('line').attr('x1', ml).attr('x2', W).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', 'var(--cds-chart-axis)');
});

dash.draw('gasto', (el) => {
  const st = tmStatus(['gasto']);
  if (st !== 'ok') { tmPending(el, st); return; }
  el.classList.remove('dash-skeleton');
  const items = [];
  for (const g of tmRows('gasto')) {
    const pm = Number(g.plantoes_medicos), po = Number(g.plantoes_outros), fo = Number(g.folha_vencimentos);
    items.push({ label: g.ano + ' \u00b7 plant\u00f5es extras pagos a pessoa f\u00edsica (' + g.periodo + ')', segs: [{ v: pm, color: dash.colors[0] }, { v: po, color: dash.colors[1] }],
      tip: { head: g.ano + ' \u00b7 ' + g.periodo, lines: [['Plant\u00f5es de m\u00e9dicos', TM_F.brl0(pm), dash.colors[0]], ['Plant\u00f5es de outros profissionais', TM_F.brl0(po), dash.colors[1]], ['Encargos sobre servi\u00e7os de PF', TM_F.brl0(Number(g.encargos_pf))]] } });
    items.push({ label: g.ano + ' \u00b7 folha de servidores (vencimentos e vantagens fixas)', segs: [{ v: fo, color: 'var(--cds-chart-muted)' }],
      tip: { head: g.ano + ' \u00b7 ' + g.periodo, lines: [['Folha de servidores', TM_F.brl0(fo)], ['Servi\u00e7os m\u00e9dico-hospitalares de PJ', TM_F.brl0(Number(g.servicos_pj_medico_hosp))]] } });
  }
  tmBars(el, items, { fmt: TM_F.brlmi });
});

dash.draw('folhachart', (el) => {
  const st = tmStatus(['folha']);
  if (st !== 'ok') { tmPending(el, st); return; }
  el.classList.remove('dash-skeleton');
  const R = tmRows('folha');
  const anos = Array.from(new Set(R.map((r) => String(r.ano)))), orgs = Array.from(new Set(R.map((r) => r.orgao)));
  const W = Math.max(260, el.clientWidth || 400), H = 220, mt = 22, mb = 24;
  const svg = tmSvg(el, W, H);
  el.replaceChildren(svg.node());
  const x0 = d3.scaleBand(anos, [0, W]).padding(0.25), x1 = d3.scaleBand(orgs, [0, x0.bandwidth()]).padding(0.12);
  const y = d3.scaleLinear([0, d3.max(R, (r) => Number(r.medicos)) * 1.12], [H - mb, mt]);
  svg.append('line').attr('x1', 0).attr('x2', W).attr('y1', H - mb).attr('y2', H - mb).attr('stroke', 'var(--cds-chart-axis)');
  const col = (o, i) => dash.colors[i === 0 ? 0 : 2];
  const tip = tmTip(el);
  anos.forEach((a) => {
    svg.append('text').attr('x', x0(a) + x0.bandwidth() / 2).attr('y', H - 6).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(a);
    orgs.forEach((o, i) => {
      const r = R.find((d) => String(d.ano) === a && d.orgao === o); if (!r) return;
      const v = Number(r.medicos), bw = Math.min(32, x1.bandwidth()), cx = x0(a) + x1(o) + x1.bandwidth() / 2;
      svg.append('rect').attr('x', cx - bw / 2).attr('y', y(v)).attr('width', bw).attr('height', y(0) - y(v)).attr('rx', 2).attr('fill', col(o, i));
      svg.append('text').attr('x', cx).attr('y', y(v) - 6).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').text(TM_F.int(v));
      svg.append('rect').attr('x', x0(a) + x1(o)).attr('y', 0).attr('width', x1.bandwidth()).attr('height', H).attr('fill', 'transparent')
        .on('pointermove', (ev) => tip.show(ev, o + ' \u00b7 agosto de ' + a, [['M\u00e9dicos ativos', TM_F.int(v)], ['Folha do m\u00eas', TM_F.brl0(Number(r.folha_total))], ['M\u00e9dia por m\u00e9dico', TM_F.brl2(Number(r.media))]]))
        .on('pointerleave', () => tip.hide());
    });
  });
});

dash.draw('folhatbl', (el) => {
  if (tmStatus(['folha']) !== 'ok') { el.replaceChildren(); return; }
  const rs = tmRows('folha').slice().sort((a, b) => String(b.ano).localeCompare(String(a.ano)) || String(a.orgao).localeCompare(String(b.orgao)));
  el.replaceChildren(...rs.map((r) => {
    const tr = document.createElement('tr'); tr.dataset.key = String(r.id);
    const add = (t, c) => { const td = document.createElement('td'); if (c) td.className = c; td.textContent = t; tr.appendChild(td); return td; };
    add(String(r.ano)); add(r.orgao); add(TM_F.int(Number(r.medicos)), 'num'); add(TM_F.brl0(Number(r.folha_total)), 'num tm-hide-sm'); add(TM_F.brl2(Number(r.media)), 'num');
    return tr;
  }));
});

dash.draw('demoreg', (el) => {
  const st = tmStatus(['demo_reg']);
  if (st !== 'ok') { tmPending(el, st); return; }
  el.classList.remove('dash-skeleton');
  const R = tmRows('demo_reg');
  const W = Math.max(260, el.clientWidth || 400), rowH = 40, H = R.length * rowH + 2;
  const svg = tmSvg(el, W, H);
  el.replaceChildren(svg.node());
  const maxV = d3.max(R, (r) => Math.max(r.share_pop, r.share_med)) || 1;
  const probe = svg.append('text').text(TM_F.pct1(maxV)); const vw = probe.node().getComputedTextLength() + 8; probe.remove();
  const x = d3.scaleLinear([0, maxV], [0, Math.max(40, W - vw)]);
  const tip = tmTip(el);
  R.forEach((r, i) => {
    const g = svg.append('g').attr('transform', `translate(0,${i * rowH})`);
    g.append('text').attr('x', 0).attr('y', 12).attr('fill', 'var(--color-fg)').text(tmShort(r.regiao, Math.max(18, Math.floor(W / 7))));
    g.append('rect').attr('x', 0).attr('y', 17).attr('width', Math.max(1, x(r.share_pop))).attr('height', 8).attr('rx', 2).attr('fill', 'var(--cds-chart-muted)');
    g.append('text').attr('x', x(r.share_pop) + 6).attr('y', 25).attr('fill', 'var(--color-fg-muted)').style('font-size', '10px').text(TM_F.pct1(r.share_pop));
    g.append('rect').attr('x', 0).attr('y', 27).attr('width', Math.max(1, x(r.share_med))).attr('height', 8).attr('rx', 2).attr('fill', dash.colors[0]);
    g.append('text').attr('x', x(r.share_med) + 6).attr('y', 35).attr('fill', 'var(--color-fg)').style('font-size', '10px').text(TM_F.pct1(r.share_med));
    g.append('rect').attr('x', 0).attr('y', 0).attr('width', W).attr('height', rowH).attr('fill', 'transparent')
      .on('pointermove', (ev) => tip.show(ev, r.regiao, [['Popula\u00e7\u00e3o', TM_F.int(r.pop) + ' (' + TM_F.pct1(r.share_pop) + ')', 'var(--cds-chart-muted)'], ['M\u00e9dicos', TM_F.int(r.med) + ' (' + TM_F.pct1(r.share_med) + ')', dash.colors[0]], ['M\u00e9dicos por mil hab.', TM_F.dec2(r.dens)]]))
      .on('pointerleave', () => tip.hide());
  });
});

dash.draw('demotbl', (el) => {
  if (tmStatus(['demo_reg']) !== 'ok') { el.replaceChildren(); return; }
  el.replaceChildren(...tmRows('demo_reg').map((r) => {
    const tr = document.createElement('tr'); tr.dataset.key = String(r.regiao);
    const add = (t, c) => { const td = document.createElement('td'); if (c) td.className = c; td.textContent = t; tr.appendChild(td); return td; };
    add(r.regiao); add(TM_F.int(r.pop), 'num'); add(TM_F.pct1(r.cresc), 'num tm-hide-sm'); add(TM_F.pct1(r.share_0a14), 'num'); add(TM_F.pct1(r.share_60), 'num'); add(TM_F.dec2(r.dens), 'num');
    return tr;
  }));
});

window.TM.qv = ''; window.TM.qc = '';
function tmLink(td, text, url) {
  if (/^https:\/\//.test(String(url))) { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = text; td.appendChild(a); } else td.textContent = text;
}
const tmNorm = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

dash.draw('horas', (el) => {
  const st = tmStatus(['hora']);
  if (st !== 'ok') { tmPending(el, st); return; }
  el.classList.remove('dash-skeleton');
  const R = tmRows('hora');
  const cats = Array.from(new Set(R.slice().sort((a, b) => a.ordem - b.ordem).map((r) => r.categoria)));
  const W = Math.max(280, el.clientWidth || 600), bandH = 46, mb = 26, H = cats.length * bandH + mb;
  const svg = tmSvg(el, W, H);
  el.replaceChildren(svg.node());
  const maxV = d3.max(R, (r) => r.valor_hora) || 1;
  const x = d3.scaleLinear([0, maxV * 1.06], [4, W - 8]);
  const ticks = x.ticks(Math.max(3, Math.floor(W / 110)));
  ticks.forEach((t) => {
    svg.append('line').attr('x1', x(t)).attr('x2', x(t)).attr('y1', 0).attr('y2', H - mb).attr('stroke', 'var(--cds-chart-grid)');
    svg.append('text').attr('x', x(t)).attr('y', H - 8).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(TM_F.brl0(t));
  });
  const colorOf = (r) => r.esfera === 'Equipe' ? 'var(--mx-team)' : r.esfera === 'Municipal' ? dash.colors[0] : r.esfera === 'Estadual' ? dash.colors[1] : dash.colors[3];
  const tip = tmTip(el);
  cats.forEach((c, i) => {
    const y0 = i * bandH;
    const rs = R.filter((r) => r.categoria === c).sort((a, b) => a.valor_hora - b.valor_hora);
    const s = rs.map((r) => r.valor_hora), h = Math.floor(s.length / 2);
    const md = s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
    svg.append('text').attr('x', 4).attr('y', y0 + 12).attr('fill', 'var(--color-fg)').text(c + ' \u00b7 ' + TM_F.int(rs.length) + (rs.length === 1 ? ' valor' : ' valores') + ' \u00b7 mediana ' + TM_F.brl2(md) + '/h');
    rs.forEach((r, j) => {
      const cy = y0 + 28 + ((j % 5) - 2) * 2.6;
      svg.append('circle').attr('cx', x(r.valor_hora)).attr('cy', cy).attr('r', 4).attr('fill', colorOf(r)).attr('fill-opacity', 0.6).attr('stroke', 'var(--color-panel)').attr('stroke-width', 0.8)
        .on('pointermove', (ev) => tip.show(ev, r.contratante + ' \u00b7 ' + r.municipio, [['Forma', r.forma], ['Especialidade', r.especialidade], ['V\u00ednculo', r.vinculo], ['Valor', TM_F.brl2(r.valor)], ['Por hora', TM_F.brl2(r.valor_hora)], ['Data', TM_F.data(r.data)], ['Fonte', r.documento]]))
        .on('pointerleave', () => tip.hide());
    });
    svg.append('line').attr('x1', x(md)).attr('x2', x(md)).attr('y1', y0 + 18).attr('y2', y0 + 38).attr('stroke', 'var(--color-fg)').attr('stroke-width', 2).attr('stroke-linecap', 'round');
  });
});

dash.draw('cons', (el) => {
  if (tmStatus(['cons_esp']) !== 'ok') { el.replaceChildren(); return; }
  el.replaceChildren(...tmRows('cons_esp').map((r) => {
    const tr = document.createElement('tr'); tr.dataset.key = String(r.especialidade);
    const add = (t, c) => { const td = document.createElement('td'); if (c) td.className = c; td.textContent = t; tr.appendChild(td); };
    add(r.especialidade); add(TM_F.int(r.registros), 'num'); add(TM_F.int(r.municipios), 'num tm-hide-sm');
    add(TM_F.brl2(r.mediana), 'num'); add(TM_F.brl2(r.minimo), 'num'); add(TM_F.brl2(r.maximo), 'num');
    return tr;
  }));
});

dash.draw('contr', (el) => {
  if (tmStatus(['contratos']) !== 'ok') { el.replaceChildren(); return; }
  const q = tmNorm(window.TM.qc || '');
  const rs = tmRows('contratos').filter((r) => !q || tmNorm([r.municipio, r.fornecedor, r.objeto, r.contratante, r.cnpj].join(' ')).includes(q))
    .sort((a, b) => Number(b.valor_global) - Number(a.valor_global));
  el.replaceChildren(...rs.map((r) => {
    const tr = document.createElement('tr'); tr.dataset.key = String(r.id);
    const add = (t, c) => { const td = document.createElement('td'); if (c) td.className = c; td.textContent = t; tr.appendChild(td); return td; };
    add(r.municipio); add(r.fornecedor); add(r.cnpj || '\u2014', 'tm-hide-sm'); add(r.tipo_pessoa || '\u2014', 'tm-hide-sm');
    const td = document.createElement('td'); td.className = 'tm-hide-sm'; tmLink(td, r.objeto, r.url); tr.appendChild(td);
    add(TM_F.brl0(Number(r.valor_global)), 'num'); add(r.meses ? TM_F.int(Number(r.meses)) : '\u2014', 'num tm-hide-sm');
    add(r.valor_mes ? TM_F.brl0(Number(r.valor_mes)) : '\u2014', 'num'); add(r.inicio ? TM_F.data(r.inicio) + (r.fim ? ' a ' + TM_F.data(r.fim) : '') : '\u2014', 'tm-hide-sm');
    return tr;
  }));
});

for (const s of document.querySelectorAll('.tm-search-contr')) s.addEventListener('input', () => { window.TM.qc = s.value; dash.draw('contr'); });
dash.calc('mapa', {
  inputs: ['valores', 'consultas'],
  title: 'Mapa de pre\u00e7os',
  description: 'Todos os valores de remunera\u00e7\u00e3o, consulta e exame com a refer\u00eancia de cada um, em uma \u00fanica lista.',
  fn: (valores, consultas) => valores.concat(consultas).map((r) => ({
    id: r.id, tipo_valor: r.tipo_valor, data: r.data, municipio: r.municipio, orgao: r.orgao, fonte_tipo: r.fonte_tipo, documento: r.documento,
    amparo: r.amparo, controle_pncp: r.controle_pncp, item: r.item, descricao: r.descricao, especialidade: r.especialidade, forma: r.forma,
    unidade: r.unidade, quantidade: r.quantidade, valor: Number(r.valor), base: r.base, valor_hora: r.valor_hora, contratado: r.contratado,
    url: r.url, consultado_em: r.consultado_em
  }))
});
dash.calc('mapa_kpi', {
  inputs: ['mapa'],
  title: 'Resumo do mapa de pre\u00e7os',
  description: 'Quantidade de valores e de documentos de origem no mapa de pre\u00e7os e a data de consulta das fontes.',
  fn: (mapa) => [{ valores: mapa.length, documentos: new Set(mapa.map((r) => r.documento + '|' + r.url)).size, consultado_em: mapa.reduce((a, r) => (r.consultado_em > a ? r.consultado_em : a), '') }]
});
window.TM.qm = ''; window.TM.tipo = '';
function tmMapaRows() {
  const q = tmNorm(window.TM.qm || ''), t = window.TM.tipo || '';
  return tmRows('mapa').filter((r) => (!t || r.tipo_valor === t) && (!q || tmNorm([r.municipio, r.orgao, r.especialidade, r.documento, r.descricao, r.contratado, r.forma, r.controle_pncp].join(' ')).includes(q)))
    .sort((a, b) => String(b.data).localeCompare(String(a.data)) || String(a.id).localeCompare(String(b.id)));
}
dash.draw('mapacount', (el) => {
  if (tmStatus(['mapa']) !== 'ok') { el.textContent = '\u2014'; return; }
  const n = tmMapaRows().length, tot = tmRows('mapa').length;
  el.textContent = n === tot ? TM_F.int(tot) + ' valores' : TM_F.int(n) + ' de ' + TM_F.int(tot) + ' valores';
});
dash.draw('mapatbl', (el) => {
  if (tmStatus(['mapa']) !== 'ok') { el.replaceChildren(); return; }
  el.replaceChildren(...tmMapaRows().map((r) => {
    const tr = document.createElement('tr'); tr.dataset.key = String(r.id);
    const add = (t, c) => { const td = document.createElement('td'); if (c) td.className = c; td.textContent = t; tr.appendChild(td); return td; };
    const nada = (v) => v === null || v === undefined || v === '';
    add(r.id); add(TM_F.data(r.data), 'num'); add(r.municipio); add(r.orgao, 'tm-hide-sm'); add(r.fonte_tipo, 'tm-hide-sm');
    add(r.documento + (r.controle_pncp ? ' \u00b7 PNCP ' + r.controle_pncp : ''));
    add(nada(r.item) ? '\u2014' : TM_F.int(Number(r.item)), 'num tm-hide-sm'); add(r.descricao); add(nada(r.unidade) ? '\u2014' : r.unidade, 'tm-hide-sm');
    add(nada(r.quantidade) ? '\u2014' : TM_F.int(Number(r.quantidade)), 'num tm-hide-sm');
    add(TM_F.brl2(r.valor), 'num'); add(r.base); add(nada(r.valor_hora) ? '\u2014' : TM_F.brl2(Number(r.valor_hora)), 'num');
    add(nada(r.contratado) ? '\u2014' : r.contratado, 'tm-hide-sm');
    const td = document.createElement('td'); td.style.wordBreak = 'break-all'; tmLink(td, r.url, r.url); tr.appendChild(td);
    return tr;
  }));
});
for (const s of document.querySelectorAll('.tm-search-mapa')) s.addEventListener('input', () => { window.TM.qm = s.value; dash.draw('mapatbl'); dash.draw('mapacount'); });
for (const b of document.querySelectorAll('.tm-seg button[data-tipo]')) {
  b.addEventListener('click', () => {
    window.TM.tipo = b.dataset.tipo;
    for (const o of document.querySelectorAll('.tm-seg button[data-tipo]')) o.setAttribute('aria-pressed', String(o === b));
    dash.draw('mapatbl'); dash.draw('mapacount');
  });
}
const tmGo = (el) => { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); dash.setLink(el.id); };
for (const b of document.querySelectorAll('.tm-nav button[data-go]')) {
  b.addEventListener('click', () => { const t = document.getElementById(b.dataset.go); if (t) tmGo(t); });
}

  }
};
