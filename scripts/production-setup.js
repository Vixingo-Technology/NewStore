#!/usr/bin/env node

const fs = require("fs").promises;
const path = require("path");

/**
 * Production Setup Script
 *
 * Validates the environment and prepares the app for deployment
 */

class ProductionSetup {
  constructor() {
    this.requiredEnvVars = [
      "NEXT_PUBLIC_BASE_URL",
      "STRIPE_SECRET_KEY",
      "STRIPE_PUBLISHABLE_KEY",
    ];

    this.optionalEnvVars = [
      "CLOUDINARY_URL",
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ];
  }

  async run() {
    console.log("🔧 Production Setup");
    console.log("==================");

    try {
      await this.checkEnvironment();
      await this.validateProductData();
      await this.checkImageAssets();

      console.log("\n✅ Production setup completed successfully!");
      console.log("🚀 Your app is ready for deployment");
    } catch (error) {
      console.error("\n❌ Production setup failed:", error.message);
      process.exit(1);
    }
  }

  async checkEnvironment() {
    console.log("\n📋 Checking environment variables...");

    const envPath = path.join(process.cwd(), ".env.local");
    let envContent = "";

    try {
      envContent = await fs.readFile(envPath, "utf8");
    } catch (error) {
      console.log("⚠️  No .env.local file found, checking process.env...");
    }

    const missing = [];

    for (const envVar of this.requiredEnvVars) {
      if (!process.env[envVar] && !envContent.includes(envVar)) {
        missing.push(envVar);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }

    console.log("✅ All required environment variables are set");

    // Check optional vars
    const optionalMissing = [];
    for (const envVar of this.optionalEnvVars) {
      if (!process.env[envVar] && !envContent.includes(envVar)) {
        optionalMissing.push(envVar);
      }
    }

    if (optionalMissing.length > 0) {
      console.log(
        "⚠️  Optional environment variables not set (Cloudinary):",
        optionalMissing.join(", ")
      );
    }
  }

  async validateProductData() {
    console.log("\n📦 Validating product data...");

    const productsPath = path.join(process.cwd(), "src/data/products.ts");

    try {
      const content = await fs.readFile(productsPath, "utf8");

      // Check if products array exists and has items
      if (!content.includes("export const products: Product[]")) {
        throw new Error("Products array not found in products.ts");
      }

      // Count products (rough estimate)
      const productCount = (content.match(/"id":/g) || []).length;

      if (productCount === 0) {
        throw new Error("No products found in products.ts");
      }

      console.log(`✅ Found ${productCount} products in catalog`);
    } catch (error) {
      throw new Error(`Product data validation failed: ${error.message}`);
    }
  }

  async checkImageAssets() {
    console.log("\n🖼️  Checking image assets...");

    const imagesDir = path.join(process.cwd(), "public/images");

    try {
      const entries = await fs.readdir(imagesDir, { withFileTypes: true });
      const directories = entries.filter((entry) => entry.isDirectory());

      if (directories.length === 0) {
        console.log("⚠️  No product image directories found");
        console.log('   Run "npm run scrape" to populate images');
      } else {
        console.log(`✅ Found ${directories.length} product image directories`);
      }
    } catch (error) {
      console.log("⚠️  Images directory not found or empty");
      console.log('   Run "npm run scrape" to populate images');
    }
  }
}

// Run if called directly
if (require.main === module) {
  const setup = new ProductionSetup();
  setup.run().catch(console.error);
}

module.exports = ProductionSetup;
