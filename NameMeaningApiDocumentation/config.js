/**
 * Configuration module for NameVerse API Documentation
 * Loads and validates environment variables
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * Application configuration
 */
const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '5000', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API configuration
  apiBase: process.env.API_BASE || 'https://namverse-api.vercel.app/api/names',
  siteUrl: process.env.SITE_URL || 'https://nameversedocumentations.vercel.app',
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',')
      : ['https://nameversedocumentations.vercel.app', 'https://nameverse.vercel.app', 'http://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window
    message: 'Too many requests from this IP, please try again later.'
  },
  
  // Security
  security: {
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://namverse-api.vercel.app"]
        }
      }
    }
  },
  
  // Allowed religions
  allowedReligions: ['christian', 'islamic', 'hindu'],
  
  // Validation limits
  limits: {
    minLimit: 1,
    maxLimit: 500,
    maxAlphabetLength: 1
  }
};

/**
 * Validate configuration
 */
function validateConfig() {
  const errors = [];
  
  if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
    errors.push('PORT must be a valid port number (1-65535)');
  }
  
  if (!config.apiBase.startsWith('http')) {
    errors.push('API_BASE must be a valid URL');
  }
  
  if (!config.siteUrl.startsWith('http')) {
    errors.push('SITE_URL must be a valid URL');
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join('\n')}`);
  }
}

// Validate on load
validateConfig();

export default config;

