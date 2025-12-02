# NameVerse API Documentation

## Overview
This is a static HTML website that serves as the documentation and testing interface for the NameVerse API. The API provides access to a comprehensive database of 70,000+ names across Islamic, Hindu, and Christian traditions with detailed information including meanings, origins, lucky days, personality traits, and more.

## Project Status
✅ **Deployed to Netlify** - https://nameverseapidocumentation.netlify.app/

## Project Structure
```
public/                    # Static site root (deployed)
├── index.html            # Main landing page with client-side router
├── _redirects            # Netlify routing configuration for clean URLs
├── 404.html              # Handles clean URL routing
├── server.js             # Development static server
├── package.json          # Development server config
├── docs/                 # Documentation HTML pages
│   ├── Docs.html
│   ├── Blog.html
│   └── ...
└── src/                  # Endpoint testing pages
    ├── getnames.html
    ├── getnamesbysearch.html
    ├── getnamesbyslug.html
    └── ...

NameMeaningApiDocumentation/   # Original Node.js source (reference)
```

## Tech Stack
- **Frontend**: Static HTML, CSS (TailwindCSS CDN), Vanilla JavaScript
- **Hosting**: Netlify (FREE static deployment)
- **Routing**: Client-side JavaScript routing + Netlify redirects for clean URLs
- **API**: Calls external API at namverse-api.vercel.app

## Deployment
- **Type**: Static deployment on Netlify (FREE)
- **Public Directory**: `public`
- **URLs**: Clean URLs without hash (e.g., `/docs`, `/names/islamic/muhammad`)
- **Netlify Redirects**: `_redirects` file handles all route redirects

## How Clean URLs Work
1. `_redirects` file tells Netlify to serve `index.html` for all routes
2. `index.html` contains client-side router that detects the URL path
3. Router loads the appropriate page content based on path
4. Dynamic routes like `/names/:religion/:slug` map to `getnamesbyslug.html`

## Available Routes
- `/` - Main documentation landing page
- `/docs` - API documentation
- `/blog` - Blog page
- `/getnames` - Get names endpoint testing
- `/getnamesbysearch` - Search names by query
- `/getnamesbyletter` - Filter names by starting letter
- `/getnamesbyreligion` - Filter names by religion
- `/getfilteroptions` - Get available filter options
- `/names/:religion/:slug` - View specific name (e.g., `/names/islamic/muhammad`)
- `/health` - Health check endpoint

## API Features
- 70,000+ names across religions
- 50+ origins (Arabic, Sanskrit, Hebrew, etc.)
- Deep meanings and interpretations
- Lucky days and numbers
- Personality traits
- Filter by religion, alphabet, and more

## Recent Changes (December 02, 2025)
- ✅ Converted from Node.js/Express to static site for FREE hosting
- ✅ Implemented client-side routing for clean URLs
- ✅ Created 404.html for SPA-style routing
- ✅ Created _redirects file for Netlify configuration
- ✅ All routes working with clean URLs
- ✅ External API calls to 70K+ names database working
- ✅ Deployed to Netlify successfully
- ✅ Complete SEO optimization with meta tags and internal linking
- ✅ Mobile-responsive design across ALL pages:
  - Responsive padding: px-3 on mobile → px-6 on desktop
  - Responsive font sizes: text-lg sm:text-2xl breakpoints
  - Responsive spacing: gap-4 sm:gap-6 for consistency
  - Code/endpoint boxes: overflow-x-auto with break-all text wrapping
  - Headers: Compact mobile layouts with smaller icons (w-8 sm:w-12)
  - Navigation: Abbreviated labels on mobile (Docs vs Documentation)
  - All text properly wraps instead of exceeding screen width
  - Tested on all main pages: /, /docs, /getnames, /getnamesbysearch

## Development Server
Run locally: `cd public && npm start`
Access: http://localhost:5000

## Production Deployment

### Netlify (Current)
Live: https://nameverseapidocumentation.netlify.app/

### Vercel Deployment Ready
To deploy to Vercel:
1. Push code to GitHub
2. Go to https://vercel.com → New Project
3. Import your GitHub repository
4. Vercel auto-detects `public` folder
5. Deploy (automatic)

**Note:** `vercel.json` is already configured for:
- Clean URL routing (client-side router)
- Proper sitemap.xml and robots.txt serving
- Cache headers for performance
- All 28+ pages indexed by Google

## User Preferences
- Clean, simple static HTML site with no complex build process
- Mobile-friendly responsive design
- SEO-optimized for search engines
- Fast-loading static pages
- External API integration for data
