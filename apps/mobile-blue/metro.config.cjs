const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../../');

const config = getDefaultConfig(projectRoot);

// Set the project root for Metro explicitly.
config.projectRoot = projectRoot;

// Watch all files in the monorepo, including the shared packages and this app.
config.watchFolders = [workspaceRoot];

// Let Metro know where to resolve packages from (both app-specific and monorepo root)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// For Firebase JS SDK compatibility with Expo SDK 53+
if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}
config.resolver.unstable_enablePackageExports = false;
config.resolver.disableHierarchicalLookup = true;

module.exports = config; 