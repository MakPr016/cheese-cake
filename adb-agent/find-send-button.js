/**
 * Find WhatsApp Send Button Coordinates
 * 
 * This script will:
 * 1. Open WhatsApp with a test message
 * 2. Take a screenshot
 * 3. Dump the UI hierarchy to find the send button
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

async function findSendButton() {
  console.log('\n🔍 Finding WhatsApp Send Button\n');
  
  // Step 1: Open WhatsApp with a test message (don't send)
  console.log('1. Opening WhatsApp with test message...');
  await runAdb('shell am start -a android.intent.action.SENDTO -d "whatsapp://send?phone=1234567890&text=TEST"');
  
  console.log('2. Waiting 4 seconds for WhatsApp to load...');
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  // Step 2: Take screenshot
  console.log('3. Taking screenshot...');
  await runAdb('shell screencap -p /sdcard/whatsapp_screen.png');
  await runAdb('pull /sdcard/whatsapp_screen.png ./whatsapp_screen.png');
  console.log('   Screenshot saved: whatsapp_screen.png');
  
  // Step 3: Get UI dump
  console.log('4. Dumping UI hierarchy...');
  await runAdb('shell uiautomator dump');
  const uiXml = await runAdb('shell cat /sdcard/window_dump.xml');
  
  // Step 4: Search for send button in XML
  console.log('\n5. Searching for send button...\n');
  
  const sendPatterns = [
    /resource-id="com\.whatsapp:id\/send"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/g,
    /content-desc="[Ss]end"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/g,
    /text="[Ss]end"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/g,
    /class="android\.widget\.ImageButton"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/g
  ];
  
  let found = false;
  
  for (const pattern of sendPatterns) {
    const matches = uiXml.matchAll(pattern);
    for (const match of matches) {
      const x1 = parseInt(match[1]);
      const y1 = parseInt(match[2]);
      const x2 = parseInt(match[3]);
      const y2 = parseInt(match[4]);
      const centerX = Math.floor((x1 + x2) / 2);
      const centerY = Math.floor((y1 + y2) / 2);
      
      console.log(`Found potential send button:`);
      console.log(`  Bounds: [${x1},${y1}][${x2},${y2}]`);
      console.log(`  Center: (${centerX}, ${centerY})`);
      console.log(`  Match: ${match[0].substring(0, 80)}...`);
      console.log('');
      found = true;
    }
  }
  
  if (!found) {
    console.log('❌ Could not find send button automatically.\n');
    console.log('Manual steps:');
    console.log('1. Open whatsapp_screen.png');
    console.log('2. Note the X,Y position of the send button (bottom-right)');
    console.log('3. Use those coordinates in the code\n');
  }
  
  // Step 5: Try common positions
  console.log('6. Common send button positions to try:\n');
  const screen = await runAdb('shell wm size');
  const match = screen.match(/(\d+)x(\d+)/);
  
  if (match) {
    const width = parseInt(match[1]);
    const height = parseInt(match[2]);
    
    console.log(`Screen: ${width}x${height}\n`);
    console.log('Try these coordinates (from most to least likely):\n');
    
    const positions = [
      { x: width - 72, y: height - 80, desc: 'Bottom-right with padding' },
      { x: width - 60, y: height - 60, desc: 'Bottom-right corner' },
      { x: width - 100, y: height - 100, desc: 'Bottom-right with more padding' },
      { x: Math.floor(width * 0.9), y: Math.floor(height * 0.95), desc: '90% right, 95% down' },
      { x: Math.floor(width * 0.92), y: Math.floor(height * 0.93), desc: '92% right, 93% down' },
    ];
    
    positions.forEach((pos, i) => {
      console.log(`${i + 1}. (${pos.x}, ${pos.y}) - ${pos.desc}`);
    });
    
    console.log('\n7. Test each position manually:');
    console.log('   - Open WhatsApp with a message');
    console.log('   - Run: adb shell input tap X Y');
    console.log('   - See if it sends the message\n');
  }
  
  // Go back to close WhatsApp
  console.log('8. Closing WhatsApp...');
  await runAdb('shell input keyevent 4'); // Back button
}

findSendButton();
