const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../../');

const config = getDefaultConfig(projectRoot);

// Set the project root for Metro explicitly.
// This is crucial for ensuring that Metro resolves modules correctly from this app's perspective.
config.projectRoot = projectRoot;

// Watch all files in the monorepo, including the shared packages and this app.
config.watchFolders = [workspaceRoot]; // Watching the entire workspace is common.

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

// For monorepos, it's often recommended to disable hierarchical lookup
// to prevent Metro from resolving modules from unexpected locations outside the defined nodeModulesPaths.
config.resolver.disableHierarchicalLookup = true;

// If you have an alias for your shared packages, ensure it's configured correctly
// Example:
// config.resolver.alias = {
//   '@shared': path.resolve(workspaceRoot, 'packages/shared/src'),
// };

module.exports = config; 