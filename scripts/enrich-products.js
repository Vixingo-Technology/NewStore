const fs = require("fs").promises;
const path = require("path");

/**
 * Product Enrichment Pipeline
 *
 * Converts raw.json from scraper into properly structured products.json
 * with clean, consistent fields matching the Product type.
 *
 * Usage: npm run enrich:products
 */

class ProductEnrichmentPipeline {
  constructor() {
    this.rawJsonPath = path.join(__dirname, "../data/raw.json");
    this.outputPath = path.join(__dirname, "../src/data/products.ts");
    this.products = [];

    // Canonical club mappings
    this.clubMappings = {
      // Premier League
      arsenal: "Arsenal",
      chelsea: "Chelsea",
      "manchester united": "Manchester United",
      "manchester city": "Manchester City",
      liverpool: "Liverpool",
      tottenham: "Tottenham Hotspur",
      newcastle: "Newcastle United",
      brighton: "Brighton & Hove Albion",
      "west ham": "West Ham United",
      "leeds united": "Leeds United",
      "crystal palace": "Crystal Palace",
      "aston villa": "Aston Villa",
      fulham: "Fulham",
      brentford: "Brentford",
      wolves: "Wolverhampton Wanderers",
      everton: "Everton",
      "nottingham forest": "Nottingham Forest",
      burnley: "Burnley",
      luton: "Luton Town",
      "sheffield united": "Sheffield United",
      bournemouth: "AFC Bournemouth",

      // La Liga
      barcelona: "FC Barcelona",
      "real madrid": "Real Madrid",
      "atletico madrid": "Atlético Madrid",
      sevilla: "Sevilla FC",
      valencia: "Valencia CF",
      "athletic bilbao": "Athletic Bilbao",
      "real sociedad": "Real Sociedad",
      villarreal: "Villarreal CF",
      "real betis": "Real Betis",
      getafe: "Getafe CF",
      girona: "Girona FC",
      "las palmas": "UD Las Palmas",
      "rayo vallecano": "Rayo Vallecano",
      osasuna: "CA Osasuna",
      mallorca: "RCD Mallorca",
      alaves: "Deportivo Alavés",
      "celta vigo": "RC Celta de Vigo",
      granada: "Granada CF",
      cadiz: "Cádiz CF",
      almeria: "UD Almería",

      // Bundesliga
      "bayern munich": "Bayern Munich",
      "borussia dortmund": "Borussia Dortmund",
      "rb leipzig": "RB Leipzig",
      "bayer leverkusen": "Bayer 04 Leverkusen",
      "vfb stuttgart": "VfB Stuttgart",
      "eintracht frankfurt": "Eintracht Frankfurt",
      "tsg hoffenheim": "TSG 1899 Hoffenheim",
      "sc freiburg": "SC Freiburg",
      "vfl wolfsburg": "VfL Wolfsburg",
      "1. fc heidenheim": "1. FC Heidenheim",
      "1. fc union berlin": "1. FC Union Berlin",
      "borussia mönchengladbach": "Borussia Mönchengladbach",
      "werder bremen": "SV Werder Bremen",
      "fc augsburg": "FC Augsburg",
      "1. fc köln": "1. FC Köln",
      "fsv mainz 05": "FSV Mainz 05",
      "vfl bochum": "VfL Bochum",
      "sv darmstadt 98": "SV Darmstadt 98",

      // Serie A
      inter: "Inter Milan",
      "ac milan": "AC Milan",
      juventus: "Juventus",
      napoli: "SSC Napoli",
      atalanta: "Atalanta BC",
      roma: "AS Roma",
      lazio: "SS Lazio",
      fiorentina: "ACF Fiorentina",
      bologna: "Bologna FC 1909",
      torino: "Torino FC",
      monza: "AC Monza",
      genoa: "Genoa CFC",
      lecce: "US Lecce",
      frosinone: "Frosinone Calcio",
      sassuolo: "US Sassuolo Calcio",
      udinese: "Udinese Calcio",
      cagliari: "Cagliari Calcio",
      verona: "Hellas Verona FC",
      empoli: "Empoli FC",
      salernitana: "US Salernitana 1919",

      // Ligue 1
      psg: "Paris Saint-Germain",
      monaco: "AS Monaco",
      nice: "OGC Nice",
      lille: "LOSC Lille",
      lyon: "Olympique Lyonnais",
      marseille: "Olympique de Marseille",
      lens: "RC Lens",
      reims: "Stade de Reims",
      strasbourg: "RC Strasbourg Alsace",
      "le havre": "Le Havre AC",
      nantes: "FC Nantes",
      toulouse: "Toulouse FC",
      metz: "FC Metz",
      clermont: "Clermont Foot 63",
      montpellier: "Montpellier HSC",
      brest: "Stade Brestois 29",
      rennes: "Stade Rennais FC",
      troyes: "ES Troyes AC",
      auxerre: "AJ Auxerre",
      ajaccio: "AC Ajaccio",

      // Champions League
      ajax: "AFC Ajax",
      porto: "FC Porto",
      benfica: "SL Benfica",
      "sporting cp": "Sporting CP",
      "shakhtar donetsk": "Shakhtar Donetsk",
      "dinamo zagreb": "GNK Dinamo Zagreb",
      "red star belgrade": "Red Star Belgrade",
      olympiacos: "Olympiacos FC",
      feyenoord: "Feyenoord",
      psv: "PSV Eindhoven",
      "club brugge": "Club Brugge KV",
      "red bull salzburg": "Red Bull Salzburg",
      "young boys": "BSC Young Boys",
      "slavia prague": "SK Slavia Prague",
      "dinamo kyiv": "Dynamo Kyiv",
      galatasaray: "Galatasaray SK",
      besiktas: "Beşiktaş JK",
      fenerbahce: "Fenerbahçe SK",
      trabzonspor: "Trabzonspor",
      basaksehir: "İstanbul Başakşehir FK",
    };

    // League mappings
    this.leagueMappings = {
      "premier league": "Premier League",
      "la liga": "La Liga",
      bundesliga: "Bundesliga",
      "serie a": "Serie A",
      "ligue 1": "Ligue 1",
      "champions league": "Champions League",
      "europa league": "Europa League",
      "conference league": "Conference League",
      "national team": "National Teams",
      "world cup": "National Teams",
      euro: "National Teams",
    };

    // Category mappings
    this.categoryMappings = {
      home: "Home",
      away: "Away",
      third: "Third",
      fourth: "Fourth",
      gk: "GK",
      goalkeeper: "GK",
      training: "Training",
      "warm up": "Training",
      accessory: "Accessory",
      accessories: "Accessory",
      jacket: "Accessory",
      pants: "Accessory",
      shorts: "Accessory",
      socks: "Accessory",
      scarf: "Accessory",
      hat: "Accessory",
      cap: "Accessory",
    };
  }

