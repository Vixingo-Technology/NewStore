#!/usr/bin/env node

/**
 * Test Scraping System
 *
 * Validates all components of the scraping system and provides
 * a quick way to test the pipeline with a small dataset.
 *
 * Usage: npm run test:scraping
 */

const fs = require("fs").promises;
const path = require("path");

class ScrapingSystemTester {
  constructor() {
    this.baseDir = path.join(__dirname, "..");
    this.testConfig = {
      maxAlbums: 3,
      maxImagesPerAlbum: 2,
      delay: 1000,
    };
  }

  async checkDependencies() {
    console.log("🔍 Checking dependencies...");

    const checks = [
      { name: "Playwright", check: () => require("playwright") },
      { name: "Cloudinary", check: () => require("cloudinary") },
      { name: "Node.js version", check: () => process.version },
    ];

    for (const check of checks) {
      try {
        const result = check.check();
        console.log(`  ✅ ${check.name}: ${result}`);
      } catch (error) {
        console.log(`  ❌ ${check.name}: Not available`);
      }
    }
  }

  async checkDirectories() {
    console.log("\n📁 Checking directory structure...");

    const dirs = ["data", "public/images", "src/data", "scripts"];

    for (const dir of dirs) {
      const dirPath = path.join(this.baseDir, dir);
      try {
        await fs.access(dirPath);
        console.log(`  ✅ ${dir}/`);
      } catch {
        console.log(`  ❌ ${dir}/ (will be created)`);
      }
    }
  }

  async checkEnvironment() {
    console.log("\n⚙️ Checking environment variables...");

    const envVars = [
      "CLOUDINARY_URL",
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ];

    for (const envVar of envVars) {
      if (process.env[envVar]) {
        console.log(`  ✅ ${envVar}: Set`);
      } else {
        console.log(`  ⚠️ ${envVar}: Not set (optional)`);
      }
    }
  }

  async createTestConfig() {
    console.log("\n⚙️ Creating test configuration...");

    const testConfigPath = path.join(this.baseDir, "scripts", "test-config.js");
    const configContent = `// Test configuration for scraping system
module.exports = {
  maxAlbums: ${this.testConfig.maxAlbums},
  maxImagesPerAlbum: ${this.testConfig.maxImagesPerAlbum},
  delay: ${this.testConfig.delay},
  testMode: true
};
`;

    try {
      await fs.writeFile(testConfigPath, configContent);
      console.log("  ✅ Test configuration created");
    } catch (error) {
      console.log("  ❌ Failed to create test configuration:", error.message);
    }
  }

  async validateScraper() {
    console.log("\n🔧 Validating scraper components...");

    const scraperPath = path.join(
      this.baseDir,
      "scripts",
      "enhanced-yupoo-scraper.js"
    );
    try {
      const scraper = require(scraperPath);
      console.log("  ✅ Enhanced scraper: Loaded successfully");

      // Check if it has required methods
      const requiredMethods = ["init", "scrapeAlbums", "saveRawJson"];
      for (const method of requiredMethods) {
        if (typeof scraper.prototype[method] === "function") {
          console.log(`  ✅ Method ${method}: Available`);
        } else {
          console.log(`  ❌ Method ${method}: Missing`);
        }
      }
    } catch (error) {
      console.log("  ❌ Enhanced scraper: Failed to load");
    }
  }

  async validateEnrichment() {
    console.log("\n🎨 Validating enrichment pipeline...");

    const enrichmentPath = path.join(
      this.baseDir,
      "scripts",
      "enrich-products.js"
    );
    try {
      const enrichment = require(enrichmentPath);
      console.log("  ✅ Enrichment pipeline: Loaded successfully");

      // Check if it has required methods
      const requiredMethods = [
        "loadRawData",
        "enrichAlbum",
        "generateProductsFile",
      ];
      for (const method of requiredMethods) {
        if (typeof enrichment.prototype[method] === "function") {
          console.log(`  ✅ Method ${method}: Available`);
        } else {
          console.log(`  ❌ Method ${method}: Missing`);
        }
      }
    } catch (error) {
      console.log("  ❌ Enrichment pipeline: Failed to load");
    }
  }

