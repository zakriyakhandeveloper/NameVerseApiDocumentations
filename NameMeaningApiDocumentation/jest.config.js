/**
 * Jest Configuration
 */
export default {
  testEnvironment: 'node',
  transform: {},
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'server.js',
    'config.js',
    'api/**/*.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};

