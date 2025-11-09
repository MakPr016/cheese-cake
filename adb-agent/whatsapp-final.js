/**
 * Final WhatsApp automation - using tap for send button
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
  
  // Step 6: Find and tap send button
  console.log('6. Finding send button...');
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
    console.log(`   Found send button at (${sendX}, ${sendY})`);
    await runAdb(`shell input tap ${sendX} ${sendY}`);
  } else {
    // Try common positions for 720x1600 screen
    console.log('   Trying common send button positions...');
    const positions = [
      { x: 671, y: 1520, desc: 'Bottom-right area' },
      { x: 670, y: 1480, desc: 'Slightly higher' },
      { x: 650, y: 1500, desc: 'Alternative position' },
      { x: width - 50, y: height - 120, desc: 'Calculated position' },
    ];
    
    for (const pos of positions) {
      console.log(`   Trying (${pos.x}, ${pos.y}) - ${pos.desc}`);
      await runAdb(`shell input tap ${pos.x} ${pos.y}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n✅ Done! Check WhatsApp to see if message was sent.\n');
}

// Test
const contactName = process.argv[2] || 'Jutin CSE';
const message = process.argv.slice(3).join(' ') || 'Test message';

sendWhatsAppMessage(contactName, message);
