/**
 * Improved WhatsApp automation using search + tap
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

async function sendWhatsAppMessage(contactName, message) {
  console.log(`\n📱 Sending WhatsApp message to "${contactName}"\n`);
  
  // Get screen dimensions
  const screen = await runAdb('shell wm size');
  const match = screen.match(/(\d+)x(\d+)/);
  const width = parseInt(match[1]);
  const height = parseInt(match[2]);
  console.log(`Screen: ${width}x${height}\n`);
  
  // Step 1: Open WhatsApp
  console.log('1. Opening WhatsApp...');
  await runAdb('shell am start -n com.whatsapp/.Main');
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Step 2: Open search
  console.log('2. Opening search...');
  await runAdb('shell input keyevent 84'); // Search key
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 3: Type contact name
  console.log(`3. Searching for "${contactName}"...`);
  const searchText = contactName.replace(/\s/g, '%s');
  await runAdb(`shell input text "${searchText}"`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Step 4: Tap on first search result
  // First result is typically around 1/4 down the screen, centered horizontally
  const resultY = Math.floor(height * 0.25); // 25% from top
  const resultX = Math.floor(width * 0.5);   // Center
  console.log(`4. Tapping first result at (${resultX}, ${resultY})...`);
  await runAdb(`shell input tap ${resultX} ${resultY}`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Step 5: Type message
  console.log(`5. Typing message: "${message}"...`);
  const messageText = message.replace(/\s/g, '%s');
  await runAdb(`shell input text "${messageText}"`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 6: Try multiple methods to send
  console.log('6. Attempting to send...');
  
  // Method 1: Try Enter key
  console.log('   Method 1: Enter key...');
  await runAdb('shell input keyevent 66');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Method 2: Tap send button (right side, middle-ish)
  const sendX = width - 50;  // 50px from right edge
  const sendY = height - 120; // 120px from bottom
  console.log(`   Method 2: Tap at (${sendX}, ${sendY})...`);
  await runAdb(`shell input tap ${sendX} ${sendY}`);
  
  console.log('\n✅ Done! Check WhatsApp to see if message was sent.\n');
}

// Test
const contactName = process.argv[2] || 'Jutin CSE';
const message = process.argv.slice(3).join(' ') || 'Test message';

sendWhatsAppMessage(contactName, message);
