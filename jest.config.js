module.exports = {
  name: 'machine-readable-zone',
  automock: false,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '/src/.+?\\.test\\.ts$',
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
  globals: {
    'ts-jest': {
      skipBabel: false,
    },
  },
};