  async loadRawData() {
    try {
      const data = await fs.readFile(this.rawJsonPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("❌ Error loading raw data:", error.message);
      console.log(
        "💡 Make sure to run the scraper first: npm run scrape:enhanced"
      );
      return { albums: [] };
    }
  }

  extractClub(title) {
    const lowerTitle = title.toLowerCase();

    // Try exact matches first
    for (const [key, value] of Object.entries(this.clubMappings)) {
      if (lowerTitle.includes(key)) {
        return value;
      }
    }

    // Try partial matches for common patterns
    const patterns = [
      /(arsenal|chelsea|manchester|united|city|liverpool|tottenham)/i,
      /(barcelona|madrid|atletico|sevilla|valencia|bilbao)/i,
      /(bayern|dortmund|leipzig|leverkusen|stuttgart|frankfurt)/i,
      /(inter|milan|juventus|napoli|atalanta|roma|lazio)/i,
      /(psg|monaco|nice|lille|lyon|marseille|lens)/i,
    ];

    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match) {
        const matched = match[1].toLowerCase();
        return this.clubMappings[matched] || this.capitalizeWords(matched);
      }
    }

    // Try to extract club name from title more intelligently
    // Look for common patterns like "Club Name Home/Away"
    const clubPatterns = [
      /^([a-zA-Z\s]+)\s+(home|away|third|training|goalkeeper)/i,
      /([a-zA-Z\s]+)\s+(jersey|kit|uniform|shirt)/i,
      /([a-zA-Z\s]+)\s+(player|fan|replica)/i,
    ];

