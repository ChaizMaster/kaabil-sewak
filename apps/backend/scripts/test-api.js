const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (err) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testLocationEndpoints() {
  console.log('\n📍 Testing Location Endpoints:');
  console.log('='.repeat(50));
  
  try {
    // Test creating a sample location
    console.log('1. Creating sample location...');
    const sampleLocation = {
      userId: 'test-user-123',
      address: '123 Test Street, Test Area',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      coordinates: {
        latitude: 28.6139,
        longitude: 77.2090
      },
      source: 'manual'
    };
    
    const createResponse = await makeRequest('POST', '/location', sampleLocation);
    console.log(`   Status: ${createResponse.status}`);
    console.log(`   Response:`, createResponse.data);
    
    // Test getting user location
    console.log('\n2. Getting user location...');
    const getUserResponse = await makeRequest('GET', '/location/user/test-user-123');
    console.log(`   Status: ${getUserResponse.status}`);
    console.log(`   Response:`, getUserResponse.data);
    
    // Test getting nearby users
    console.log('\n3. Finding nearby users...');
    const nearbyResponse = await makeRequest('GET', '/location/nearby?latitude=28.6139&longitude=77.2090&radius=50');
    console.log(`   Status: ${nearbyResponse.status}`);
    console.log(`   Found ${nearbyResponse.data.data ? nearbyResponse.data.data.length : 0} nearby users`);
    
    // Test getting users by city
    console.log('\n4. Getting users by city...');
    const cityResponse = await makeRequest('GET', '/location/city/New Delhi');
    console.log(`   Status: ${cityResponse.status}`);
    console.log(`   Found ${cityResponse.data.data ? cityResponse.data.data.length : 0} users in New Delhi`);
    
  } catch (error) {
    console.error('Error testing location endpoints:', error.message);
  }
}

async function testBackgroundCheckEndpoints() {
  console.log('\n🔍 Testing Background Check Endpoints:');
  console.log('='.repeat(50));
  
  try {
    // Test initiating address verification
    console.log('1. Initiating address verification...');
    const addressVerifyResponse = await makeRequest('POST', '/location/background-check/address/test-user-123');
    console.log(`   Status: ${addressVerifyResponse.status}`);
    console.log(`   Response:`, addressVerifyResponse.data);
    
    // Test getting user background checks
    console.log('\n2. Getting user background checks...');
    const userChecksResponse = await makeRequest('GET', '/location/background-check/user/test-user-123');
    console.log(`   Status: ${userChecksResponse.status}`);
    console.log(`   Found ${userChecksResponse.data.data ? userChecksResponse.data.data.length : 0} background checks`);
    
    // Test getting risk assessment
    console.log('\n3. Getting risk assessment...');
    const riskResponse = await makeRequest('GET', '/location/risk-assessment/test-user-123');
    console.log(`   Status: ${riskResponse.status}`);
    console.log(`   Response:`, riskResponse.data);
    
  } catch (error) {
    console.error('Error testing background check endpoints:', error.message);
  }
}

async function testAnalyticsEndpoints() {
  console.log('\n📊 Testing Analytics Endpoints:');
  console.log('='.repeat(50));
  
  try {
    const analyticsResponse = await makeRequest('GET', '/analytics');
    console.log(`   Status: ${analyticsResponse.status}`);
    console.log(`   Response:`, analyticsResponse.data);
  } catch (error) {
    console.error('Error testing analytics endpoints:', error.message);
  }
}

async function testJobsEndpoints() {
  console.log('\n💼 Testing Jobs Endpoints:');
  console.log('='.repeat(50));
  
  try {
    // Test getting nearby jobs
    const jobsResponse = await makeRequest('GET', '/jobs/nearby?latitude=28.6139&longitude=77.2090');
    console.log(`   Status: ${jobsResponse.status}`);
    console.log(`   Found ${jobsResponse.data.data ? jobsResponse.data.data.length : 0} nearby jobs`);
    
    // Test job search
    const searchResponse = await makeRequest('GET', '/jobs/search?query=construction');
    console.log(`   Search Status: ${searchResponse.status}`);
    console.log(`   Found ${searchResponse.data.data ? searchResponse.data.data.length : 0} construction jobs`);
    
  } catch (error) {
    console.error('Error testing jobs endpoints:', error.message);
  }
}

async function runAllTests() {
  console.log('\n🎯 Kaabil Sewak - API Testing Tool');
  console.log('='.repeat(50));
  console.log('Testing backend endpoints...\n');
  
  await testLocationEndpoints();
  await testBackgroundCheckEndpoints();
  await testAnalyticsEndpoints();
  await testJobsEndpoints();
  
  console.log('\n✅ API testing completed!');
  console.log('\nTo view specific endpoints:');
  console.log('  node scripts/test-api.js locations');
  console.log('  node scripts/test-api.js checks');
  console.log('  node scripts/test-api.js analytics');
  console.log('  node scripts/test-api.js jobs');
}

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'locations':
    testLocationEndpoints();
    break;
  case 'checks':
    testBackgroundCheckEndpoints();
    break;
  case 'analytics':
    testAnalyticsEndpoints();
    break;
  case 'jobs':
    testJobsEndpoints();
    break;
  default:
    runAllTests();
    break;
} 