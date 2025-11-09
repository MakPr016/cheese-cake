// Use global fetch (available in Node 18+) or fallback
const fetch = globalThis.fetch || require('node-fetch');

const BASE_URL = 'http://localhost:3000';
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let testsPassed = 0;
let testsFailed = 0;

function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function logTest(name) {
  console.log(`\n${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
  log(`📋 TEST: ${name}`, COLORS.blue);
  console.log(`${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, COLORS.green);
  testsPassed++;
}

function logError(message) {
  log(`❌ ${message}`, COLORS.red);
  testsFailed++;
}

function logWarning(message) {
  log(`⚠️  ${message}`, COLORS.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, COLORS.cyan);
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testConnection() {
  logTest('Connection Test');
  
  try {
    const response = await fetch(`${BASE_URL}/status`);
    const data = await response.json();
    
    if (data.connected) {
      logSuccess('ADB agent is running');
      logSuccess('Device is connected');
      logInfo(`Status: ${data.message}`);
      return true;
    } else {
      logError('Device not connected');
      logWarning(data.message);
      return false;
    }
  } catch (error) {
    logError('Cannot reach ADB agent');
    logError(`Error: ${error.message}`);
    logWarning('Make sure the ADB agent is running: npm start');
    return false;
  }
}

async function testGetContacts() {
  logTest('Get All Contacts');
  
  try {
    const response = await fetch(`${BASE_URL}/contacts`);
    const data = await response.json();
    
    if (data.success && data.contacts) {
      logSuccess(`Found ${data.contacts.length} contacts`);
      
      if (data.contacts.length > 0) {
        logInfo('Sample contacts:');
        data.contacts.slice(0, 5).forEach(contact => {
          console.log(`  - ${contact.name}: ${contact.number}`);
        });
      } else {
        logWarning('No contacts found on device');
      }
      
      return data.contacts;
    } else {
      logError('Failed to get contacts');
      return [];
    }
  } catch (error) {
    logError(`Error: ${error.message}`);
    return [];
  }
}

async function testSearchContact(query) {
  logTest(`Search Contact: "${query}"`);
  
  try {
    const response = await fetch(`${BASE_URL}/contacts/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    
    const data = await response.json();
    
    if (data.success && data.contact) {
      logSuccess(`Contact found: ${data.contact.name}`);
      logInfo(`Phone: ${data.contact.number}`);
      
      if (data.allMatches && data.allMatches.length > 1) {
        logInfo(`Found ${data.allMatches.length} matches total`);
      }
      
      return data.contact;
    } else {
      logError(`Contact not found: ${query}`);
      
      if (data.suggestions && data.suggestions.length > 0) {
        logInfo('Suggestions:');
        data.suggestions.forEach(name => console.log(`  - ${name}`));
      }
      
      return null;
    }
  } catch (error) {
    logError(`Error: ${error.message}`);
    return null;
  }
}

async function testOpenUrl(url, browser = 'default') {
  logTest(`Open URL: ${url} in ${browser}`);
  
  try {
    const response = await fetch(`${BASE_URL}/open-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, browser }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      logSuccess(`Opened ${url} in ${browser}`);
      logInfo('Check your device to verify');
      return true;
    } else {
      logError(`Failed to open URL`);
      logError(`Error: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testWhatsApp(contact, message) {
  logTest(`WhatsApp: Send message to ${contact}`);
  
  try {
    logInfo(`Message: "${message}"`);
    
    const response = await fetch(`${BASE_URL}/whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, message }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      logSuccess('WhatsApp opened with message');
      
      if (data.resolvedNumber) {
        logInfo(`Resolved to: ${data.resolvedNumber}`);
      }
      
      logWarning('Please check device and manually send if needed');
      return true;
    } else {
      logError('Failed to open WhatsApp');
      logError(`Error: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testCall(contact) {
  logTest(`Phone Call: Call ${contact}`);
  
  try {
    const response = await fetch(`${BASE_URL}/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      logSuccess('Call initiated');
      
      if (data.resolvedNumber) {
        logInfo(`Calling: ${data.resolvedNumber}`);
      }
      
      logWarning('Please cancel the call on your device');
      return true;
    } else {
      logError('Failed to initiate call');
      logError(`Error: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function testExecutePlan(steps, description) {
  logTest(`Execute Plan: ${description}`);
  
  try {
    logInfo('Steps:');
    steps.forEach((step, i) => {
      console.log(`  ${i + 1}. ${step.action}: ${step.reasoning}`);
    });
    
    const response = await fetch(`${BASE_URL}/execute-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ steps }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      logSuccess('Plan executed');
      
      logInfo('Results:');
      data.results.forEach((result, i) => {
        const status = result.success ? '✅' : '❌';
        console.log(`  ${status} Step ${i + 1}: ${result.step}`);
        if (result.error) {
          console.log(`     Error: ${result.error}`);
        }
      });
      
      const successCount = data.results.filter(r => r.success).length;
      const totalCount = data.results.length;
      
      if (successCount === totalCount) {
        logSuccess(`All ${totalCount} steps completed`);
      } else {
        logWarning(`${successCount}/${totalCount} steps completed`);
      }
      
      return true;
    } else {
      logError('Plan execution failed');
      return false;
    }
  } catch (error) {
    logError(`Error: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.clear();
  log('\n╔════════════════════════════════════════════╗', COLORS.cyan);
  log('║   ADB AUTOMATION - TEST SUITE             ║', COLORS.cyan);
  log('╚════════════════════════════════════════════╝\n', COLORS.cyan);
  
  const startTime = Date.now();
  
  // Test 1: Connection
  const connected = await testConnection();
  if (!connected) {
    log('\n❌ Cannot proceed without device connection', COLORS.red);
    process.exit(1);
  }
  
  await wait(1000);
  
  // Test 2: Get all contacts
  const contacts = await testGetContacts();
  await wait(1000);
  
  // Test 3: Search for a contact (use first contact or "Jutin")
  let testContactName = 'Jutin';
  if (contacts.length > 0) {
    testContactName = contacts[0].name.split(' ')[0]; // Use first name of first contact
    logInfo(`Using contact "${testContactName}" for tests`);
  } else {
    logWarning('No contacts found, using "Jutin" for tests (may fail)');
  }
  
  await testSearchContact(testContactName);
  await wait(1000);
  
  // Test 4: Open Instagram in Opera
  logInfo('Test will open Opera browser...');
  await wait(2000);
  await testOpenUrl('https://instagram.com', 'opera');
  await wait(3000);
  
  // Test 5: WhatsApp message
  logInfo('Test will open WhatsApp...');
  await wait(2000);
  await testWhatsApp(testContactName, 'This is a test message from ADB automation. Please ignore.');
  await wait(3000);
  
  // Test 6: Phone call (will be cancelled)
  logInfo('Test will initiate a call (please cancel it)...');
  await wait(2000);
  await testCall(testContactName);
  await wait(3000);
  
  // Test 7: Complete workflow
  const workflowSteps = [
    {
      action: 'open_url',
      target: 'https://instagram.com',
      browser: 'opera',
      reasoning: 'Open Instagram in Opera'
    },
    {
      action: 'wait',
      target: '2000',
      reasoning: 'Wait for page to load'
    },
    {
      action: 'whatsapp',
      target: testContactName,
      text: 'Are you coming to the party tomorrow?',
      reasoning: `Message ${testContactName} on WhatsApp`
    },
    {
      action: 'wait',
      target: '2000',
      reasoning: 'Wait for message'
    }
  ];
  
  logInfo('Test will execute complete workflow...');
  await wait(2000);
  await testExecutePlan(workflowSteps, 'Instagram + WhatsApp workflow');
  
  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log('\n' + '═'.repeat(50));
  log('\n📊 TEST SUMMARY', COLORS.cyan);
  console.log('═'.repeat(50));
  log(`✅ Passed: ${testsPassed}`, COLORS.green);
  log(`❌ Failed: ${testsFailed}`, COLORS.red);
  log(`⏱️  Duration: ${duration}s`, COLORS.cyan);
  console.log('═'.repeat(50) + '\n');
  
  if (testsFailed === 0) {
    log('🎉 All tests passed!', COLORS.green);
  } else {
    log('⚠️  Some tests failed. Check the output above.', COLORS.yellow);
  }
  
  log('\n✨ Test suite completed\n', COLORS.cyan);
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
