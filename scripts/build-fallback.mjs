import axios from "axios";
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const BASE = "https://nautichandler.com";
const CATS = [
  { slug: "Anchoring & Docking", url: `${BASE}/en/100799-anchoring-docking` },
  { slug: "Navigation",          url: `${BASE}/en/100329-navigation` },
  { slug: "Safety",              url: `${BASE}/en/100389-safety` },
  { slug: "Electrics",           url: `${BASE}/en/100392-electricslighting` },
  { slug: "Motor",               url: `${BASE}/en/100393-motor` },
  { slug: "Ropes",               url: `${BASE}/en/100395-ropes` },
  { slug: "Maintenance",         url: `${BASE}/en/100669-maintenance-cleaning-products` },
];
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  "Accept": "application/json, text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Referer": `${BASE}/en/`,
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrapeCategory({ slug, url }) {
  const all = [];
  const MAX_PAGES = 3;
  
  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const pageUrl = page === 1 ? url : `${url.split('?')[0]}?page=${page}`;
      console.log(`[${slug}] Fetching page ${page}...`);
      const { data } = await axios.get(pageUrl, { headers: HEADERS, timeout: 12000 });
      
      if (data && typeof data === 'object' && data.products) {
        // JSON API response
        const products = data.products.map(p => ({
          id: `nh-${p.id_product}`,
          name: p.name,
          price: p.price_amount || parseFloat(p.price?.replace(/[^\d,.]/g, '').replace(',', '.')),
          currency: "EUR",
          imageUrl: p.cover?.medium?.url || p.cover?.large?.url,
          shortDescription: p.description_short?.replace(/<[^>]*>/g, '').trim().slice(0, 160) || '',
          category: slug,
          brand: p.manufacturer_name || '',
          productUrl: p.url || p.link,
        }));
        all.push(...products);
        console.log(`[${slug}] Page ${page}: ${products.length} products`);
        
        if (products.length < 24) break; // Last page
      } else {
        break;
      }
      
      await sleep(1500);
    } catch (e) {
      console.error(`[${slug}] Page ${page} failed:`, e.message);
      break;
    }
  }
  
  return all;
}

(async () => {
  console.log("🚢 Building fallback product data from live Nautichandler...\n");
  const all = [];
  
  for (const cat of CATS) {
    const products = await scrapeCategory(cat);
    all.push(...products);
    console.log(`✓ ${cat.slug}: ${products.length} products\n`);
    await sleep(2000);
  }
  
  // Remove duplicates
  const seen = new Set();
  const unique = all.filter(p => {
    if (!p.productUrl || seen.has(p.productUrl)) return false;
    seen.add(p.productUrl);
    return true;
  });
  
  console.log(`\n📦 Total unique products: ${unique.length}`);
  
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outDir = resolve(__dirname, "../data");
  const outFile = resolve(outDir, "products-fallback.json");
  
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, JSON.stringify(unique, null, 2));
  
  console.log(`✅ Written to: ${outFile}`);
})();