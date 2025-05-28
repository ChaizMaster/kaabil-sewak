const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, '..', 'kaabil-sewak.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

function viewAllTables() {
  console.log('\n📋 Available Tables:');
  console.log('='.repeat(50));
  
  db.all(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `, (err, tables) => {
    if (err) {
      console.error('Error fetching tables:', err.message);
      return;
    }
    
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.name}`);
    });
    
    console.log('\n');
    viewUserLocations();
  });
}

function viewUserLocations() {
  console.log('📍 User Locations:');
  console.log('='.repeat(50));
  
  db.all(`
    SELECT 
      id, 
      userId, 
      address, 
      city, 
      state, 
      pincode,
      latitude,
      longitude,
      isVerified,
      source,
      createdAt
    FROM user_locations 
    ORDER BY createdAt DESC 
    LIMIT 10
  `, (err, locations) => {
    if (err) {
      console.error('Error fetching locations:', err.message);
      return;
    }
    
    if (locations.length === 0) {
      console.log('No location data found.');
    } else {
      locations.forEach((loc, index) => {
        console.log(`\n${index + 1}. User: ${loc.userId}`);
        console.log(`   Address: ${loc.address}`);
        console.log(`   City: ${loc.city}, State: ${loc.state}`);
        console.log(`   Coordinates: ${loc.latitude}, ${loc.longitude}`);
        console.log(`   Verified: ${loc.isVerified ? '✅' : '❌'}`);
        console.log(`   Source: ${loc.source}`);
        console.log(`   Created: ${new Date(loc.createdAt).toLocaleString()}`);
      });
    }
    
    console.log('\n');
    viewBackgroundChecks();
  });
}

function viewBackgroundChecks() {
  console.log('🔍 Background Checks:');
  console.log('='.repeat(50));
  
  db.all(`
    SELECT 
      id,
      userId,
      checkType,
      status,
      riskLevel,
      notes,
      createdAt,
      completedAt
    FROM background_checks 
    ORDER BY createdAt DESC 
    LIMIT 10
  `, (err, checks) => {
    if (err) {
      console.error('Error fetching background checks:', err.message);
      return;
    }
    
    if (checks.length === 0) {
      console.log('No background check data found.');
    } else {
      checks.forEach((check, index) => {
        console.log(`\n${index + 1}. User: ${check.userId}`);
        console.log(`   Type: ${check.checkType}`);
        console.log(`   Status: ${check.status}`);
        console.log(`   Risk Level: ${check.riskLevel || 'Not assessed'}`);
        console.log(`   Notes: ${check.notes || 'None'}`);
        console.log(`   Created: ${new Date(check.createdAt).toLocaleString()}`);
        console.log(`   Completed: ${check.completedAt ? new Date(check.completedAt).toLocaleString() : 'Pending'}`);
      });
    }
    
    console.log('\n');
    viewStatistics();
  });
}

function viewStatistics() {
  console.log('📊 Database Statistics:');
  console.log('='.repeat(50));
  
  // Get location statistics
  db.get(`SELECT COUNT(*) as total FROM user_locations`, (err, locCount) => {
    if (err) {
      console.error('Error getting location count:', err.message);
      return;
    }
    
    db.get(`SELECT COUNT(*) as verified FROM user_locations WHERE isVerified = 1`, (err, verifiedCount) => {
      if (err) {
        console.error('Error getting verified count:', err.message);
        return;
      }
      
      db.get(`SELECT COUNT(*) as total FROM background_checks`, (err, checkCount) => {
        if (err) {
          console.error('Error getting check count:', err.message);
          return;
        }
        
        db.get(`SELECT COUNT(*) as completed FROM background_checks WHERE status = 'completed'`, (err, completedCount) => {
          if (err) {
            console.error('Error getting completed count:', err.message);
            return;
          }
          
          console.log(`\n📍 Locations: ${locCount.total} total, ${verifiedCount.verified} verified`);
          console.log(`🔍 Background Checks: ${checkCount.total} total, ${completedCount.completed} completed`);
          
          if (locCount.total > 0) {
            const verificationRate = ((verifiedCount.verified / locCount.total) * 100).toFixed(1);
            console.log(`✅ Verification Rate: ${verificationRate}%`);
          }
          
          if (checkCount.total > 0) {
            const completionRate = ((completedCount.completed / checkCount.total) * 100).toFixed(1);
            console.log(`⚡ Check Completion Rate: ${completionRate}%`);
          }
          
          console.log('\n');
          db.close();
        });
      });
    });
  });
}

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'tables':
    viewAllTables();
    break;
  case 'locations':
    viewUserLocations();
    db.close();
    break;
  case 'checks':
    viewBackgroundChecks();
    db.close();
    break;
  case 'stats':
    viewStatistics();
    break;
  default:
    console.log('\n🎯 Kaabil Sewak - Database Viewer');
    console.log('='.repeat(50));
    viewAllTables();
    break;
} 