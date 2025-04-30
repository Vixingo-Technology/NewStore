# Nuvion Scraping System

A robust scraping and enrichment pipeline for building a jersey store from Yupoo albums.

## 🎯 Overview

This system solves the critical problem of Yupoo hotlinking being blocked by Tencent Cloud EdgeOne by:

1. **Downloading actual image bytes** with proper headers and session management
2. **Rate limiting** to avoid overwhelming servers
3. **Retry logic** for transient failures
4. **Cloudinary integration** for reliable image hosting
5. **Intelligent enrichment** that maps raw data to structured products

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment (Optional)

For Cloudinary image hosting, add to your `.env` file:

```bash
CLOUDINARY_URL=cloudinary://your_cloud_name:your_api_key:your_api_secret@your_cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the Complete Pipeline

```bash
# Basic scraping and enrichment
npm run scrape:complete

# With Cloudinary upload
npm run scrape:with-cloudinary
```

## 📋 Available Scripts

### Core Scraping

- `npm run scrape:enhanced` - Enhanced Playwright scraper (recommended)
- `npm run scrape:yupoo` - Original scraper (legacy)
- `npm run scrape:setup` - Initial setup script

### Enrichment & Processing

- `npm run enrich:products` - Convert raw.json to products.ts
- `npm run upload:cloudinary` - Upload images to Cloudinary
- `npm run scrape:merge` - Legacy merge script

### Complete Workflows

- `npm run scrape:complete` - Scrape + Enrich
- `npm run scrape:with-cloudinary` - Scrape + Upload + Enrich
- `npm run scrape:all` - Legacy complete workflow

## 🔧 Enhanced Scraper Features

### Robust Image Downloading

The enhanced scraper uses multiple methods to ensure reliable image downloads:

1. **Browser-based fetching** with proper headers
2. **Screenshot fallback** for problematic images
3. **Retry logic** with exponential backoff
4. **Rate limiting** (1-2 requests per second)

### Proper Headers & Session Management

```javascript
// Headers that bypass Yupoo restrictions
{
  'Referer': 'https://jersey-factory.x.yupoo.com/',
  'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Sec-Fetch-Dest': 'image',
  'Sec-Fetch-Mode': 'no-cors',
  'Sec-Fetch-Site': 'cross-site'
}
```

### Error Handling & Recovery

- **Navigation retries** with different strategies
- **Image download fallbacks** using multiple methods
- **Graceful degradation** when images fail
- **Comprehensive logging** for debugging

## 🐍 Gallery-dl Fallback

If Playwright fails, use the Python fallback:

```bash
# Install gallery-dl
pip install gallery-dl

# Run fallback scraper
python scripts/gallery-dl-fallback.py https://jersey-factory.x.yupoo.com/albums/123456
```

### Gallery-dl Features

- **Automatic installation** of gallery-dl if missing
- **Normalized output** matching Playwright format
- **Cloudinary integration** support
- **Proper folder structure** creation

## 🎨 Enrichment Pipeline

The enrichment pipeline transforms raw scraped data into structured products:

### Intelligent Field Extraction

```typescript
type Product = {
  id: string;              // slug from album title
  title: string;           // cleaned album title
  club: string;            // canonical club name
  league: string;          // Premier League, La Liga, etc.
  category: string;        // Home, Away, Third, GK, Training
  season?: string;         // 2024/25
  price: number;           // intelligent pricing
  sizes: string[];         // S, M, L, XL, XXL
  images: string[];        // local paths or Cloudinary URLs
  description?: string;    // generated descriptions
  tags?: string[];         // club, league, category, season
};
```

### Club Recognition

Comprehensive mappings for 100+ clubs across major leagues:

- **Premier League**: Arsenal, Chelsea, Manchester United, etc.
- **La Liga**: Barcelona, Real Madrid, Atlético Madrid, etc.
- **Bundesliga**: Bayern Munich, Borussia Dortmund, etc.
- **Serie A**: Inter Milan, AC Milan, Juventus, etc.
- **Ligue 1**: PSG, Monaco, Nice, etc.
- **Champions League**: Ajax, Porto, Benfica, etc.

### Smart Pricing

Dynamic pricing based on:
- **Category**: Home ($85), Away ($85), Third ($90), GK ($95)
- **Club prestige**: Premium clubs get +$15
- **Random variation**: ±$10 for natural pricing

### Generated Descriptions

AI-like descriptions that include:
- Club name
- Category (Home, Away, etc.)
- Season
- Quality claims
- Authenticity statements

## ☁️ Cloudinary Integration

### Automatic Upload

When `CLOUDINARY_URL` is set, images are automatically uploaded:

```bash
# Upload to Cloudinary
npm run upload:cloudinary
```

### Benefits

- **CDN delivery** for faster loading
- **Automatic optimization** (quality, format)
- **Reliable hosting** (no hotlinking issues)
- **Organized folders** (`nuvion/product-slug/`)

### Configuration

```bash
# Required environment variables
CLOUDINARY_URL=cloudinary://cloud_name:api_key:api_secret@cloud_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📁 File Structure

