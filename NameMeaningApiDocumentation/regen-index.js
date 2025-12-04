import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = 'public';
const SITE_URL = process.env.SITE_URL || 'https://nameversedocumentations.vercel.app';

function atomicWrite(filePath, content) {
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, content, 'utf8');
  fs.renameSync(tmp, filePath);
}

function regenerate() {
  const files = fs.readdirSync(PUBLIC_DIR).filter((f) => {
    return /^sitemap-(?:\d+).*\.xml$/.test(f) && f !== 'sitemap-index.xml';
  });

  files.sort((a, b) => {
    const na = (a.match(/sitemap-(\d+)/) || [])[1];
    const nb = (b.match(/sitemap-(\d+)/) || [])[1];
    if (na && nb) return Number(na) - Number(nb);
    return a.localeCompare(b);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files
    .map((f) => `  <sitemap>\n    <loc>${SITE_URL.replace(/\/$/, '')}/${f}</loc>\n  </sitemap>`)
    .join('\n')}\n</sitemapindex>`;

  const out = path.join(PUBLIC_DIR, 'sitemap-index.xml');
  atomicWrite(out, xml);
  console.log(`Wrote sitemap-index.xml with ${files.length} entries.`);
}

regenerate();
