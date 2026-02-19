import axios from "axios";
import * as cheerio from "cheerio";

export const CATEGORY_URLS = [
  { slug: "Anchoring & Docking", url: "https://nautichandler.com/en/100799-anchoring-docking" },
  { slug: "Navigation",          url: "https://nautichandler.com/en/100329-navigation" },
  { slug: "Safety",              url: "https://nautichandler.com/en/100389-safety" },
  { slug: "Electrics",           url: "https://nautichandler.com/en/100392-electricslighting" },
  { slug: "Motor",               url: "https://nautichandler.com/en/100393-motor" },
  { slug: "Ropes",               url: "https://nautichandler.com/en/100395-ropes" },
  { slug: "Maintenance",         url: "https://nautichandler.com/en/100669-maintenance-cleaning-products" },
];

const BASE_URL  = "https://nautichandler.com";
const MAX_PAGES = 3;
const DELAY     = 1200;
const TIMEOUT   = 12000;

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  "Accept": "application/json, text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Referer": "https://nautichandler.com/en/",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cleanPrice(raw) {
  if (!raw) return null;
  const n = parseFloat(
    raw.replace(/[^\d,\.]/g, "").replace(/\.(?=\d{3})/g, "").replace(",", ".")
  );
  return isNaN(n) ? null : n;
}

function abs(href) {
  if (!href) return null;
  return href.startsWith("http") ? href : BASE_URL + (href.startsWith("/") ? "" : "/") + href;
}

function parsePage($, categorySlug) {
  const products = [];
  $("article.product-miniature, li.ajax_block_product, .js-product").each((_, el) => {
    const $el = $(el);
    const name =
      $el.find(".product-title a, h3.product-title a").first().text().trim() ||
      $el.find("a.product_img_link").attr("title")?.trim();
    if (!name) return;

    const productUrl = abs($el.find(".product-title a, a.product_img_link").first().attr("href"));
    const price      = cleanPrice($el.find(".price, span[itemprop='price']").first().text());
    const imgEl      = $el.find("img.lazy, img[data-src], .product-thumbnail img, img").first();
    const imageUrl   = abs(imgEl.attr("data-src") || imgEl.attr("src"));
    const shortDescription = $el.find(".product-description p, .short-description").first().text().trim().slice(0, 160);
    const brand      = $el.find(".manufacturer-name, .brand").first().text().trim();
    const rawId      = $el.attr("data-id-product") || productUrl?.match(/\/(\d+)-/)?.[1];

    products.push({
      id: rawId ? `nh-${rawId}` : `nh-${Math.random().toString(36).slice(2, 9)}`,
      name, price, currency: "EUR", imageUrl,
      shortDescription, category: categorySlug, brand, productUrl,
    });
  });
  return products;
}

async function scrapeCategory({ slug, url }) {
  const all = [];
  let current = url, page = 1;
  while (current && page <= MAX_PAGES) {
    try {
      const { data } = await axios.get(current, { headers: HEADERS, timeout: TIMEOUT });
      
      // Check if response is JSON (API endpoint) or HTML
      if (data && typeof data === 'object' && data.products) {
        // JSON API response
        const products = data.products.map(p => ({
          id: `nh-${p.id_product}`,
          name: p.name,
          price: p.price_amount || cleanPrice(p.price),
          currency: "EUR",
          imageUrl: p.cover?.medium?.url || p.cover?.large?.url,
          shortDescription: p.description_short?.replace(/<[^>]*>/g, '').trim().slice(0, 160) || '',
          category: slug,
          brand: p.manufacturer_name || '',
          productUrl: p.url || p.link,
        }));
        all.push(...products);
        
        // For JSON, check if there are more pages by looking at page number
        if (products.length === 24) { // Typically 24 items per page
          page++;
          current = page <= MAX_PAGES ? `${url.split('?')[0]}?page=${page}` : null;
        } else {
          current = null;
        }
      } else {
        // HTML response (fallback)
        const $ = cheerio.load(data);
        all.push(...parsePage($, slug));
        const next = $("a[rel='next']").attr("href") || $(".pagination .next a").attr("href");
        current = next ? abs(next) : null;
        page++;
      }
      
      if (current) await sleep(DELAY);
    } catch (e) {
      console.error(`[scraper] ${slug} p${page} failed:`, e.message);
      break;
    }
  }
  return all;
}

export async function scrapeAllProducts() {
  const all = [];
  for (const cat of CATEGORY_URLS) {
    try {
      const products = await Promise.race([
        scrapeCategory(cat),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Category timeout")), 10000)
        )
      ]);
      if (products && products.length > 0) {
        all.push(...products);
        console.log(`[scraper] ✓ ${cat.slug}: ${products.length}`);
      } else {
        console.log(`[scraper] ⚠ ${cat.slug}: no products`);
      }
      await sleep(DELAY * 2);
    } catch (e) {
      console.error(`[scraper] ✗ ${cat.slug} failed:`, e.message);
      // Continue with next category even if one fails
    }
  }
  const seen = new Set();
  const deduped = all.filter((p) => {
    if (!p.productUrl || seen.has(p.productUrl)) return false;
    seen.add(p.productUrl); return true;
  });
  console.log(`[scraper] Total: ${deduped.length} unique products`);
  return deduped;
}