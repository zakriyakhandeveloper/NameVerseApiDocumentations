# NameVerse API Documentation

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Comprehensive API documentation site for **NameVerse API** - A free API providing access to 70,000+ names across Islamic, Hindu, and Christian traditions with meanings, origins, lucky days, and personality traits.

## 🚀 Features

- **70,000+ Names Database** - Access names from Islamic, Hindu, and Christian traditions
- **Rich Data** - Names include meanings, origins, lucky days, personality traits
- **Free & Open API** - No authentication required
- **Comprehensive Documentation** - Detailed API reference with live testing
- **SEO Optimized** - Fast indexing with proper meta tags and structured data
- **Responsive Design** - Works perfectly on all devices
- **Performance Optimized** - Fast loading with compression and caching

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Deployment](#deployment)
- [SEO & Performance](#seo--performance)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Installation

### Prerequisites

- Node.js >= 20.0.0
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NameMeaningApiDocumentation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   HOST=0.0.0.0
   NODE_ENV=development
   API_BASE=https://namverse-api.vercel.app/api/names
   SITE_URL=https://nameversedocumentations.vercel.app
   CORS_ORIGIN=https://nameversedocumentations.vercel.app,https://nameverse.vercel.app
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:5000`

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `HOST` | Server host | `0.0.0.0` |
| `NODE_ENV` | Environment mode | `development` |
| `API_BASE` | External API base URL | `https://namverse-api.vercel.app/api/names` |
| `SITE_URL` | Site canonical URL | `https://nameversedocumentations.vercel.app` |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | Multiple defaults |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

## 📖 Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

### Generate Sitemaps

```bash
npm run build:sitemap
```

### Regenerate Sitemap Index

```bash
npm run regen:sitemap
```

## 🔌 API Endpoints

### Documentation Pages

- `/` - Main landing page
- `/docs` - Complete API documentation
- `/blog` - Blog and updates
- `/getnames` - Get Names API testing
- `/getnamesbysearch` - Search Names API testing
- `/getnamesbyletter` - Get Names by Letter API testing
- `/getnamesbyreligion` - Get Names by Religion API testing
- `/getfilteroptions` - Get Filter Options API testing
- `/names/:religion/:name` - Get Name by Slug page

### API Endpoints

- `GET /api/names` - Retrieve filtered names
  - Query params: `limit`, `alphabet`, `religion`
- `GET /health` - Health check endpoint

## 🏗️ Development

### Project Structure

```
.
├── config.js              # Configuration module
├── server.js              # Express server
├── build-url.js           # Sitemap generation script
├── regen-index.js         # Sitemap index regeneration
├── package.json           # Dependencies and scripts
├── vercel.json            # Vercel deployment config
├── public/                # Static files (logo, favicon)
├── src/                   # HTML documentation pages
├── docs/                  # Additional documentation
└── api/                   # Vercel serverless functions
```

### Code Quality

- **ESLint** - Code linting
- **Jest** - Testing framework
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

### Testing

```bash
npm test
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment

```bash
# Build (if needed)
npm run build

# Deploy to your hosting provider
```

## 🔍 SEO & Performance

### SEO Features

- ✅ Optimized meta tags for all pages
- ✅ Structured data (JSON-LD)
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Sitemap generation
- ✅ Robots.txt configuration

### Performance Features

- ✅ Gzip compression
- ✅ Static file caching
- ✅ Preconnect for external resources
- ✅ Lazy loading for images
- ✅ Minified assets

### Sitemap Generation

The project includes automated sitemap generation:

```bash
npm run build:sitemap
```

This generates:
- Individual sitemap files (max 1000 URLs each)
- Sitemap index file
- Progress tracking for resumable generation

## 🛡️ Security

- **Helmet.js** - Security headers
- **CORS** - Restricted origins
- **Rate Limiting** - API protection
- **Input Validation** - Request validation
- **Error Handling** - Secure error messages

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**NameVerse Team**

- Website: [nameverse.vercel.app](https://nameverse.vercel.app)
- Email: zakriyakhan8760@gmail.com

## 🙏 Acknowledgments

- All contributors and users of NameVerse API
- Open source community

## 📊 Statistics

- **70,000+** Names in database
- **3** Supported religions (Islamic, Hindu, Christian)
- **50+** Origins
- **100%** Free and open

---

Made with ❤️ by NameVerse Team
