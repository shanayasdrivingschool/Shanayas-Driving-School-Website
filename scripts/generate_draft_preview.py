from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DRAFT_DIR = ROOT / 'SEO Blogs Data'
OUT = ROOT / 'tmp' / 'draft-preview'

DRAFTS = [
    ('route-alerts', 'GREATER_VICTORIA_ROUTE_ALERTS_NOV_2026.md', 'Greater Victoria roadwork and route alerts'),
    ('malahat-fog', 'FOG_MALAHAT_DRIVING_CHECKLIST_NOV_2026.md', 'Fog on the Malahat and Island Highway'),
    ('lets-get-visible', 'LETS_GET_VISIBLE_GREATER_VICTORIA_NOV_2026.md', 'Let’s Get Visible Day in Greater Victoria'),
    ('project-red-ribbon', 'PROJECT_RED_RIBBON_SOBER_DRIVING_VICTORIA_NOV_2026.md', 'Project Red Ribbon sober-driving pledge'),
]


def inline(text: str) -> str:
    text = html.escape(text, quote=False)
    text = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'<a href="\2" target="_blank" rel="noopener noreferrer">\1</a>', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    return text


def render_markdown(source: str) -> str:
    lines = source.splitlines()
    out: list[str] = []
    paragraph: list[str] = []
    list_tag: str | None = None

    def flush_paragraph() -> None:
        nonlocal paragraph
        if paragraph:
            out.append(f'<p>{inline(" ".join(paragraph))}</p>')
            paragraph = []

    def close_list() -> None:
        nonlocal list_tag
        if list_tag:
            out.append(f'</{list_tag}>')
            list_tag = None

    for raw in lines:
        line = raw.rstrip()
        if not line.strip():
            flush_paragraph()
            close_list()
            continue
        if line.startswith('### '):
            flush_paragraph(); close_list(); out.append(f'<h3>{inline(line[4:])}</h3>'); continue
        if line.startswith('## '):
            flush_paragraph(); close_list(); out.append(f'<h2>{inline(line[3:])}</h2>'); continue
        if line.startswith('# '):
            flush_paragraph(); close_list(); out.append(f'<h1>{inline(line[2:])}</h1>'); continue
        if line.startswith('> '):
            flush_paragraph(); close_list(); out.append(f'<blockquote>{inline(line[2:])}</blockquote>'); continue
        m = re.match(r'^[-*] (.+)$', line)
        if m:
            flush_paragraph()
            if list_tag != 'ul':
                close_list(); out.append('<ul>'); list_tag = 'ul'
            out.append(f'<li>{inline(m.group(1))}</li>')
            continue
        m = re.match(r'^\d+\. (.+)$', line)
        if m:
            flush_paragraph()
            if list_tag != 'ol':
                close_list(); out.append('<ol>'); list_tag = 'ol'
            out.append(f'<li>{inline(m.group(1))}</li>')
            continue
        if line.startswith('**') and line.endswith('**') and line.count('**') == 2:
            flush_paragraph(); close_list(); out.append(f'<p class="meta"><strong>{inline(line[2:-2])}</strong></p>'); continue
        paragraph.append(line)

    flush_paragraph(); close_list()
    return '\n'.join(out)

