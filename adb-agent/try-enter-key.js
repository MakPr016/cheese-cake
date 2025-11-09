/**
 * Try using Enter key to send WhatsApp message
 * Sometimes this works better than tapping coordinates
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

async function testEnterKey() {
  console.log('\n📱 Testing WhatsApp with Enter Key\n');
  
  // Open WhatsApp
  console.log('1. Opening WhatsApp...');
  await runAdb('shell am start -n com.whatsapp/.Main');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Search for contact
  console.log('\n2. Opening search...');
  await runAdb('shell input keyevent 84'); // Search key
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Type contact name
  console.log('\n3. Typing contact name...');
  await runAdb('shell input text "Jutin"');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Press Enter to select first result
  console.log('\n4. Selecting contact...');
  await runAdb('shell input keyevent 66'); // Enter
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Type message
  console.log('\n5. Typing message...');
  await runAdb('shell input text "Test%susing%sEnter%skey"');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Press Enter to send
  console.log('\n6. Pressing Enter to send...');
  await runAdb('shell input keyevent 66'); // Enter
  
  console.log('\n✅ Done! Check if the message was sent.\n');
}

testEnterKey();
