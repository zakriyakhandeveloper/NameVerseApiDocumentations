import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const routeMap = {
  '/docs': 'docs/Docs.html',
  '/blog': 'docs/Blog.html',
  '/getnames': 'src/getnames.html',
  '/getnamesbysearch': 'src/getnamesbysearch.html',
  '/getnamesbyletter': 'src/getnamesbyletter.html',
  '/getnamesbyreligion': 'src/getnamesbyreligion.html',
  '/getfilteroptions': 'src/getfilters.html',
};

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

export default function handler(req, res) {
  const urlPath = `/${(req.query.path || []).join('/')}`;
  
  if (urlPath === '/' || urlPath === '') {
    const indexPath = join(process.cwd(), 'public', 'index.html');
    try {
      const content = readFileSync(indexPath);
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'no-cache');
      return res.status(200).send(content);
    } catch (e) {
      return res.status(404).send('Not Found');
    }
  }

  // Check route map
  if (routeMap[urlPath]) {
    const filePath = join(process.cwd(), 'public', routeMap[urlPath]);
    try {
      const content = readFileSync(filePath);
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Cache-Control', 'no-cache');
      return res.status(200).send(content);
    } catch (e) {
      return res.status(404).send('Not Found');
    }
  }

  // Check for direct file
  const directPath = join(process.cwd(), 'public', urlPath);
  if (existsSync(directPath)) {
    try {
      const ext = directPath.substring(directPath.lastIndexOf('.'));
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      const content = readFileSync(directPath);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'no-cache');
      return res.status(200).send(content);
    } catch (e) {
      return res.status(404).send('Not Found');
    }
  }

  // Return 404
  res.status(404).send('Not Found');
}
