module.exports = {
  name: 'mrz',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '/src/.+?\\.test\\.(js|ts)$',
  mapCoverage: true,
  collectCoverage: true,
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
    'node',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
