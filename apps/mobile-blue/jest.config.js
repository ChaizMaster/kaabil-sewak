module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*|@sentry/react-native|react-navigation|@kaabil/shared)',
  ],
  moduleNameMapper: {
    '^@kaabil/shared$': '<rootDir>/../../packages/shared',
    '^react$': '<rootDir>/../../node_modules/react',
    '^react-native$': '<rootDir>/../../node_modules/react-native',
  },
}; 