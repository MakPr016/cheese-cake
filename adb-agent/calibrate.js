/**
 * UI Calibration Tool
 * 
 * This tool helps you find the exact coordinates for buttons on your device.
 * Run this to calibrate WhatsApp send button, Instagram buttons, etc.
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runAdb(command) {
  try {
    const { stdout, stderr } = await execAsync(`adb ${command}`);
    return { success: true, output: stdout, error: stderr };
  } catch (error) {
    return { success: false, output: '', error: error.message };
  }
}

async function getScreenSize() {
  const result = await runAdb('shell wm size');
  const match = result.output.match(/(\d+)x(\d+)/);
  if (match) {
    return { width: parseInt(match[1]), height: parseInt(match[2]) };
  }
  return null;
}

async function takeScreenshot() {
  console.log('📸 Taking screenshot...');
  await runAdb('shell screencap -p /sdcard/screenshot.png');
  await runAdb('pull /sdcard/screenshot.png ./screenshot.png');
  console.log('✅ Screenshot saved to: screenshot.png');
}

async function getUIHierarchy() {
  console.log('🔍 Getting UI hierarchy...');
  await runAdb('shell uiautomator dump /sdcard/ui.xml');
  const result = await runAdb('shell cat /sdcard/ui.xml');
  return result.output;
}

async function findSendButton() {
  console.log('\n🔍 Finding WhatsApp send button...\n');
  
  const xml = await getUIHierarchy();
  
  // Look for send button patterns
  const patterns = [
    /resource-id="[^"]*send[^"]*"/gi,
    /content-desc="[^"]*send[^"]*"/gi,
    /text="[^"]*send[^"]*"/gi,
  ];
  
  const matches = [];
  for (const pattern of patterns) {
    const found = xml.match(pattern);
    if (found) {
      matches.push(...found);
    }
  }
  
  if (matches.length > 0) {
    console.log('Found potential send buttons:');
    matches.forEach((match, i) => {
      console.log(`  ${i + 1}. ${match}`);
    });
  } else {
    console.log('❌ No send button found in UI hierarchy');
  }
  
  // Extract bounds
  const boundsPattern = /bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/g;
  let match;
  const elements = [];
  
  while ((match = boundsPattern.exec(xml)) !== null) {
    const x1 = parseInt(match[1]);
    const y1 = parseInt(match[2]);
    const x2 = parseInt(match[3]);
    const y2 = parseInt(match[4]);
    const centerX = Math.floor((x1 + x2) / 2);
    const centerY = Math.floor((y1 + y2) / 2);
    
    // Look for elements in bottom-right (likely send button)
    const size = await getScreenSize();
    if (size && centerX > size.width * 0.7 && centerY > size.height * 0.8) {
      elements.push({ x: centerX, y: centerY, bounds: match[0] });
    }
  }
  
  if (elements.length > 0) {
    console.log('\n📍 Potential send button coordinates:');
    elements.forEach((el, i) => {
      console.log(`  ${i + 1}. Tap at (${el.x}, ${el.y})`);
    });
  }
}

async function calibrateWhatsApp() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   WhatsApp Send Button Calibration    ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  console.log('📱 Instructions:');
  console.log('1. Open WhatsApp on your device');
  console.log('2. Open any chat');
  console.log('3. Type a test message (don\'t send yet)');
  console.log('4. Press Enter here when ready...\n');
  
  // Wait for user
  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });
  
  const size = await getScreenSize();
  if (size) {
    console.log(`\n📐 Screen size: ${size.width}x${size.height}`);
    
    // Calculate estimated positions
    const estimated = {
      x: Math.floor(size.width * 0.9),
      y: Math.floor(size.height * 0.95)
    };
    
    console.log(`\n💡 Estimated send button: (${estimated.x}, ${estimated.y})`);
  }
  
  await takeScreenshot();
  await findSendButton();
  
  console.log('\n✅ Calibration complete!');
  console.log('\n📝 To use these coordinates:');
  console.log('   Edit server.js and update the tap coordinates');
  console.log('   Or check screenshot.png to manually find the button\n');
}

async function testTap(x, y) {
  console.log(`\n👆 Testing tap at (${x}, ${y})...`);
  await runAdb(`shell input tap ${x} ${y}`);
  console.log('✅ Tap executed');
}

// Main
const command = process.argv[2];

if (command === 'whatsapp') {
  calibrateWhatsApp().then(() => process.exit(0));
} else if (command === 'screenshot') {
  takeScreenshot().then(() => process.exit(0));
} else if (command === 'tap' && process.argv[3] && process.argv[4]) {
  const x = parseInt(process.argv[3]);
  const y = parseInt(process.argv[4]);
  testTap(x, y).then(() => process.exit(0));
} else {
  console.log('\n📱 ADB Calibration Tool\n');
  console.log('Usage:');
  console.log('  node calibrate.js whatsapp    - Calibrate WhatsApp send button');
  console.log('  node calibrate.js screenshot  - Take a screenshot');
  console.log('  node calibrate.js tap X Y     - Test tap at coordinates\n');
  console.log('Examples:');
  console.log('  node calibrate.js whatsapp');
  console.log('  node calibrate.js screenshot');
  console.log('  node calibrate.js tap 950 1850\n');
  process.exit(0);
}
