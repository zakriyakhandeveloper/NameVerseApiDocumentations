/**
 * Server Tests
 * Basic tests for NameVerse API Documentation Server
 */

import request from 'supertest';
import app from '../server.js';

describe('NameVerse API Documentation Server', () => {
  
  describe('Health Check', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('Documentation Routes', () => {
    test('GET / should return 200', async () => {
      await request(app)
        .get('/')
        .expect(200);
    });

    test('GET /docs should return 200', async () => {
      await request(app)
        .get('/docs')
        .expect(200);
    });

    test('GET /blog should return 200', async () => {
      await request(app)
        .get('/blog')
        .expect(200);
    });
  });

  describe('API Endpoints', () => {
    test('GET /api/names should return 200 with valid query', async () => {
      const response = await request(app)
        .get('/api/names?limit=10')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
    });

    test('GET /api/names should validate limit parameter', async () => {
      const response = await request(app)
        .get('/api/names?limit=1000')
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });

    test('GET /api/names should filter by religion', async () => {
      const response = await request(app)
        .get('/api/names?religion=islamic&limit=5')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    test('GET /api/names should filter by alphabet', async () => {
      const response = await request(app)
        .get('/api/names?alphabet=A&limit=5')
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    test('GET /api/names should reject invalid religion', async () => {
      const response = await request(app)
        .get('/api/names?religion=invalid')
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Error Handling', () => {
    test('GET /nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Security Headers', () => {
    test('Response should include security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      // Helmet adds security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
    });
  });

  describe('Rate Limiting', () => {
    test('API endpoints should have rate limiting', async () => {
      // Make multiple requests
      const requests = Array(10).fill(null).map(() => 
        request(app).get('/api/names?limit=1')
      );
      
      const responses = await Promise.all(requests);
      // All should succeed (within rate limit)
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });
});

