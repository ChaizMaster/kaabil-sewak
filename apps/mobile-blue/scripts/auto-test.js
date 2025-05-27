const chokidar = require('chokidar');
const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Starting automatic test runner...');
console.log('📁 Watching src/ directory for changes...');

let testProcess = null;
let isRunning = false;

function runTests() {
  if (isRunning) {
    console.log('⏳ Tests already running, skipping...');
    return;
  }

  isRunning = true;
  console.log('\n🔄 Running tests...');
  
  testProcess = spawn('npm', ['test', '--', '--passWithNoTests'], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd()
  });

  testProcess.on('close', (code) => {
    isRunning = false;
    if (code === 0) {
      console.log('✅ Tests passed!');
    } else {
      console.log('❌ Tests failed!');
    }
    console.log('👀 Watching for changes...\n');
  });

  testProcess.on('error', (error) => {
    isRunning = false;
    console.error('❌ Error running tests:', error.message);
    console.log('👀 Watching for changes...\n');
  });
}

// Watch for file changes
const watcher = chokidar.watch('src/**/*.{ts,tsx,js,jsx}', {
  ignored: [
    '**/node_modules/**',
    '**/.git/**',
    '**/coverage/**',
    '**/*.test.{ts,tsx,js,jsx}' // Don't trigger on test file changes
  ],
  persistent: true,
  ignoreInitial: true
});

watcher.on('change', (filePath) => {
  console.log(`📝 File changed: ${path.relative(process.cwd(), filePath)}`);
  runTests();
});

watcher.on('add', (filePath) => {
  console.log(`➕ File added: ${path.relative(process.cwd(), filePath)}`);
  runTests();
});

// Run tests initially
runTests();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down auto-test runner...');
  if (testProcess) {
    testProcess.kill();
  }
  watcher.close();
  process.exit(0);
}); 