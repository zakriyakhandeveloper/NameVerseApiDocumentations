import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// ========================
// CONFIG
// ========================
const SITE_URL = process.env.SITE_URL || "https://nameverse.vercel.app";
const API_BASE = process.env.API_BASE || "https://namverse-api.vercel.app/api/names";

const RELIGIONS = ["islamic", "hindu", "christian"];
const LIMIT = 100;                // API fetch limit
const URLS_PER_SITEMAP = 1000;    // Max URLs per sitemap file
const PUBLIC_DIR = "public";
const PROGRESS_FILE = path.join(PUBLIC_DIR, "sitemap-progress.json");

// Ensure /public exists
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR);

// ========================
// PROGRESS FUNCTIONS
// ========================
function loadProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) {
    return { lastReligionIndex: 0, lastPage: 1, sitemapIndex: 1 };
  }
  return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"));
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

// ========================
// SITEMAP WRITER
// ========================
function atomicWrite(filePath, content) {
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, content, "utf8");
  fs.renameSync(tmp, filePath);
}

function writeSitemap(index, urls) {
  const filePath = path.join(PUBLIC_DIR, `sitemap-${index}.xml`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (url) => `<url>\n  <loc>${url}</loc>\n  <changefreq>weekly</changefreq>\n  <priority>0.8</priority>\n</url>`
    )
    .join("\n")}\n</urlset>`;

  atomicWrite(filePath, xml);
  console.log(`✅ Created sitemap-${index}.xml (${urls.length} URLs)`);
}

// ========================
// SITEMAP INDEX GENERATOR
// ========================
function writeSitemapIndex(totalSitemaps) {
  const indexFile = path.join(PUBLIC_DIR, "sitemap-index.xml");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from({ length: totalSitemaps })
  .map(
    (_, i) => `<sitemap>
  <loc>${SITE_URL}/sitemap-${i + 1}.xml</loc>
</sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

  atomicWrite(indexFile, xml);
  console.log(`📌 Generated sitemap-index.xml referencing ${totalSitemaps} sitemaps.`);
}

// ========================
// MAIN SCRIPT
// ========================
async function generate() {
  let progress = loadProgress();
  let sitemapUrls = [];

  console.log("🚀 Starting Sitemap Generation...\n");

  for (let r = progress.lastReligionIndex; r < RELIGIONS.length; r++) {
    const religion = RELIGIONS[r];
    let page = progress.lastPage;

    console.log(`\n🔍 Processing religion: ${religion}, starting at page ${page}`);

    while (true) {
      const apiUrl = `${API_BASE}?religion=${encodeURIComponent(religion)}&page=${page}&limit=${LIMIT}`;
      console.log(`Fetching → ${apiUrl}`);

      // fetch with timeout & retries
      const maxAttempts = 5;
      let attempt = 0;
      let ok = false;
      let data = null;

      while (attempt < maxAttempts && !ok) {
        attempt++;
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 15000);
          const res = await fetch(apiUrl, { signal: controller.signal });
          clearTimeout(timeout);

          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const json = await res.json();
          data = json?.data;
          ok = true;
        } catch (err) {
          console.error(`Attempt ${attempt} failed:`, err.message || err);
          const backoff = 1000 * Math.pow(2, attempt);
          await new Promise((s) => setTimeout(s, backoff));
        }
      }

      if (!ok) {
        console.error(`❌ Failed to fetch after ${maxAttempts} attempts. Moving on.`);
        break;
      }

      if (!data || !data.names || data.names.length === 0) {
        console.log(`No more names for ${religion}`);
        break;
      }

      // Add URLs (ensure encoding)
      data.names.forEach((n) => {
        const loc = `${SITE_URL.replace(/\/$/, '')}/names/${encodeURIComponent(religion)}/${encodeURIComponent(n.slug)}`;
        sitemapUrls.push(loc);
      });

      // If max URLs reached → write sitemap file
      if (sitemapUrls.length >= URLS_PER_SITEMAP) {
        writeSitemap(progress.sitemapIndex, sitemapUrls);
        sitemapUrls = [];
        progress.sitemapIndex++;
        saveProgress({ ...progress, lastReligionIndex: r, lastPage: page + 1 });
      }

      if (!data.pagination?.hasNextPage) break;

      page++;
      progress.lastPage = page;
      saveProgress(progress);
    }

    // Move to next religion
    progress.lastPage = 1;
    progress.lastReligionIndex = r + 1;
    saveProgress(progress);
  }

  // Write remaining URLs
  if (sitemapUrls.length > 0) {
    writeSitemap(progress.sitemapIndex, sitemapUrls);
    progress.sitemapIndex++;
  }

  saveProgress(progress);

  // Generate sitemap index
  writeSitemapIndex(progress.sitemapIndex - 1);

  console.log("\n🎉 All sitemaps generated successfully!");
}

// Run
generate().catch((err) => console.error(err));
