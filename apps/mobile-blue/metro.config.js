const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add the monorepo packages to the Metro resolver
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
];

// Configure the resolver to use source files for shared package
config.resolver.alias = {
  'shared': path.resolve(__dirname, '../../packages/shared/src'),
  '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
};

// Watch additional directories for changes
config.watchFolders = [
  path.resolve(__dirname, '../../packages/shared'),
  path.resolve(__dirname, '../../node_modules'),
];

module.exports = config; 