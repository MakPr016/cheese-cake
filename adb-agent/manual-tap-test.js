/**
 * Manual Tap Test - Find the exact send button position
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

async function testTapPositions() {
  console.log('\n🎯 Manual Tap Position Tester\n');
  console.log('This will open WhatsApp and try different tap positions.\n');
  
  // Open WhatsApp with test message
  console.log('1. Opening WhatsApp...');
  await runAdb('shell am start -a android.intent.action.SENDTO -d "whatsapp://send?phone=919380892511&text=TAP_TEST"');
  
  console.log('2. Waiting 4 seconds for WhatsApp to load...\n');
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  // Get screen size
  const screen = await runAdb('shell wm size');
  const match = screen.match(/(\d+)x(\d+)/);
  const width = parseInt(match[1]);
  const height = parseInt(match[2]);
  
  console.log(`Screen: ${width}x${height}\n`);
  
  // Test positions - trying various locations where send button might be
  const testPositions = [
    { x: 671, y: 802, desc: 'From UI dump (middle-right)' },
    { x: 648, y: 1520, desc: 'Bottom-right calculated' },
    { x: width - 50, y: height - 80, desc: 'Bottom-right with padding' },
    { x: width - 70, y: height - 100, desc: 'Bottom-right more padding' },
    { x: 650, y: 1500, desc: 'Near bottom-right' },
    { x: 680, y: 1480, desc: 'Alternative bottom-right' },
  ];
  
  console.log('📍 Positions to test:\n');
  testPositions.forEach((pos, i) => {
    console.log(`${i + 1}. (${pos.x}, ${pos.y}) - ${pos.desc}`);
  });
  
  console.log('\n⚠️  INSTRUCTIONS:');
  console.log('1. WhatsApp should be open with the message "TAP_TEST"');
  console.log('2. I will tap each position one by one');
  console.log('3. Watch your screen to see which tap hits the send button');
  console.log('4. Press Ctrl+C to stop if you find the right one\n');
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  for (let i = 0; i < testPositions.length; i++) {
    const pos = testPositions[i];
    console.log(`\n🎯 Testing position ${i + 1}: (${pos.x}, ${pos.y}) - ${pos.desc}`);
    console.log('   Tapping in 2 seconds...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await runAdb(`shell input tap ${pos.x} ${pos.y}`);
    console.log('   ✓ Tapped!');
    
    // Wait to see result
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if message was sent by looking at screen
    console.log('   Did the message send? (Check WhatsApp)');
    
    if (i < testPositions.length - 1) {
      console.log('   Reopening WhatsApp for next test...');
      await runAdb('shell input keyevent 4'); // Back button
      await new Promise(resolve => setTimeout(resolve, 1000));
      await runAdb('shell am start -a android.intent.action.SENDTO -d "whatsapp://send?phone=919380892511&text=TAP_TEST"');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n✅ Test complete!');
  console.log('Which position worked? Update server.js with those coordinates.');
}

testTapPositions();
