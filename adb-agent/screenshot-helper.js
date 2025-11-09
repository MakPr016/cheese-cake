/**
 * Screenshot Helper - Visual debugging
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runAdb(command) {
  try {
    const { stdout } = await execAsync(`adb ${command}`);
    return stdout.trim();
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

async function captureWhatsAppScreen() {
  console.log('\n📸 WhatsApp Screenshot Helper\n');
  
  console.log('INSTRUCTIONS:');
  console.log('1. Manually open WhatsApp on your phone');
  console.log('2. Open a chat with Jutin CSE');
  console.log('3. Type a message (but DON\'T send it)');
  console.log('4. Make sure the send button is visible\n');
  console.log('Press Enter when ready...');
  
  // Wait for user
  await new Promise(resolve => {
    process.stdin.once('data', () => resolve());
  });
  
  console.log('\n📸 Taking screenshot in 2 seconds...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await runAdb('shell screencap -p /sdcard/whatsapp_debug.png');
  await runAdb('pull /sdcard/whatsapp_debug.png ./whatsapp_debug.png');
  
  console.log('✓ Screenshot saved: whatsapp_debug.png\n');
  
  // Get UI dump
  console.log('📋 Getting UI hierarchy...');
  await runAdb('shell uiautomator dump');
  const uiXml = await runAdb('shell cat /sdcard/window_dump.xml');
  
  // Save UI dump to file
  const fs = require('fs');
  fs.writeFileSync('./ui_dump.xml', uiXml);
  console.log('✓ UI dump saved: ui_dump.xml\n');
  
  // Search for send button
  console.log('🔍 Searching for send button in UI...\n');
  
  const sendMatch = uiXml.match(/resource-id="com\.whatsapp:id\/send"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
  
  if (sendMatch) {
    const x1 = parseInt(sendMatch[1]);
    const y1 = parseInt(sendMatch[2]);
    const x2 = parseInt(sendMatch[3]);
    const y2 = parseInt(sendMatch[4]);
    const centerX = Math.floor((x1 + x2) / 2);
    const centerY = Math.floor((y1 + y2) / 2);
    
    console.log('✓ Found send button!');
    console.log(`  Bounds: [${x1}, ${y1}] to [${x2}, ${y2}]`);
    console.log(`  Center: (${centerX}, ${centerY})`);
    console.log(`\n📍 USE THESE COORDINATES: (${centerX}, ${centerY})\n`);
  } else {
    console.log('❌ Send button not found in UI dump');
    console.log('\nTry this:');
    console.log('1. Open whatsapp_debug.png');
    console.log('2. Use an image editor to find the X,Y coordinates of the send button');
    console.log('3. The send button is usually a circular icon on the right side\n');
  }
  
  console.log('Next step: Test the coordinates manually:');
  console.log('  adb shell input tap X Y\n');
}

captureWhatsAppScreen();