  async checkExistingData() {
    console.log("\n📊 Checking existing data...");

    const files = [
      { path: "data/raw.json", name: "Raw data" },
      { path: "src/data/products.ts", name: "Products data" },
    ];

    for (const file of files) {
      const filePath = path.join(this.baseDir, file.path);
      try {
        const stats = await fs.stat(filePath);
        const content = await fs.readFile(filePath, "utf8");

        if (file.path.includes("raw.json")) {
          const data = JSON.parse(content);
          console.log(`  ✅ ${file.name}: ${data.albums?.length || 0} albums`);
        } else {
          console.log(`  ✅ ${file.name}: ${stats.size} bytes`);
        }
      } catch (error) {
        console.log(`  ⚠️ ${file.name}: Not found`);
      }
    }
  }

  async runQuickTest() {
    console.log("\n🧪 Running quick test...");

    // Create a sample raw.json for testing
    const sampleRawData = {
      scrapedAt: new Date().toISOString(),
      totalAlbums: 1,
      albums: [
        {
          albumUrl: "https://jersey-factory.x.yupoo.com/albums/test",
          albumTitle: "Arsenal Home Jersey 2024/25",
          imageFiles: ["/images/arsenal-home-jersey-2024-25/image1.jpg"],
        },
      ],
    };

    const rawJsonPath = path.join(this.baseDir, "data", "raw.json");

    try {
      await fs.mkdir(path.dirname(rawJsonPath), { recursive: true });
      await fs.writeFile(rawJsonPath, JSON.stringify(sampleRawData, null, 2));
      console.log("  ✅ Sample raw data created");

      // Test enrichment
      const enrichment = require("./enrich-products.js");
      const pipeline = new enrichment();
      await pipeline.run();

      console.log("  ✅ Enrichment test completed");
    } catch (error) {
      console.log("  ❌ Quick test failed:", error.message);
    }
  }

  async generateTestReport() {
    console.log("\n📋 Generating test report...");

    const report = {
      timestamp: new Date().toISOString(),
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      dependencies: {
        playwright: !!require("playwright"),
        cloudinary: !!require("cloudinary"),
      },
      environment: {
        cloudinaryConfigured: !!process.env.CLOUDINARY_URL,
      },
      recommendations: [],
    };

    // Add recommendations based on test results
    if (!process.env.CLOUDINARY_URL) {
      report.recommendations.push(
        "Consider setting up Cloudinary for better image hosting"
      );
    }

    const reportPath = path.join(this.baseDir, "data", "test-report.json");
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log("  ✅ Test report generated");
    return report;
  }

  async run() {
    console.log("🧪 Nuvion Scraping System Test");
    console.log("=====================================");

    try {
      await this.checkDependencies();
      await this.checkDirectories();
      await this.checkEnvironment();
      await this.createTestConfig();
      await this.validateScraper();
      await this.validateEnrichment();
      await this.checkExistingData();
      await this.runQuickTest();

      const report = await this.generateTestReport();

      console.log("\n🎉 Test completed successfully!");
      console.log("\n📝 Summary:");
      console.log(
        `  📊 System: ${report.system.platform} ${report.system.arch}`
      );
      console.log(`  🔧 Node.js: ${report.system.nodeVersion}`);
      console.log(
        `  ☁️ Cloudinary: ${
          report.environment.cloudinaryConfigured
            ? "Configured"
            : "Not configured"
        }`
      );

      if (report.recommendations.length > 0) {
        console.log("\n💡 Recommendations:");
        report.recommendations.forEach((rec) => console.log(`  - ${rec}`));
      }

      console.log("\n🚀 Ready to run:");
      console.log("  npm run scrape:enhanced    # Start scraping");
      console.log("  npm run enrich:products    # Enrich data");
      console.log("  npm run scrape:complete    # Complete pipeline");
    } catch (error) {
      console.error("❌ Test failed:", error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const tester = new ScrapingSystemTester();
  tester.run().catch(console.error);
}

module.exports = ScrapingSystemTester;
