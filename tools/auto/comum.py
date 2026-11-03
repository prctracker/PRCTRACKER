"""Shared helpers for the automatic updates."""
import json, os, re, time, unicodedata, urllib.request, urllib.error
from datetime import datetime, timezone, timedelta

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, 'src')
AUTO = os.path.join(SRC, '_auto')
UFS = {'to': ('TO', 'Tocantins', '17'), 'rr': ('RR', 'Roraima', '14'), 'al': ('AL', 'Alagoas', '27'), 'rs': ('RS', 'Rio Grande do Sul', '43'), 'ro': ('RO', 'Rondônia', '11')}
BRT = timezone(timedelta(hours=-3))

def agora():
    return datetime.now(BRT)

def iso(d=None):
    return (d or agora()).isoformat(timespec='seconds')

def ler(p, padrao=None):
    try:
        with open(p, encoding='utf-8') as f: return json.load(f)
    except FileNotFoundError:
        return padrao

def gravar(p, obj, indent=None):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f: json.dump(obj, f, ensure_ascii=False, indent=indent)

def get_json(url, tentativas=5, timeout=90):
    err = None
    for k in range(tentativas):
        try:
            req = urllib.request.Request(url, headers={'Accept': 'application/json', 'User-Agent': 'atlas-medico-prctracker/1.0'})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                b = r.read()
                return json.loads(b.decode('utf-8')) if b else None
        except urllib.error.HTTPError as e:
            if e.code in (204, 404): return None
            err = e
        except Exception as e:
            err = e
        time.sleep(3 + 3 * k)
    raise err

def norm(s):
    return unicodedata.normalize('NFD', str(s or '')).encode('ascii', 'ignore').decode().lower()

# Medical-service filter (same terms as the report method; laboratory excluded).
INCLUI = re.compile(r'medic|plantao|plantoes|plantonista|anestesi|cirurgi|consultas? (medicas? )?especializad|ultrassonograf|ultrasonograf|laudo|terapia intensiva|\buti\b|intensivista|pediatr|ortoped|obstetr|ginecolog|cardiolog|psiquiatr|radiolog')
EXCLUI = re.compile(r'medicament|material|insumo|equipamento|aparelho|mobiliari|genero|alimenta|combustive|veiculo|locacao|manutencao|odontol|laborat|fisioterap|psicolog|veterin|curso|congresso|capacitac|treinamento|oxigenio|gases|ortese|protese|opme|lavanderia|limpeza|vigilancia|software|sistema de|uniforme|enxoval|dieta|nutricao|medico-hospitalar|medico hospitalar|hospitalares|instrumental|reagente|vacina|seringa|luva|fralda|cadeira|maca|ambulancia|transporte|exames laboratoriais|hemodialise de|reforma|construcao|obra|castra|canin|felin|animal|grampeador|clipe|tesoura|foco clinico|mesa|\bpedido\b|aquisicao|compra de|faculdade de medicina|fac\. medicina|ocupacion|admissiona|profissiografico|\bppp\b|anti.?hb|sorolog|hemograma|glicemia|caixas? de som|acolhimento institucional|institucionaliza|vistoria|pericia veterin')

def e_servico_medico(texto):
    t = norm(texto)
    return bool(INCLUI.search(t)) and not EXCLUI.search(t)
