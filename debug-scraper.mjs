import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const url = "https://nautichandler.com/en/100799-anchoring-docking";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
};

try {
  console.log("Fetching:", url);
  const response = await axios.get(url, { headers: HEADERS, timeout: 12000 });
  const data = response.data;
  
  console.log("Response type:", typeof data);
  
  // Check if JSON with products
  if (data && typeof data === 'object' && data.products) {
    console.log("✓ JSON API Response");
    console.log("Total products in JSON:", data.products.length);
    console.log("\nFirst product:");
    if (data.products[0]) {
      console.log("  ID:", data.products[0].id_product);
      console.log("  Name:", data.products[0].name);
      console.log("  Price:", data.products[0].price);
      console.log("  Price Amount:", data.products[0].price_amount);
    }
  } else {
    console.log("✗ Not a JSON API response");
    console.log("Checking HTML...");
    const $ = cheerio.load(data);
  
    console.log("Total [data-id-product]:", $("[data-id-product]").length);
    console.log("Total article:", $("article").length);
    console.log("Total .product-miniature:", $(".product-miniature").length);
    console.log("Total .product:", $(".product").length);
    console.log("Total .js-product:", $(".js-product").length);
    
    // Try different selectors
    const selector = "article, .product-miniature, .product, .js-product";
    console.log(`\nTrying selector: "${selector}"`);
    console.log("Total found:", $(selector).length);
    
    // Get first few
    $(selector).slice(0, 3).each((i, el) => {
      const $el = $(el);
      console.log(`\n--- Product ${i+1} ---`);
      console.log("Tag:", el.tagName);
      console.log("Classes:", $el.attr("class"));
      console.log("Data-id:", $el.attr("data-id-product"));
      
      // Try to find name
      const nameTests = [
        [".product-name", $el.find(".product-name").text().trim()],
        [".name", $el.find(".name").text().trim()],
        ["H2/H3", $el.find("h2, h3").text().trim()],
        ["a href", $el.find("a[href*='/']").first().text().trim()],
      ];
      
      console.log("Name tests:");
      nameTests.forEach(([selector, text]) => {
        if (text) console.log(`  ${selector}: "${text.substring(0, 50)}"`);
      });
      
      // Try to find price
      const priceTests = [
        [".price", $el.find(".price").text().trim()],
        ["[itemprop='price']", $el.find("[itemprop='price']").text().trim()],
        [".amount", $el.find(".amount").text().trim()],
      ];
      
      console.log("Price tests:");
      priceTests.forEach(([selector, text]) => {
        if (text) console.log(`  ${selector}: "${text}"`);
      });
      
      // Check for images
      const img = $el.find("img").first();
      console.log("Image src:", img.attr("src")?.substring(0, 50));
      console.log("Image data-src:", img.attr("data-src")?.substring(0, 50));
    });
  }
  
} catch (e) {
  console.error("Error:", e.message);
}
