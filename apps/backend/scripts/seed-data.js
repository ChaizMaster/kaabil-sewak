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

const sampleUsers = [
  {
    userId: 'user-001',
    address: 'Sector 15, Phase 2, Near Metro Station',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122001',
    coordinates: { latitude: 28.4595, longitude: 77.0266 },
    source: 'gps'
  },
  {
    userId: 'user-002', 
    address: 'Connaught Place, Central Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    coordinates: { latitude: 28.6315, longitude: 77.2167 },
    source: 'gps'
  },
  {
    userId: 'user-003',
    address: 'Andheri East, Near Railway Station', 
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    coordinates: { latitude: 19.1136, longitude: 72.8697 },
    source: 'manual'
  },
  {
    userId: 'user-004',
    address: 'Koramangala, 5th Block',
    city: 'Bangalore',
    state: 'Karnataka', 
    pincode: '560095',
    coordinates: { latitude: 12.9352, longitude: 77.6245 },
    source: 'gps'
  },
  {
    userId: 'user-005',
    address: 'Salt Lake, Sector V',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700091',
    coordinates: { latitude: 22.5726, longitude: 88.3639 },
    source: 'manual'
  }
];

async function seedSampleData() {
  console.log('\n🌱 Seeding Sample Data');
  console.log('='.repeat(50));
  
  try {
    for (let i = 0; i < sampleUsers.length; i++) {
      const user = sampleUsers[i];
      console.log(`\n${i + 1}. Creating location for ${user.userId} in ${user.city}...`);
      
      const response = await makeRequest('POST', '/location', user);
      
      if (response.status === 201) {
        console.log(`   ✅ Location created successfully`);
        
        // Add a small delay to make background checks more realistic
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initiate background checks for some users
        if (i % 2 === 0) { // Every other user gets identity verification too
          console.log(`   🔍 Initiating identity verification...`);
          const identityResponse = await makeRequest('POST', `/location/background-check/identity/${user.userId}`);
          if (identityResponse.status === 201) {
            console.log(`   ✅ Identity verification initiated`);
          }
        }
        
      } else {
        console.log(`   ❌ Failed to create location: ${response.status}`);
        console.log(`   Response:`, response.data);
      }
      
      // Add delay between users
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n✅ Sample data seeding completed!');
    console.log('\nYou can now view the data using:');
    console.log('  npm run db:view');
    console.log('  npm run api:test');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    console.log('\nMake sure the backend server is running:');
    console.log('  npm run start:dev');
  }
}

async function clearData() {
  console.log('\n🗑️ Clearing Sample Data');
  console.log('='.repeat(50));
  
  try {
    for (const user of sampleUsers) {
      console.log(`Deleting data for ${user.userId}...`);
      const response = await makeRequest('DELETE', `/location/user/${user.userId}`);
      if (response.status === 200) {
        console.log(`   ✅ Deleted successfully`);
      } else {
        console.log(`   ⚠️ User not found or already deleted`);
      }
    }
    
    console.log('\n✅ Data clearing completed!');
    
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'clear':
    clearData();
    break;
  default:
    seedSampleData();
    break;
} 