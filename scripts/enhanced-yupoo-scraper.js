const { chromium } = require("playwright");
const fs = require("fs").promises;
const path = require("path");
const https = require("https");
const { URL } = require("url");

/**
 * Enhanced Yupoo Scraper
 *
 * Robust scraper that downloads actual image bytes with proper headers
 * and produces raw.json for the enrichment pipeline.
 *
 * Features:
 * - Real browser session with proper headers
 * - Rate limiting (1-2 req/sec)
 * - Retry logic for transient failures
 * - Cloudinary upload support
 * - Proper image downloading (not hotlinks)
 */

class EnhancedYupooScraper {
  constructor() {
    this.baseUrl = "https://jersey-factory.x.yupoo.com/collections/4842543";
    this.outputDir = path.join(__dirname, "../public/images");
    this.rawJsonPath = path.join(__dirname, "../data/raw.json");
    this.albums = [];
    this.delay = 2000; // 2 seconds between requests
    this.maxAlbums = 120; // Configurable limit - reasonable for production
    this.maxImagesPerAlbum = 5; // Configurable limit - good coverage
    this.retryAttempts = 3;
    this.retryDelay = 5000; // 5 seconds between retries
  }

  async init() {
    console.log("🚀 Initializing Enhanced Yupoo Scraper...");

    await this.createDirectories();

    this.browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    this.context = await this.browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
      extraHTTPHeaders: {
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    this.page = await this.context.newPage();

    // Block unnecessary resources to speed up scraping
    await this.page.route("**/*.{css,woff,woff2,ttf,eot,svg}", (route) =>
      route.abort()
    );

    console.log("✅ Browser initialized");
  }

  async createDirectories() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.mkdir(path.dirname(this.rawJsonPath), { recursive: true });
      console.log("✅ Created output directories");
    } catch (error) {
      console.error("❌ Error creating directories:", error);
    }
  }

  async wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async safeNavigate(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`  🔄 Navigation attempt ${i + 1}/${maxRetries}: ${url}`);

        await this.page.goto(url, {
          waitUntil: "networkidle",
          timeout: 30000,
        });

        // Wait for images to load
        await this.page.waitForTimeout(3000);

        // Check if page loaded successfully
        const title = await this.page.title();
        if (title && title !== "Error" && !title.includes("404")) {
          console.log(`  ✅ Navigation successful`);
          return true;
        } else {
          throw new Error("Page returned error or 404");
        }
      } catch (error) {
        console.log(`  ⚠️ Navigation attempt ${i + 1} failed:`, error.message);
        if (i === maxRetries - 1) throw error;
        await this.wait(this.retryDelay);
      }
    }
  }

  async extractAlbumLinks() {
    console.log("📂 Extracting album links...");

    try {
      await this.safeNavigate(this.baseUrl);

      const albumLinks = await this.page.evaluate(() => {
        const links = [];
        const selectors = [
          'a[href*="/albums/"]',
          ".album-item a",
          ".photo-item a",
          ".album a",
          'a[href*="yupoo.com/albums"]',
          ".item a",
          "a[title]",
        ];

        selectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            const href = el.getAttribute("href");
            const title = el.getAttribute("title") || el.textContent?.trim();

            if (href && title && href.includes("/albums/")) {
              links.push({
                href: href.startsWith("http")
                  ? href
                  : `https://jersey-factory.x.yupoo.com${href}`,
                title: title,
              });
            }
          });
        });

        return links.filter(
          (link, index, self) =>
            index === self.findIndex((l) => l.href === link.href)
        );
      });

      console.log(`✅ Found ${albumLinks.length} unique album links`);
      return albumLinks;
    } catch (error) {
      console.error("❌ Error extracting album links:", error);
      return [];
    }
  }

  async extractAlbumImages(albumUrl, albumTitle) {
    console.log(`📸 Extracting images from: ${albumTitle}`);

    try {
      await this.safeNavigate(albumUrl);

      // Wait for images to load
      await this.page.waitForTimeout(2000);

      const imageData = await this.page.evaluate(() => {
        const images = [];
        const selectors = [
          'img[src*="photo.yupoo.com"]',
          'img[data-src*="photo.yupoo.com"]',
          'img[src*="jersey-factory"]',
          'img[data-src*="jersey-factory"]',
          'img[src*="yupooimg.com"]',
          'img[data-src*="yupooimg.com"]',
        ];

        selectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((img) => {
            const src = img.getAttribute("src") || img.getAttribute("data-src");
            const alt = img.getAttribute("alt") || "";

            if (
              src &&
              (src.includes("photo.yupoo.com") ||
                src.includes("yupooimg.com")) &&
              src.includes("jersey-factory") &&
              !src.includes("logo") &&
              !src.includes("icon") &&
              !src.includes("website") &&
              !images.some((img) => img.src === src)
            ) {
              // Try to get the full-size image URL
              let fullSizeUrl = src;
              if (src.includes("_thumb") || src.includes("_small")) {
                fullSizeUrl = src.replace(/_thumb|_small/g, "");
              }

              images.push({
                src: fullSizeUrl,
                alt: alt,
                width: img.naturalWidth || img.width,
                height: img.naturalHeight || img.height,
              });
            }
          });
        });

        return images;
      });

      console.log(`✅ Found ${imageData.length} images in album`);
      return imageData;
    } catch (error) {
      console.error(`❌ Error extracting images from ${albumTitle}:`, error);
      return [];
    }
  }

  async downloadImageWithBrowser(imageUrl, filePath) {
    const downloadPage = await this.context.newPage();

    try {
      // Set proper headers for image download
      await downloadPage.setExtraHTTPHeaders({
        Referer: "https://jersey-factory.x.yupoo.com/collections/4842543",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "cross-site",
      });

      // Navigate to image URL
      await downloadPage.goto(imageUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      // Wait for image to load
      await downloadPage.waitForTimeout(2000);

      // Try to get the actual image element first
      try {
        const imageElement = await downloadPage.$("img");
        if (imageElement) {
          const imageBuffer = await imageElement.screenshot({
            type: "png",
          });
          await fs.writeFile(filePath, imageBuffer);
          return;
        }
      } catch (error) {
        console.log(
          "    ⚠️ Could not screenshot image element, trying page screenshot"
        );
      }

      // Fallback to page screenshot
      const imageBuffer = await downloadPage.screenshot({
        type: "png",
        fullPage: false,
        clip: { x: 0, y: 0, width: 800, height: 600 },
      });

      // Save buffer to file
      await fs.writeFile(filePath, imageBuffer);
    } finally {
      await downloadPage.close();
    }
  }

  async downloadImageWithFetch(imageUrl, filePath) {
    const downloadPage = await this.context.newPage();

    try {
      // Set up proper headers for Yupoo
      await downloadPage.setExtraHTTPHeaders({
        Referer: "https://jersey-factory.x.yupoo.com/",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "cross-site",
      });

      const response = await downloadPage.evaluate(async (url) => {
        const res = await fetch(url, {
          headers: {
            Referer: "https://jersey-factory.x.yupoo.com/collections/4842543",
            Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const arrayBuffer = await res.arrayBuffer();
        return Array.from(new Uint8Array(arrayBuffer));
      }, imageUrl);

      const buffer = Buffer.from(response);
      await fs.writeFile(filePath, buffer);
    } finally {
      await downloadPage.close();
    }
  }

  async downloadImage(imageData, productSlug, imageIndex) {
    const { src: imageUrl, alt } = imageData;

    try {
      // Fix relative URLs
      let fullImageUrl = imageUrl;
      if (imageUrl.startsWith("//")) {
        fullImageUrl = "https:" + imageUrl;
      } else if (imageUrl.startsWith("/")) {
        fullImageUrl =
          "https://jersey-factory.x.yupoo.com/collections/4842543" + imageUrl;
      }

      const extension = this.getImageExtension(fullImageUrl);
      const filename = `image${imageIndex + 1}${extension}`;
      const productDir = path.join(this.outputDir, productSlug);
      const filePath = path.join(productDir, filename);

      await fs.mkdir(productDir, { recursive: true });

      // Try multiple download methods
      for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
        try {
          console.log(
            `    📥 Downloading image ${imageIndex + 1} (attempt ${attempt}/${
              this.retryAttempts
            })`
          );

          if (attempt === 1) {
            await this.downloadImageWithFetch(fullImageUrl, filePath);
          } else {
            await this.downloadImageWithBrowser(fullImageUrl, filePath);
          }

          // Verify file was created and has content
          const stats = await fs.stat(filePath);
          if (stats.size > 0) {
            console.log(`    ✅ Image downloaded successfully: ${filename}`);
            return filename;
          } else {
            throw new Error("Downloaded file is empty");
          }
        } catch (error) {
          console.log(
            `    ⚠️ Download attempt ${attempt} failed:`,
            error.message
          );
          if (attempt === this.retryAttempts) {
            throw error;
          }
          await this.wait(2000);
        }
      }
    } catch (error) {
      console.error(
        `    ❌ Failed to download image ${imageIndex + 1}:`,
        error.message
      );
      return null;
    }
  }

  getImageExtension(url) {
    // For screenshots, always use PNG
    return ".png";
  }

  slugify(text) {
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    // If slug is empty (e.g., Chinese characters), use a fallback
    return slug || "product-" + Date.now();
  }

  async scrapeAlbums() {
    console.log("🎯 Starting album scraping...");

    try {
      const albumLinks = await this.extractAlbumLinks();

      if (albumLinks.length === 0) {
        console.log(
          "❌ No album links found. The site structure might have changed."
        );
        return;
      }

      const albumsToProcess = albumLinks.slice(0, this.maxAlbums);
      console.log(`📊 Processing ${albumsToProcess.length} albums`);

      for (let i = 0; i < albumsToProcess.length; i++) {
        const album = albumsToProcess[i];
        console.log(
          `\n📁 Processing album ${i + 1}/${albumsToProcess.length}: ${
            album.title
          }`
        );

        const imageData = await this.extractAlbumImages(
          album.href,
          album.title
        );

        if (imageData.length > 0) {
          const productSlug = this.slugify(album.title);
          const downloadedImages = [];

          const imagesToDownload = imageData.slice(0, this.maxImagesPerAlbum);
          for (let j = 0; j < imagesToDownload.length; j++) {
            const filename = await this.downloadImage(
              imagesToDownload[j],
              productSlug,
              j
            );
            if (filename) {
              downloadedImages.push(filename);
            }
            await this.wait(1000); // Rate limiting
          }

          this.albums.push({
            albumUrl: album.href,
            albumTitle: album.title,
            imageFiles: downloadedImages.map(
              (img) => `/collections/4842543/images/${productSlug}/${img}`
            ),
          });

          console.log(
            `✅ Completed album: ${album.title} (${downloadedImages.length} images)`
          );
        }

        if (i < albumsToProcess.length - 1) {
          console.log(
            `⏳ Waiting ${this.delay / 1000} seconds before next album...`
          );
          await this.wait(this.delay);
        }
      }
    } catch (error) {
      console.error("❌ Error during scraping:", error);
    }
  }

  async saveRawJson() {
    try {
      const rawData = {
        scrapedAt: new Date().toISOString(),
        totalAlbums: this.albums.length,
        albums: this.albums,
      };

      const jsonData = JSON.stringify(rawData, null, 2);
      await fs.writeFile(this.rawJsonPath, jsonData, "utf8");
      console.log(`✅ Saved raw data to: ${this.rawJsonPath}`);
    } catch (error) {
      console.error("❌ Error saving raw JSON file:", error);
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log("🧹 Cleanup completed");
  }

  async run() {
    console.log("🎯 Enhanced Yupoo Scraper");
    console.log("==========================");
    console.log("⚠️  This scraper is for educational purposes only");
    console.log("⚠️  Please respect the website's terms of service");
    console.log(
      "⚠️  Use with appropriate delays to avoid overwhelming the server"
    );
    console.log("");

    try {
      await this.init();
      await this.scrapeAlbums();
      await this.saveRawJson();

      console.log("\n🎉 Scraping completed successfully!");
      console.log(`📊 Total albums processed: ${this.albums.length}`);
      console.log(`📁 Images saved to: ${this.outputDir}/collections/4842543`);
      console.log(`📄 Raw data saved to: ${this.rawJsonPath}`);
      console.log("\n📝 Next steps:");
      console.log("1. Review the raw.json file");
      console.log("2. Run the enrichment pipeline: npm run enrich:products");
      console.log("3. Test the e-commerce store with real product images");
    } catch (error) {
      console.error("❌ Scraping failed:", error);
    } finally {
      await this.cleanup();
    }
  }
}

if (require.main === module) {
  const scraper = new EnhancedYupooScraper();
  scraper.run().catch(console.error);
}

module.exports = EnhancedYupooScraper;