    for (const pattern of clubPatterns) {
      const match = title.match(pattern);
      if (match && match[1]) {
        const potentialClub = match[1].trim();
        if (potentialClub.length > 2 && potentialClub.length < 50) {
          return this.capitalizeWords(potentialClub);
        }
      }
    }

    // If we still can't identify, try to extract from the beginning of the title
    // before any numbers or special characters
    const cleanTitle = title.replace(/[0-9\/\-\(\)]/g, " ").trim();
    const words = cleanTitle.split(/\s+/);
    if (words.length >= 2) {
      const potentialClub = words.slice(0, 2).join(" ").trim();
      if (potentialClub.length > 2 && potentialClub.length < 30) {
        return this.capitalizeWords(potentialClub);
      }
    }

    // Last resort: return null instead of "Unknown Club"
    return null;
  }

  extractLeague(title) {
    const lowerTitle = title.toLowerCase();

    for (const [key, value] of Object.entries(this.leagueMappings)) {
      if (lowerTitle.includes(key)) {
        return value;
      }
    }

    // Default based on club
    const club = this.extractClub(title).toLowerCase();
    if (
      club.includes("arsenal") ||
      club.includes("chelsea") ||
      club.includes("manchester") ||
      club.includes("leeds united") ||
      club.includes("west ham") ||
      club.includes("liverpool") ||
      club.includes("tottenham") ||
      club.includes("newcastle") ||
      club.includes("brighton") ||
      club.includes("crystal palace") ||
      club.includes("aston villa") ||
      club.includes("fulham") ||
      club.includes("brentford") ||
      club.includes("wolves") ||
      club.includes("everton") ||
      club.includes("nottingham forest") ||
      club.includes("burnley") ||
      club.includes("luton") ||
      club.includes("sheffield united") ||
      club.includes("bournemouth")
    ) {
      return "Premier League";
    } else if (
      club.includes("barcelona") ||
      club.includes("madrid") ||
      club.includes("atletico")
    ) {
      return "La Liga";
    } else if (
      club.includes("bayern") ||
      club.includes("dortmund") ||
      club.includes("leipzig")
    ) {
      return "Bundesliga";
    } else if (
      club.includes("inter") ||
      club.includes("milan") ||
      club.includes("juventus")
    ) {
      return "Serie A";
    } else if (
      club.includes("psg") ||
      club.includes("monaco") ||
      club.includes("nice")
    ) {
      return "Ligue 1";
    }

    return "Other";
  }

  extractCategory(title) {
    const lowerTitle = title.toLowerCase();

    for (const [key, value] of Object.entries(this.categoryMappings)) {
      if (lowerTitle.includes(key)) {
        return value;
      }
    }

    // Default to Home if no category found
    return "Home";
  }

  extractSeason(title) {
    const seasonPatterns = [
      /(20\d{2}[\/\-]20\d{2})/,
      /(20\d{2}[\/\-]\d{2})/,
      /(season\s+20\d{2}[\/\-]20\d{2})/i,
      /(20\d{2}[\/\-]20\d{2}\s+season)/i,
    ];

    for (const pattern of seasonPatterns) {
      const match = title.match(pattern);
      if (match) {
        let season = match[1];
        // Normalize format
        season = season.replace(/\-/g, "/");
        if (season.includes("season")) {
          season = season.replace(/season\s+/i, "").replace(/\s+season/i, "");
        }
        return season;
      }
    }

    // Default to current season
    const currentYear = new Date().getFullYear();
    return `${currentYear}/${currentYear + 1}`;
  }

  capitalizeWords(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  cleanTitle(title) {
    // Remove common prefixes/suffixes
    let cleaned = title
      .replace(/^(jersey|shirt|kit|uniform)\s+/i, "")
      .replace(/\s+(jersey|shirt|kit|uniform)$/i, "")
      .replace(/^(official|authentic|replica)\s+/i, "")
      .replace(/\s+(official|authentic|replica)$/i, "")
      .replace(/^(adidas|nike|puma|under armour)\s+/i, "")
      .replace(/\s+(adidas|nike|puma|under armour)$/i, "")
      .trim();

    // Capitalize properly
    cleaned = this.capitalizeWords(cleaned);

    return cleaned;
  }

  generateDescription(club, category, season) {
    const descriptions = [
      `Official ${club} ${category} jersey for the ${season} season. Premium quality with authentic team colors and design.`,
      `Authentic ${club} ${category} shirt featuring the latest ${season} design. Made with high-quality materials for comfort and durability.`,
      `Official ${club} ${category} kit for ${season}. Features the team's signature colors and authentic design elements.`,
      `Premium ${club} ${category} jersey from the ${season} season. Authentic team branding and superior craftsmanship.`,
      `Official ${club} ${category} uniform for ${season}. High-quality fabric with authentic team details and design.`,
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  generateTags(club, league, category, season) {
    const tags = [club, league, category, season];

    // Add brand tags based on common patterns
    if (
      club.includes("Arsenal") ||
      club.includes("Manchester United") ||
      club.includes("Real Madrid")
    ) {
      tags.push("Adidas");
    } else if (
      club.includes("Barcelona") ||
      club.includes("PSG") ||
      club.includes("Chelsea")
    ) {
      tags.push("Nike");
    } else if (club.includes("Manchester City") || club.includes("AC Milan")) {
      tags.push("Puma");
    }

    // Add season tags
    const year = season.split("/")[0];
    tags.push(`${year} Season`);

    return tags.filter((tag, index, self) => self.indexOf(tag) === index);
  }

  generatePrice(club, category) {
    // Base prices by category
    const basePrices = {
      Home: 85,
      Away: 85,
      Third: 90,
      Fourth: 90,
      GK: 95,
      Training: 65,
      Accessory: 45,
    };

    let basePrice = basePrices[category] || 85;

    // Premium clubs get higher prices
    const premiumClubs = [
      "Real Madrid",
      "Barcelona",
      "Manchester United",
      "Liverpool",
      "PSG",
    ];
    if (premiumClubs.includes(club)) {
      basePrice += 15;
    }

    // Add some variation
    const variation = Math.floor(Math.random() * 20) - 10;
    return Math.max(45, basePrice + variation);
  }

  enrichAlbum(album) {
    const { albumTitle, imageFiles } = album;

    // Extract information from title
    const club = this.extractClub(albumTitle);
    const league = this.extractLeague(albumTitle);
    const category = this.extractCategory(albumTitle);
    const season = this.extractSeason(albumTitle);

    // Clean title
    const cleanTitle = this.cleanTitle(albumTitle);

    // Generate product ID
    const productId = this.slugify(cleanTitle);

    // Generate other fields
    const price = this.generatePrice(club, category);
    const description = this.generateDescription(club, category, season);
    const tags = this.generateTags(club, league, category, season);

    // Default sizes
    const sizes = ["S", "M", "L", "XL", "XXL"];

    return {
      id: productId,
      title: cleanTitle,
      club: club,
      league: league,
      category: category,
      season: season,
      price: price,
      sizes: sizes,
      images: imageFiles,
      description: description,
      tags: tags,
      isNew: Math.random() > 0.7,
      isOnSale: Math.random() > 0.6,
      inStock: true,
      brand:
        tags.find((tag) =>
          ["Adidas", "Nike", "Puma", "Under Armour"].includes(tag)
        ) || "Adidas",
      material: "100% Recycled Polyester",
    };
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async generateProductsFile(products) {
    const categories = [
      "All",
      "Premier League",
      "La Liga",
      "Bundesliga",
      "Ligue 1",
      "Serie A",
      "Champions League",
      "National Teams",
      "Other",
    ];

    const brands = ["All", "Adidas", "Nike", "Puma", "Under Armour"];

    const sizes = ["S", "M", "L", "XL", "XXL"];

    const fileContent = `// Auto-generated product data
// Generated on: ${new Date().toISOString()}
// Source: raw.json from Yupoo scraper

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  sizes: string[];
  category: string;
  images: string[];
  description: string;
  isNew?: boolean;
  isOnSale?: boolean;
  inStock: boolean;
  brand: string;
  season?: string;
  material?: string;
  club?: string;
  league?: string;
  tags?: string[];
}

export const products: Product[] = ${JSON.stringify(products, null, 2)};

export const categories = ${JSON.stringify(categories, null, 2)};

export const brands = ${JSON.stringify(brands, null, 2)};

export const sizes = ${JSON.stringify(sizes, null, 2)};

export default products;
`;

    return fileContent;
  }

  async run() {
    console.log("🎯 Product Enrichment Pipeline");
    console.log("==============================");

    try {
      // Load raw data
      const rawData = await this.loadRawData();

      if (!rawData.albums || rawData.albums.length === 0) {
        console.log("❌ No albums found in raw data");
        return;
      }

      console.log(`📊 Processing ${rawData.albums.length} albums...`);

      // Enrich each album
      const usedIds = new Set();

      for (let i = 0; i < rawData.albums.length; i++) {
        const album = rawData.albums[i];
        const enrichedProduct = this.enrichAlbum(album);

        // Skip products with null club (couldn't identify club)
        if (!enrichedProduct.club) {
          console.log(`⚠️  Skipped (no club): ${enrichedProduct.title}`);
          continue;
        }

        // Ensure unique ID by adding index if needed
        let uniqueId = enrichedProduct.id;
        if (usedIds.has(uniqueId)) {
          uniqueId = `${enrichedProduct.id}-${i + 1}`;
        }
        enrichedProduct.id = uniqueId;
        usedIds.add(uniqueId);

        this.products.push(enrichedProduct);

        console.log(`✅ Enriched: ${enrichedProduct.title}`);
      }

      // Generate products file
      const fileContent = await this.generateProductsFile(this.products);

      // Ensure output directory exists
      await fs.mkdir(path.dirname(this.outputPath), { recursive: true });

      // Write file
      await fs.writeFile(this.outputPath, fileContent, "utf8");

      console.log("\n🎉 Enrichment completed successfully!");
      console.log(`📊 Total products enriched: ${this.products.length}`);
      console.log(`📄 Products file saved to: ${this.outputPath}`);

      // Show summary
      const clubs = [
        ...new Set(this.products.map((p) => p.club).filter(Boolean)),
      ];
      const leagues = [
        ...new Set(this.products.map((p) => p.league).filter(Boolean)),
      ];
      const categories = [
        ...new Set(this.products.map((p) => p.category).filter(Boolean)),
      ];

      console.log("\n📈 Summary:");
      console.log(
        `🏟️  Clubs: ${clubs.length} (${clubs.slice(0, 5).join(", ")}${
          clubs.length > 5 ? "..." : ""
        })`
      );
      console.log(`🏆 Leagues: ${leagues.join(", ")}`);
      console.log(`👕 Categories: ${categories.join(", ")}`);

      console.log("\n📝 Next steps:");
      console.log("1. Review the generated products.ts file");
      console.log("2. Adjust prices, descriptions, or categories as needed");
      console.log("3. Test the e-commerce store with enriched product data");
    } catch (error) {
      console.error("❌ Enrichment failed:", error);
    }
  }
}

if (require.main === module) {
  const pipeline = new ProductEnrichmentPipeline();
  pipeline.run().catch(console.error);
}

module.exports = ProductEnrichmentPipeline;
