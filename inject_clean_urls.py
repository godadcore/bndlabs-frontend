#!/usr/bin/env python3
"""
inject_clean_urls.py
Inserts a clean-URL JavaScript snippet into all .html files under a directory.
Creates backups with .bak extension. Idempotent (checks marker).
Usage: python inject_clean_urls.py .
"""

import sys
from pathlib import Path

SNIPPET = """<script>
(function(){
  const MARKER = '/*__CLEAN_URLS_INJECTED__*/';
  if (window.__CLEAN_URLS_INJECTED) return;
  window.__CLEAN_URLS_INJECTED = true;

  document.addEventListener("DOMContentLoaded", () => {
    try {
      const links = document.querySelectorAll("a[href]");
      links.forEach(link => {
        let href = link.getAttribute("href");
        if (!href) return;

        // Skip external links, anchors, mailto:, javascript:
        if (/^(https?:|\\/\\/|#|mailto:|javascript:)/i.test(href)) return;

        // Only convert .html, .htm or /index.html
        if (href.match(/\\.html?$|\\/index\\.html?$/i)) {
          const parts = href.split(/(#|\\?)/);
          const main = parts[0]
            .replace(/index\\.html?$/i, '')
            .replace(/\\.html?$/i, '');
          const tail = parts.slice(1).join('');

          let clean = main || '/';
          if (!clean.startsWith('/')) clean = '/' + clean;
          if (tail) clean += tail;

          link.setAttribute('href', clean);
        }
      });
    } catch (err) {
      console.warn('Clean URL script error:', err);
    }
  });
})();
 /*__CLEAN_URLS_INJECTED__*/ 
</script>
"""

MARKER = '__CLEAN_URLS_INJECTED__'

def process_file(path: Path):
    txt = path.read_text(encoding='utf-8')

    if MARKER in txt:
        print(f"SKIP (already done): {path}")
        return

    idx = txt.lower().rfind('</body>')
    if idx != -1:
        new_txt = txt[:idx] + SNIPPET + txt[idx:]
    else:
        new_txt = txt + "\n" + SNIPPET

    # Backup original file
    backup = path.with_suffix(path.suffix + ".bak")
    backup.write_text(txt, encoding="utf-8")

    # Save updated file
    path.write_text(new_txt, encoding="utf-8")

    print(f"Injected → {path}   (backup: {backup.name})")

def main():
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    html_files = list(target.rglob("*.html")) + list(target.rglob("*.htm"))

    if not html_files:
        print("No HTML files found.")
        return

    print(f"Found {len(html_files)} HTML files.")
    for file in html_files:
        process_file(file)

if __name__ == "__main__":
    main()
