/**
 * NameVerse API Documentation Server
 * Express server for serving API documentation and handling API requests
 * 
 * @author NameVerse
 * @version 1.0.0
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path"; 
import { fileURLToPath } from "url";
import config from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet for security headers
app.use(helmet(config.security.helmet));

// CORS with restricted origins
app.use(cors(config.cors));

// Compression for better performance
app.use(compression());

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// STATIC FILES
// ============================================

// Serve static files with cache headers
const staticOptions = {
  maxAge: config.nodeEnv === 'production' ? '1d' : '0',
  etag: true,
  lastModified: true,
  redirect: false
};

app.use('/docs', express.static(path.join(__dirname, "docs"), staticOptions));
app.use(express.static(path.join(__dirname, "public"), staticOptions));
app.use(express.static(path.join(__dirname, "src"), staticOptions));

// ============================================
// REQUEST LOGGING (Development)
// ============================================

if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// DOCUMENTATION ROUTES
// ============================================

/**
 * Main documentation page
 */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/**
 * Documentation pages
 */
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "Docs.html"));
});

app.get("/blog", (req, res) => {
  res.sendFile(path.join(__dirname, "docs", "Blog.html"));
});

app.get("/getnames", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getnames.html"));
});

app.get("/getnamesbysearch", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getnamesbysearch.html"));
});

app.get("/getnamesbyletter", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getnamesbyletter.html"));
});

app.get("/getnamesbyreligion", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getnamesbyreligion.html"));
});

app.get("/getfilteroptions", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getfilters.html"));
});

app.get("/getarticles", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getarticles.html"));
});

app.get("/getarticlessearch", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getarticlessearch.html"));
});

app.get("/getarticlescategories", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getarticlescategories.html"));
});

app.get("/relatednames", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "relatednames.html"));
});

app.get("/similarnames", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "similarnames.html"));
});

app.get("/articleslatest", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "articleslatest.html"));
});

app.get("/articlebyslug", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "articlebyslug.html"));
});

app.get("/healthcheck", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "health.html"));
});

app.get("/namebyslug", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "getnamesbyslug.html"));
});

/**
 * Dynamic name page route
 * @param {string} religion - Religion type (christian, islamic, hindu)
 * @param {string} name - Name slug
 */
app.get("/names/:religion/:name", (req, res, next) => {
  try {
    const { religion, name } = req.params;

    // Validate religion
    if (!config.allowedReligions.includes(religion.toLowerCase())) {
      return res.status(400).json({
        error: "Invalid religion",
        message: `Religion must be one of: ${config.allowedReligions.join(', ')}`,
        received: religion
      });
    }

    // Validate name (basic sanitization)
    if (!name || name.length < 1 || name.length > 100) {
      return res.status(400).json({
        error: "Invalid name parameter",
        message: "Name must be between 1 and 100 characters"
      });
    }

    // Serve HTML page
    res.sendFile(path.join(__dirname, "src", "getnamesbyslug.html"));
  } catch (error) {
    next(error);
  }
});

// ============================================
// API ENDPOINTS
// ============================================

/**
 * GET /api/names - Retrieve filtered names
 * Query parameters:
 *   - limit: Number of results (1-500, default: 50)
 *   - alphabet: Filter by first letter (A-Z)
 *   - religion: Filter by religion (christian, islamic, hindu)
 */
