/**
 * Test WhatsApp Automation
 * 
 * This script helps you:
 * 1. List all contacts on your device
 * 2. Test sending a WhatsApp message
 * 3. Find the correct send button coordinates
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runAdb(command) {
  try {
    console.log(`> adb ${command}`);
    const { stdout } = await execAsync(`adb ${command}`);
    return stdout.trim();
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

async function listContacts() {
  console.log('\n📱 Fetching contacts from device...\n');
  const output = await runAdb(
    'shell content query --uri content://contacts/phones --projection display_name:number'
  );
  
  if (!output) {
    console.log('❌ Could not fetch contacts');
    return [];
  }
  
  const contacts = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    if (line.includes('display_name=') && line.includes('number=')) {
      const nameMatch = line.match(/display_name=([^,]+)/);
      const numberMatch = line.match(/number=([^,\s]+)/);
      
      if (nameMatch && numberMatch) {
        const name = nameMatch[1].trim();
        const number = numberMatch[1].trim();
        if (name && number) {
          contacts.push({ name, number });
        }
      }
    }
  }
  
  console.log(`Found ${contacts.length} contacts:\n`);
  contacts.slice(0, 10).forEach((c, i) => {
    console.log(`${i + 1}. ${c.name} - ${c.number}`);
  });
  
  if (contacts.length > 10) {
    console.log(`... and ${contacts.length - 10} more`);
  }
  
  return contacts;
}

async function getScreenSize() {
  console.log('\n📐 Getting screen dimensions...\n');
  const output = await runAdb('shell wm size');
  const match = output.match(/(\d+)x(\d+)/);
  
  if (match) {
    const width = parseInt(match[1]);
    const height = parseInt(match[2]);
    console.log(`Screen size: ${width}x${height}`);
    
    // Calculate send button position
    const sendX = Math.floor(width * 0.9);
    const sendY = Math.floor(height * 0.95);
    console.log(`Recommended send button: (${sendX}, ${sendY})`);
    
    return { width, height, sendX, sendY };
  }
  
  console.log('❌ Could not detect screen size');
  return null;
}

async function testWhatsApp(contactName, message) {
  console.log(`\n💬 Testing WhatsApp message to "${contactName}"...\n`);
  
  // Get contacts
  const contacts = await listContacts();
  const contact = contacts.find(c => 
    c.name.toLowerCase().includes(contactName.toLowerCase())
  );
  
  if (!contact) {
    console.log(`❌ Contact "${contactName}" not found`);
    console.log('\nAvailable contacts:');
    contacts.slice(0, 5).forEach(c => console.log(`  - ${c.name}`));
    return;
  }
  
  console.log(`✓ Found: ${contact.name} - ${contact.number}\n`);
  
  // Get screen size
  const screen = await getScreenSize();
  
  // Open WhatsApp
  const phoneNumber = contact.number.replace(/[^\d+]/g, '');
  console.log(`\n📱 Opening WhatsApp...`);
  await runAdb(
    `shell am start -a android.intent.action.SENDTO -d "whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}"`
  );
  
  console.log('⏳ Waiting 3 seconds for WhatsApp to load...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Try to find send button dynamically
  console.log('\n🔍 Finding send button...');
  await runAdb('shell uiautomator dump');
  const uiXml = await runAdb('shell cat /sdcard/window_dump.xml');
  
  const sendMatch = uiXml.match(/resource-id="com\.whatsapp:id\/send"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
  
  if (sendMatch) {
    const x1 = parseInt(sendMatch[1]);
    const y1 = parseInt(sendMatch[2]);
    const x2 = parseInt(sendMatch[3]);
    const y2 = parseInt(sendMatch[4]);
    const sendX = Math.floor((x1 + x2) / 2);
    const sendY = Math.floor((y1 + y2) / 2);
    console.log(`✓ Found send button at (${sendX}, ${sendY})`);
    await runAdb(`shell input tap ${sendX} ${sendY}`);
  } else {
    console.log('Using fallback coordinates (671, 802)');
    await runAdb('shell input tap 671 802');
  }
  
  console.log('\n✅ Done! Check your WhatsApp to see if the message was sent.');
  console.log('\nIf the message was NOT sent:');
  console.log('1. Take a screenshot when WhatsApp is open with the message');
  console.log('2. Note the X,Y coordinates of the send button');
  console.log('3. Update the coordinates in server.js');
}

async function findSendButton() {
  console.log('\n🔍 Finding send button coordinates...\n');
  console.log('Instructions:');
  console.log('1. Open WhatsApp manually');
  console.log('2. Open any chat');
  console.log('3. Type a test message (don\'t send)');
  console.log('4. Run: adb shell uiautomator dump');
  console.log('5. Run: adb shell cat /sdcard/window_dump.xml | grep -i "send"');
  console.log('\nOr use the UI dump endpoint: http://localhost:3000/ui-dump');
}

// Main
const args = process.argv.slice(2);
const command = args[0];

if (command === 'contacts') {
  listContacts();
} else if (command === 'screen') {
  getScreenSize();
} else if (command === 'test' && args[1] && args[2]) {
  const contactName = args[1];
  const message = args.slice(2).join(' ');
  testWhatsApp(contactName, message);
} else if (command === 'find-button') {
  findSendButton();
} else {
  console.log(`
🤖 WhatsApp Automation Tester

Usage:
  node test-whatsapp.js contacts              - List all contacts
  node test-whatsapp.js screen                - Show screen size and send button coords
  node test-whatsapp.js test <name> <message> - Test sending a message
  node test-whatsapp.js find-button           - Help find send button coordinates

Examples:
  node test-whatsapp.js contacts
  node test-whatsapp.js test "John" "Hello from automation!"
  node test-whatsapp.js screen
`);
}