CSS = '''
:root { color-scheme: light; --blue:#1d52a1; --red:#e6242a; --ink:#172033; --muted:#526174; --line:#dbe3ee; --wash:#f5f8fc; }
* { box-sizing:border-box; }
body { margin:0; background:var(--wash); color:var(--ink); font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height:1.68; }
.shell { display:grid; grid-template-columns:260px minmax(0,1fr); min-height:100vh; }
aside { position:sticky; top:0; height:100vh; overflow:auto; padding:28px 20px; background:#fff; border-right:1px solid var(--line); }
aside h2 { margin:0 0 6px; color:var(--blue); font-size:1.05rem; line-height:1.3; }
aside p { margin:0 0 22px; color:var(--muted); font-size:.85rem; }
aside a { display:block; padding:10px 11px; margin:5px 0; border-radius:10px; color:var(--ink); text-decoration:none; font-weight:650; font-size:.9rem; }
aside a:hover, aside a.active { background:#eef4ff; color:var(--blue); }
main { padding:40px 24px 80px; }
.banner { max-width:860px; margin:0 auto 22px; padding:12px 16px; border:1px solid #f3c6c8; border-radius:12px; background:#fff8f8; color:#8b1f25; font-size:.9rem; }
article { max-width:860px; margin:0 auto; padding:48px 56px; background:#fff; border:1px solid var(--line); border-radius:20px; box-shadow:0 12px 34px rgba(23,32,51,.07); }
h1 { margin:0 0 8px; color:var(--blue); font-size:clamp(2rem,4vw,3.1rem); line-height:1.12; letter-spacing:-.03em; }
h2 { margin:34px 0 10px; color:var(--blue); font-size:1.55rem; line-height:1.25; }
h3 { margin:24px 0 8px; color:var(--ink); font-size:1.18rem; }
p { margin:0 0 16px; }
p.meta { color:var(--muted); font-size:.9rem; margin-bottom:4px; }
a { color:var(--blue); text-decoration:underline; text-underline-offset:3px; }
ul, ol { margin:0 0 18px 22px; padding:0; }
li { margin:6px 0; }
blockquote { margin:20px 0; padding:14px 18px; border-left:4px solid var(--red); background:#fff7f7; color:#39465a; font-size:1.05rem; }
code { padding:2px 5px; border-radius:5px; background:#eef2f7; font-size:.9em; }
@media (max-width: 780px) { .shell { display:block; } aside { position:static; height:auto; border-right:0; border-bottom:1px solid var(--line); } aside nav { display:flex; gap:6px; overflow:auto; } aside a { min-width:210px; } main { padding:20px 12px 48px; } article { padding:30px 22px; border-radius:14px; } }
'''

OUT.mkdir(parents=True, exist_ok=True)
for slug, filename, title in DRAFTS:
    body = render_markdown((DRAFT_DIR / filename).read_text())
    nav = '\n'.join(f'<a href="{s}.html">{html.escape(t)}</a>' for s, _, t in DRAFTS)
    page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{html.escape(title)} — Draft preview</title><style>{CSS}</style></head><body><div class="shell"><aside><h2>Shanaya’s draft preview</h2><p>Review-only pages. These drafts are not live.</p><nav>{nav}</nav></aside><main><div class="banner"><strong>Draft preview:</strong> content is evidence-backed and reviewable, but remains unpublished pending final live-source checks and instructor review.</div><article>{body}</article></main></div></body></html>'''
    (OUT / f'{slug}.html').write_text(page)

index_cards = '\n'.join(f'<a class="card" href="{s}.html"><strong>{html.escape(t)}</strong><span>Open draft page →</span></a>' for s, _, t in DRAFTS)
index = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Shanaya’s blog draft preview</title><style>{CSS} .cards{{max-width:860px;margin:28px auto;display:grid;gap:14px}} .card{{display:flex;justify-content:space-between;gap:18px;align-items:center;padding:20px 22px;border:1px solid var(--line);border-radius:14px;background:#fff;color:var(--ink);text-decoration:none;box-shadow:0 8px 22px rgba(23,32,51,.05)}} .card:hover{{border-color:#9cb7e8;transform:translateY(-1px)}} .card span{{color:var(--blue);font-weight:700;white-space:nowrap}} @media(max-width:600px){{.card{{display:block}}.card span{{display:block;margin-top:8px}}}}</style></head><body><main><div class="banner"><strong>Draft preview:</strong> these are local review pages, not published blog URLs.</div><section class="cards"><h1>Shanaya’s blog draft preview</h1><p>Choose a page to review the reader-facing draft, source links, internal links, review attribution and soft CTA.</p>{index_cards}</section></main></body></html>'''
(OUT / 'index.html').write_text(index)
print(f'Generated {len(DRAFTS)} draft pages in {OUT}')
