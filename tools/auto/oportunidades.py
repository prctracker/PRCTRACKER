"""Open opportunities for a medical PJ in the states with a report: PNCP contratações whose proposal period is still open
(credenciamento, chamamento/inexigibilidade, pregão, concorrência, dispensa, manifestação de interesse, pré-qualificação),
filtered to medical services. Replaces src/_auto/oportunidades.json on every run (closed ones drop out)."""
import re, time
from datetime import timedelta
from comum import *

MODS = {12: 'Credenciamento', 9: 'Inexigibilidade', 6: 'Pregão eletrônico', 7: 'Pregão presencial', 4: 'Concorrência eletrônica',
        5: 'Concorrência presencial', 8: 'Dispensa', 10: 'Manifestação de interesse', 11: 'Pré-qualificação'}
hoje = agora().date(); ate = (hoje + timedelta(days=730)).strftime('%Y%m%d')
out, erros, vistos = [], [], set()
for uf, (sig, nome, _) in UFS.items():
    for mod, mnome in MODS.items():
        p = 1
        while True:
            try:
                d = get_json(f'https://pncp.gov.br/api/consulta/v1/contratacoes/proposta?dataFinal={ate}&uf={sig}&codigoModalidadeContratacao={mod}&pagina={p}&tamanhoPagina=50')
            except Exception as e:
                erros.append(f'{sig} {mnome}: {e}'); break
            if not d: break
            for c in d.get('data') or []:
                ctrl = c['numeroControlePNCP']
                if ctrl in vistos: continue
                texto = (c.get('objetoCompra') or '') + ' ' + (c.get('informacaoComplementar') or '')
                if not e_servico_medico(texto): continue
                vistos.add(ctrl)
                cnpj = c['orgaoEntidade']['cnpj']; ano = c['anoCompra']; seq = c['sequencialCompra']; u = c.get('unidadeOrgao') or {}
                itens = []
                try:
                    its = get_json(f'https://pncp.gov.br/api/pncp/v1/orgaos/{cnpj}/compras/{ano}/{seq}/itens?pagina=1&tamanhoPagina=200', tentativas=3)
                    if isinstance(its, list):
                        bons = [it for it in its if e_servico_medico(it.get('descricao') or '')]
                        itens = [dict(descricao=re.sub(r'<[^>]+>', ' ', it.get('descricao') or '').strip()[:220], quantidade=it.get('quantidade'),
                                      unidade=it.get('unidadeMedida'), valor_unitario=it.get('valorUnitarioEstimado')) for it in bons[:8]]
                        n_itens = len(bons)
                    else:
                        n_itens = None
                except Exception:
                    n_itens = None
                out.append(dict(id=ctrl, uf=sig, ibge=u.get('codigoIbge'), municipio=u.get('municipioNome'), orgao=c['orgaoEntidade'].get('razaoSocial'),
                                unidade=u.get('nomeUnidade'), esfera=c['orgaoEntidade'].get('esferaId'), modalidade=c.get('modalidadeNome') or mnome,
                                instrumento=c.get('tipoInstrumentoConvocatorioNome'), numero=c.get('numeroCompra'), processo=c.get('processo'),
                                objeto=re.sub(r'\s+', ' ', c.get('objetoCompra') or '').strip(),
                                complemento=re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', c.get('informacaoComplementar') or '')).strip()[:400] if len((c.get('objetoCompra') or '').strip()) < 60 else '',
                                valor_estimado=c.get('valorTotalEstimado'),
                                abertura=c.get('dataAberturaProposta'), encerramento=c.get('dataEncerramentoProposta'), publicado=(c.get('dataPublicacaoPncp') or '')[:10],
                                situacao=c.get('situacaoCompraNome'), srp=c.get('srp'), link_pncp=f'https://pncp.gov.br/app/editais/{cnpj}/{ano}/{seq}',
                                link_sistema=c.get('linkSistemaOrigem') or c.get('linkProcessoEletronico') or '', itens=itens, n_itens=n_itens,
                                coletado_em=hoje.isoformat()))
                time.sleep(0.4)
            if p >= (d.get('totalPaginas') or 1): break
            p += 1; time.sleep(1)
    print(sig, sum(1 for o in out if o['uf'] == sig), flush=True)
out.sort(key=lambda o: (o.get('encerramento') or '9999'))
anterior = ler(os.path.join(AUTO, 'oportunidades.json'), [])
if erros and len(out) < 0.5 * len(anterior):
    print('Falhas demais; lista anterior mantida:', erros[:5])
else:
    gravar(os.path.join(AUTO, 'oportunidades.json'), out, 1)
est = ler(os.path.join(AUTO, 'estado.json'), {}); est['oportunidades_em'] = iso(); est['oportunidades_erros'] = erros[:10]
gravar(os.path.join(AUTO, 'estado.json'), est, 1)
print('total', len(out), 'erros', len(erros), erros[:3])