```
nuvion/
├── data/
│   └── raw.json              # Raw scraped data
├── public/
│   └── images/
│       └── product-slug/     # Downloaded images
├── src/
│   └── data/
│       └── products.ts       # Enriched product data
└── scripts/
    ├── enhanced-yupoo-scraper.js    # Main scraper
    ├── gallery-dl-fallback.py       # Python fallback
    ├── enrich-products.js           # Enrichment pipeline
    └── cloudinary-upload.js         # Cloudinary upload
```

## 🔍 Troubleshooting

### Common Issues

#### Images Not Downloading

1. **Check network connectivity**
2. **Verify Yupoo site is accessible**
3. **Try gallery-dl fallback**
4. **Check browser console for errors**

#### Rate Limiting

- **Increase delays** in scraper configuration
- **Reduce maxAlbums** for testing
- **Use different IP** if blocked

#### Cloudinary Upload Fails

1. **Verify CLOUDINARY_URL** format
2. **Check API credentials**
3. **Ensure images exist** locally
4. **Check Cloudinary account** limits

### Debug Mode

Enable verbose logging by modifying scraper settings:

```javascript
// In enhanced-yupoo-scraper.js
this.delay = 5000; // Increase delay
this.maxAlbums = 5; // Reduce for testing
```

## 📊 Data Flow

```
Yupoo Albums → Enhanced Scraper → raw.json → Enrichment Pipeline → products.ts
                                    ↓
                              Cloudinary Upload (optional)
                                    ↓
                              Updated raw.json with Cloudinary URLs
```

## 🎯 Best Practices

### Scraping

1. **Start small**: Test with 5-10 albums first
2. **Monitor logs**: Watch for errors and warnings
3. **Respect rate limits**: Don't overwhelm servers
4. **Backup data**: Keep raw.json for reprocessing

### Enrichment

1. **Review mappings**: Check club/league recognition
2. **Adjust pricing**: Modify base prices as needed
3. **Customize descriptions**: Edit generation logic
4. **Validate output**: Test with your store

### Deployment

1. **Use Cloudinary**: For production image hosting
2. **Optimize images**: Enable Cloudinary transformations
3. **Monitor usage**: Track API calls and storage
4. **Backup regularly**: Keep local copies of images

## 🔄 Workflow Examples

### Basic Workflow

```bash
# 1. Scrape albums
npm run scrape:enhanced

# 2. Review raw data
cat data/raw.json

# 3. Enrich products
npm run enrich:products

# 4. Test store
npm run dev
```

### Production Workflow

```bash
# 1. Complete pipeline with Cloudinary
npm run scrape:with-cloudinary

# 2. Review enriched data
cat src/data/products.ts

# 3. Deploy
npm run build && npm start
```

### Testing Workflow

```bash
# 1. Test with small dataset
# Edit enhanced-yupoo-scraper.js: this.maxAlbums = 3

# 2. Run scraper
npm run scrape:enhanced

# 3. Test enrichment
npm run enrich:products

# 4. Verify output
npm run dev
```

## 📝 Customization

### Adding New Clubs

Edit `scripts/enrich-products.js`:

```javascript
this.clubMappings = {
  // Add new clubs here
  'new club': 'New Club FC',
  // ...
};
```

### Modifying Pricing

Edit the `generatePrice` method:

```javascript
generatePrice(club, category) {
  const basePrices = {
    'Home': 85,
    'Away': 85,
    'Third': 90,
    // Add new categories
  };
  // ...
}
```

### Custom Descriptions

Edit the `generateDescription` method:

```javascript
generateDescription(club, category, season) {
  const descriptions = [
    // Add custom descriptions
    `Your custom description for ${club} ${category}`,
    // ...
  ];
  // ...
}
```

## 🚨 Legal Notice

This scraping system is for educational purposes only. Please:

- **Respect robots.txt** and site terms of service
- **Use reasonable delays** to avoid overwhelming servers
- **Only scrape publicly available content**
- **Consider reaching out** to site owners for permission
- **Comply with local laws** regarding web scraping

## 🤝 Contributing

To improve the scraping system:

1. **Test with different Yupoo sites**
2. **Add new club/league mappings**
3. **Improve error handling**
4. **Optimize performance**
5. **Add new features**

## 📞 Support

For issues or questions:

1. **Check troubleshooting** section above
2. **Review logs** for error messages
3. **Test with gallery-dl fallback**
4. **Verify environment configuration**
5. **Check file permissions** and paths
