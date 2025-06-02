const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  // Ensure the projectRoot is explicitly set to this app's directory for Webpack
  env.projectRoot = env.projectRoot || __dirname;

  const config = await createExpoWebpackConfigAsync(env, argv);

  // Customize the webpack config here if needed in the future
  // For example, to ensure correct module resolution for monorepos:
  config.context = path.resolve(__dirname); // Set context to the current app directory

  // If you have workspace/linked packages, you might need to configure
  // Webpack to correctly resolve them and their dependencies.
  // Example: Ensure shared packages are processed by Babel
  // config.module.rules.push({
  //   test: /\.(js|jsx|ts|tsx)$/,
  //   include: [
  //     path.resolve(__dirname, '../../packages'), // Path to your shared packages
  //   ],
  //   loader: 'babel-loader',
  //   options: {
  //     presets: ['babel-preset-expo'],
  //   },
  // });

  // Example: Resolve modules from the monorepo root node_modules as a fallback
  // if (config.resolve.modules) {
  //   config.resolve.modules.push(path.resolve(__dirname, '../../node_modules'));
  // } else {
  //   config.resolve.modules = [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, '../../node_modules')];
  // }
  
  // Example: Ensure aliases work if you use them for shared packages
  // config.resolve.alias = {
  //   ...config.resolve.alias,
  //   '@shared': path.resolve(__dirname, '../../packages/shared/src'),
  // };

  return config;
}; 