app.get("/api/names", async (req, res, next) => {
  try {
    const { limit = 50, alphabet, religion } = req.query;
    
    // Validate limit
    const limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < config.limits.minLimit || limitNum > config.limits.maxLimit) {
      return res.status(400).json({
        error: "Invalid limit parameter",
        message: `Limit must be between ${config.limits.minLimit} and ${config.limits.maxLimit}`,
        received: limit
      });
    }
    
    // Validate alphabet
    if (alphabet && (!/^[A-Za-z]$/.test(alphabet) || alphabet.length > config.limits.maxAlphabetLength)) {
      return res.status(400).json({
        error: "Invalid alphabet parameter",
        message: "Alphabet must be a single letter A-Z",
        received: alphabet
      });
    }
    
    // Validate religion
    if (religion && !config.allowedReligions.includes(religion.toLowerCase())) {
      return res.status(400).json({
        error: "Invalid religion parameter",
        message: `Religion must be one of: ${config.allowedReligions.join(', ')}`,
        received: religion
      });
    }
    
    // Sample data (replace with actual database call)
    const sampleNames = {
      christian: [
        'Aaron', 'Abraham', 'Adam', 'Andrew', 'Anna', 'Alice', 'Anthony', 'Abigail',
        'Benjamin', 'Bethany', 'Caleb', 'Catherine', 'Daniel', 'David', 'Deborah',
        'Elizabeth', 'Emma', 'Ethan', 'Faith', 'Gabriel', 'Grace', 'Hannah',
        'Isaac', 'Isabella', 'Jacob', 'James', 'John', 'Joseph', 'Joshua',
        'Luke', 'Mary', 'Matthew', 'Michael', 'Moses', 'Nathan', 'Noah',
        'Paul', 'Peter', 'Rachel', 'Rebecca', 'Ruth', 'Samuel', 'Sarah',
        'Simon', 'Sophia', 'Stephen', 'Thomas', 'Timothy'
      ],
      islamic: [
        'Aisha', 'Ahmad', 'Ali', 'Amira', 'Amina', 'Bilal', 'Fatima', 'Hamza',
        'Hassan', 'Hussein', 'Ibrahim', 'Ismail', 'Khadija', 'Khalid', 'Leila',
        'Mahmoud', 'Malak', 'Mariam', 'Maryam', 'Mohamed', 'Muhammad', 'Mustafa',
        'Noor', 'Omar', 'Rashid', 'Salah', 'Salma', 'Sara', 'Yasmin', 'Yusuf',
        'Zahra', 'Zainab', 'Abdullah', 'Abdul', 'Ahmed', 'Anas', 'Ayesha'
      ],
      hindu: [
        'Aarav', 'Aditya', 'Aditi', 'Ajay', 'Amit', 'Ananya', 'Anjali', 'Arjun',
        'Aryan', 'Asha', 'Deepak', 'Devi', 'Ganesh', 'Gita', 'Isha', 'Jay',
        'Kiran', 'Krishna', 'Lakshmi', 'Maya', 'Meera', 'Nisha', 'Pooja',
        'Priya', 'Raj', 'Ravi', 'Rohit', 'Sanjay', 'Sarita', 'Shiva',
        'Sita', 'Uma', 'Vijay', 'Vikram', 'Vishnu'
      ]
    };
    
    // Get names based on religion filter
    let names = religion 
      ? sampleNames[religion.toLowerCase()] || []
      : Object.values(sampleNames).flat();
    
    // Filter by alphabet if provided
    if (alphabet) {
      names = names.filter(name => 
        name.toLowerCase().startsWith(alphabet.toLowerCase())
      );
    }
    
    // Apply limit
    names = names.slice(0, limitNum);
    
    // Return response
    res.json({
      success: true,
      count: names.length,
      data: names,
      pagination: {
        limit: limitNum,
        total: names.length
      }
    });
    
  } catch (error) {
    next(error);
  }
});

// ============================================
// HEALTH CHECK
// ============================================

/**
 * GET /health - Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "NameVerse API Documentation",
    version: "1.0.0",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    endpoints: {
      documentation: "/",
      liveTesting: "/names",
      api: "/api/names",
      health: "/health"
    }
  });
});

// ============================================
// ERROR HANDLERS
// ============================================

/**
 * 404 Not Found Handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.path}`,
    availableRoutes: {
      documentation: "/",
      docs: "/docs",
      blog: "/blog",
      api: "/api/names",
      health: "/health"
    }
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  // Log error
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Send error response
  res.status(statusCode).json({
    error: err.message || "Internal server error",
    statusCode,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = config.port;
const HOST = config.host;

if (config.nodeEnv !== 'test') {
  app.listen(PORT, HOST, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║     🚀 NameVerse API Server Running            ║
╠════════════════════════════════════════════════╣
║  Environment:   ${config.nodeEnv.padEnd(30)}║
║  📘 Documentation:   http://${HOST}:${PORT}/     ║
║  🎨 Live Testing:    http://${HOST}:${PORT}/names║
║  🏥 Health Check:    http://${HOST}:${PORT}/health║
║  🔧 API Endpoint:    http://${HOST}:${PORT}/api/names║
╚════════════════════════════════════════════════╝
    `);
  });
}

export default app;
