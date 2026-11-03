"""Assemble the publishable site: inline app.js into index.html and copy data and state modules."""
import os
import shutil
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SITE = os.path.join(ROOT, 'site')
DIST = os.path.join(ROOT, 'dist')

if os.path.exists(DIST):
    shutil.rmtree(DIST)
os.makedirs(DIST)
html = open(os.path.join(SITE, 'index.html'), encoding='utf-8').read()
app = open(os.path.join(SITE, 'app.js'), encoding='utf-8').read()
assert '/*__APP__*/' in html
if '</script' in app:
    sys.exit('app.js contains a closing script tag')
html = html.replace('/*__APP__*/', app)
open(os.path.join(DIST, 'index.html'), 'w', encoding='utf-8').write(html)
for sub in ('data', 'estados', 'assets'):
    shutil.copytree(os.path.join(SITE, sub), os.path.join(DIST, sub))
for f in os.listdir(os.path.join(DIST, 'estados')):
    t = open(os.path.join(DIST, 'estados', f), encoding='utf-8').read()
    if '</script' in t.lower():
        print('note: </script inside', f, '(served as a separate file, harmless)')
total = 0
files = []
for dp, _, fs in os.walk(DIST):
    for f in fs:
        p = os.path.join(dp, f)
        total += os.path.getsize(p)
        files.append(os.path.relpath(p, DIST))
print(len(files), 'files', round(total / 1e6, 2), 'MB; index.html', os.path.getsize(os.path.join(DIST, 'index.html')), 'bytes')
