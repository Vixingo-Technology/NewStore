const fs = require("fs").promises;
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const fsSync = require("fs");

// Lightweight .env loader so the script works via `node` without dotenv
(() => {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fsSync.existsSync(envPath)) {
      const raw = fsSync.readFileSync(envPath, "utf8");
      raw.split(/\r?\n/).forEach((line) => {
        if (!line || line.trim().startsWith("#")) return;
        const idx = line.indexOf("=");
        if (idx === -1) return;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        if (key && !(key in process.env)) process.env[key] = value;
      });
    }
  } catch (_) {}
})();

/**
 * Cloudinary Upload Script
 *
 * Uploads downloaded images to Cloudinary for better performance
 * and reliability. Requires CLOUDINARY_URL environment variable.
 *
 * Usage: npm run upload:cloudinary
 */

class CloudinaryUploader {
  constructor() {
    this.imagesDir = path.join(__dirname, "../public/images");
    this.rawJsonPath = path.join(__dirname, "../data/raw.json");
    this.uploadedImages = [];

    // Configure Cloudinary. Prefer CLOUDINARY_URL if provided
    if (
      process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET)
    ) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
    }
  }

  async uploadImage(imagePath, productSlug, imageIndex) {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(
          `  ☁️ Uploading: ${imagePath}${
            attempt > 1 ? ` (retry ${attempt}/${maxAttempts})` : ""
          }`
        );
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: `soccer-vault/${productSlug}`,
          public_id: `image${imageIndex + 1}`,
          overwrite: true,
          resource_type: "image",
          transformation: [{ quality: "auto:good", fetch_format: "auto" }],
        });
        console.log(`  ✅ Uploaded: ${result.secure_url}`);
        return result.secure_url;
      } catch (error) {
        console.error(`  ❌ Upload failed for ${imagePath}:`, error.message);
        if (attempt < maxAttempts) {
          const backoffMs = 1000 * attempt;
          await new Promise((r) => setTimeout(r, backoffMs));
          continue;
        }
        return null;
      }
    }
  }

  async uploadProductImages(productSlug, imageFiles) {
    const productDir = path.join(this.imagesDir, productSlug);
    const uploadedUrls = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      // If it's already a remote URL (e.g., Cloudinary), keep as is
      if (/^https?:\/\//i.test(imageFile)) {
        uploadedUrls.push(imageFile);
        continue;
      }

      const imagePath = path.join(productDir, imageFile.split("/").pop());

      if (await this.fileExists(imagePath)) {
        const cloudinaryUrl = await this.uploadImage(imagePath, productSlug, i);
        if (cloudinaryUrl) {
          uploadedUrls.push(cloudinaryUrl);
        } else {
          // Keep the local reference for a later retry
          uploadedUrls.push(imageFile);
        }
      } else {
        console.log(`  ⚠️ Image not found: ${imagePath}`);
        uploadedUrls.push(imageFile);
      }
    }

    return uploadedUrls;
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async loadRawData() {
    try {
      const data = await fs.readFile(this.rawJsonPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("❌ Error loading raw data:", error.message);
      return { albums: [] };
    }
  }

  async saveUpdatedRawData(albums) {
    const rawData = {
      scrapedAt: new Date().toISOString(),
      totalAlbums: albums.length,
      albums: albums,
    };

    await fs.writeFile(
      this.rawJsonPath,
      JSON.stringify(rawData, null, 2),
      "utf8"
    );
    console.log(`✅ Updated raw data saved to: ${this.rawJsonPath}`);
  }

  async run() {
    console.log("☁️ Cloudinary Upload Script");
    console.log("============================");

    if (
      !process.env.CLOUDINARY_URL &&
      !(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      )
    ) {
      console.log("❌ CLOUDINARY_URL environment variable not set");
      console.log("💡 Add CLOUDINARY_URL to your .env file");
      return;
    }

    try {
      const rawData = await this.loadRawData();

      if (!rawData.albums || rawData.albums.length === 0) {
        console.log("❌ No albums found in raw data");
        return;
      }

      console.log(`📊 Processing ${rawData.albums.length} albums...`);

      for (let i = 0; i < rawData.albums.length; i++) {
        const album = rawData.albums[i];
        const productSlug = this.slugify(album.albumTitle);

        console.log(
          `\n📁 Processing album ${i + 1}/${rawData.albums.length}: ${
            album.albumTitle
          }`
        );

        // Upload images to Cloudinary (skip ones already on Cloudinary)
        const cloudinaryUrls = await this.uploadProductImages(
          productSlug,
          album.imageFiles
        );

        // Update album with Cloudinary URLs
        album.imageFiles = cloudinaryUrls;

        console.log(
          `✅ Completed: ${album.albumTitle} (${cloudinaryUrls.length} images)`
        );
      }

      // Save updated raw data
      await this.saveUpdatedRawData(rawData.albums);

      console.log("\n🎉 Cloudinary upload completed successfully!");
      console.log(`📊 Total albums processed: ${rawData.albums.length}`);
    } catch (error) {
      console.error("❌ Upload failed:", error);
    }
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}

if (require.main === module) {
  const uploader = new CloudinaryUploader();
  uploader.run().catch(console.error);
}

module.exports = CloudinaryUploader;
