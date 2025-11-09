const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Helper to execute ADB commands
async function runAdb(command) {
  try {
    console.log(`Executing: adb ${command}`);
    const { stdout, stderr } = await execAsync(`adb ${command}`);
    if (stderr && !stderr.includes('WARNING')) {
      console.error('ADB stderr:', stderr);
    }
    return { success: true, output: stdout.trim(), error: null };
  } catch (error) {
    console.error('ADB error:', error.message);
    return { success: false, output: null, error: error.message };
  }
}

// Get all contacts from device
app.get('/contacts', async (req, res) => {
  try {
    // Query contacts database via content provider
    const result = await runAdb(
      'shell content query --uri content://contacts/phones --projection display_name:number'
    );
    
    if (!result.success) {
      return res.json({ success: false, contacts: [], error: result.error });
    }

    // Parse the output
    const contacts = [];
    const lines = result.output.split('\n');
    
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

    console.log(`Found ${contacts.length} contacts`);
    res.json({ success: true, contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.json({ success: false, contacts: [], error: error.message });
  }
});

// Search for a contact by name (fuzzy match)
app.post('/contacts/search', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.json({ success: false, contact: null, error: 'Query required' });
    }

    // Get all contacts
    const contactsResult = await runAdb(
      'shell content query --uri content://contacts/phones --projection display_name:number'
    );
    
    if (!contactsResult.success) {
      return res.json({ success: false, contact: null, error: contactsResult.error });
    }

    // Parse and search
    const contacts = [];
    const lines = contactsResult.output.split('\n');
    
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

    // Fuzzy search (case-insensitive, partial match)
    const queryLower = query.toLowerCase();
    const matches = contacts.filter(c => 
      c.name.toLowerCase().includes(queryLower)
    );

    if (matches.length === 0) {
      return res.json({ 
        success: false, 
        contact: null, 
        error: `No contact found matching "${query}"`,
        suggestions: contacts.slice(0, 5).map(c => c.name)
      });
    }

    // Return best match (first one)
    console.log(`Found contact: ${matches[0].name} - ${matches[0].number}`);
    res.json({ success: true, contact: matches[0], allMatches: matches });
  } catch (error) {
    console.error('Error searching contacts:', error);
    res.json({ success: false, contact: null, error: error.message });
  }
});

// Open an app by package name
app.post('/open-app', async (req, res) => {
  const { packageName } = req.body;
  
  if (!packageName) {
    return res.json({ success: false, error: 'Package name required' });
  }

  const result = await runAdb(`shell monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`);
  res.json(result);
});

// Open URL in browser
app.post('/open-url', async (req, res) => {
  const { url, browser } = req.body;
  
  if (!url) {
    return res.json({ success: false, error: 'URL required' });
  }

  let command;
  if (browser === 'opera') {
    command = `shell am start -n com.opera.browser/com.opera.Opera -d "${url}"`;
  } else {
    command = `shell am start -a android.intent.action.VIEW -d "${url}"`;
  }

  const result = await runAdb(command);
  res.json(result);
});

// Send WhatsApp message
app.post('/whatsapp', async (req, res) => {
  const { contact, message } = req.body;
  
  if (!contact || !message) {
    return res.json({ success: false, error: 'Contact and message required' });
  }

  console.log(`Sending WhatsApp message to "${contact}"`);
  
  // Get screen dimensions
  const screenResult = await runAdb('shell wm size');
  const screenMatch = screenResult.output.match(/(\d+)x(\d+)/);
  const screenWidth = screenMatch ? parseInt(screenMatch[1]) : 720;
  const screenHeight = screenMatch ? parseInt(screenMatch[2]) : 1600;
  
  // Step 1: Open WhatsApp
  console.log('Opening WhatsApp...');
  await runAdb('shell am start -n com.whatsapp/.Main');
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Step 2: Open search
  console.log('Opening search...');
  await runAdb('shell input keyevent 84'); // Search key
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 3: Type contact name
  console.log(`Searching for "${contact}"...`);
  const searchText = contact.replace(/\s/g, '%s');
  await runAdb(`shell input text "${searchText}"`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Step 4: Tap first search result
  const resultY = Math.floor(screenHeight * 0.25);
  const resultX = Math.floor(screenWidth * 0.5);
  console.log(`Tapping first result at (${resultX}, ${resultY})...`);
  await runAdb(`shell input tap ${resultX} ${resultY}`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Step 5: Type message
  console.log(`Typing message: "${message}"...`);
  const messageText = message.replace(/\s/g, '%s');
  await runAdb(`shell input text "${messageText}"`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 6: Find and tap send button
  console.log('Finding send button...');
  await runAdb('shell uiautomator dump');
  const uiDump = await runAdb('shell cat /sdcard/window_dump.xml');
  
  const sendButtonMatch = uiDump.output.match(/resource-id="com\.whatsapp:id\/send"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
  
  if (sendButtonMatch) {
    const x1 = parseInt(sendButtonMatch[1]);
    const y1 = parseInt(sendButtonMatch[2]);
    const x2 = parseInt(sendButtonMatch[3]);
    const y2 = parseInt(sendButtonMatch[4]);
    const sendX = Math.floor((x1 + x2) / 2);
    const sendY = Math.floor((y1 + y2) / 2);
    console.log(`Found send button at (${sendX}, ${sendY})`);
    await runAdb(`shell input tap ${sendX} ${sendY}`);
  } else {
    console.log('Using fallback coordinates (671, 802)');
    await runAdb('shell input tap 671 802');
  }

  res.json({ success: true, output: 'Message sent successfully', contact });
});

// Make a phone call
app.post('/call', async (req, res) => {
  const { contact } = req.body;
  
  if (!contact) {
    return res.json({ success: false, error: 'Contact required' });
  }

  // Search for contact first
  const searchResult = await runAdb(
    `shell content query --uri content://contacts/phones --projection display_name:number`
  );

  let phoneNumber = contact;
  
  // If contact is a name, try to resolve it
  if (!/^\+?\d+$/.test(contact)) {
    const lines = searchResult.output.split('\n');
    const queryLower = contact.toLowerCase();
    
    for (const line of lines) {
      if (line.includes('display_name=') && line.includes('number=')) {
        const nameMatch = line.match(/display_name=([^,]+)/);
        const numberMatch = line.match(/number=([^,\s]+)/);
        
        if (nameMatch && numberMatch) {
          const name = nameMatch[1].trim();
          if (name.toLowerCase().includes(queryLower)) {
            phoneNumber = numberMatch[1].trim();
            console.log(`Resolved "${contact}" to ${phoneNumber}`);
            break;
          }
        }
      }
    }
  }

  // Clean phone number
  phoneNumber = phoneNumber.replace(/[^\d+]/g, '');

  // Make the call
  const result = await runAdb(`shell am start -a android.intent.action.CALL -d tel:${phoneNumber}`);
  res.json({ ...result, resolvedNumber: phoneNumber });
});

// Send email
app.post('/email', async (req, res) => {
  const { to, subject, body } = req.body;
  
  if (!to) {
    return res.json({ success: false, error: 'Recipient required' });
  }

  const subjectParam = subject ? `--es android.intent.extra.SUBJECT "${subject}"` : '';
  const bodyParam = body ? `--es android.intent.extra.TEXT "${body}"` : '';
  
  const result = await runAdb(
    `shell am start -a android.intent.action.SENDTO -d "mailto:${to}" ${subjectParam} ${bodyParam}`
  );
  res.json(result);
});

// Tap at coordinates
app.post('/tap', async (req, res) => {
  const { x, y } = req.body;
  
  if (x === undefined || y === undefined) {
    return res.json({ success: false, error: 'Coordinates required' });
  }

  const result = await runAdb(`shell input tap ${x} ${y}`);
  res.json(result);
});

// Type text
app.post('/type', async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.json({ success: false, error: 'Text required' });
  }

  // Escape special characters for shell
  const escapedText = text.replace(/\s/g, '%s').replace(/'/g, "\\'");
  const result = await runAdb(`shell input text "${escapedText}"`);
  res.json(result);
});

// Swipe
app.post('/swipe', async (req, res) => {
  const { x1, y1, x2, y2, duration = 300 } = req.body;
  
  if (x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
    return res.json({ success: false, error: 'Coordinates required' });
  }

  const result = await runAdb(`shell input swipe ${x1} ${y1} ${x2} ${y2} ${duration}`);
  res.json(result);
});

// Press key
app.post('/key', async (req, res) => {
  const { keycode } = req.body;
  
  if (!keycode) {
    return res.json({ success: false, error: 'Keycode required' });
  }

  const result = await runAdb(`shell input keyevent ${keycode}`);
  res.json(result);
});

// Take screenshot
app.get('/screenshot', async (req, res) => {
  try {
    await runAdb('shell screencap -p /sdcard/screenshot.png');
    const result = await runAdb('pull /sdcard/screenshot.png ./screenshot.png');
    
    if (result.success) {
      res.sendFile(__dirname + '/screenshot.png');
    } else {
      res.json(result);
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Get UI hierarchy
app.get('/ui-dump', async (req, res) => {
  try {
    await runAdb('shell uiautomator dump');
    const result = await runAdb('shell cat /sdcard/window_dump.xml');
    res.json({ success: true, xml: result.output });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Check device connection
app.get('/status', async (req, res) => {
  const result = await runAdb('devices');
  const connected = result.output.includes('device') && !result.output.includes('offline');
  res.json({ 
    connected, 
    output: result.output,
    message: connected ? 'Device connected' : 'No device connected'
  });
});

// Execute automation plan
app.post('/execute-plan', async (req, res) => {
  const { steps } = req.body;
  
  if (!steps || !Array.isArray(steps)) {
    return res.json({ success: false, error: 'Steps array required' });
  }

  const results = [];

  for (const step of steps) {
    console.log(`\nExecuting step: ${step.action} - ${step.reasoning}`);
    let result;

    try {
      switch (step.action) {
        case 'open_app':
          result = await runAdb(`shell monkey -p ${step.target} -c android.intent.category.LAUNCHER 1`);
          break;

        case 'open_url':
          if (step.browser === 'opera') {
            result = await runAdb(`shell am start -n com.opera.browser/com.opera.Opera -d "${step.target}"`);
          } else {
            result = await runAdb(`shell am start -a android.intent.action.VIEW -d "${step.target}"`);
          }
          break;

        case 'whatsapp':
          console.log(`Sending WhatsApp message to "${step.target}"`);
          
          // Get screen dimensions
          const screenResult = await runAdb('shell wm size');
          const screenMatch = screenResult.output.match(/(\d+)x(\d+)/);
          const screenWidth = screenMatch ? parseInt(screenMatch[1]) : 720;
          const screenHeight = screenMatch ? parseInt(screenMatch[2]) : 1600;
          
          // Step 1: Open WhatsApp
          console.log('Opening WhatsApp...');
          await runAdb('shell am start -n com.whatsapp/.Main');
          await new Promise(resolve => setTimeout(resolve, 2500));
          
          // Step 2: Open search
          console.log('Opening search...');
          await runAdb('shell input keyevent 84'); // Search key
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Step 3: Type contact name
          console.log(`Searching for "${step.target}"...`);
          const searchText = step.target.replace(/\s/g, '%s');
          await runAdb(`shell input text "${searchText}"`);
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Step 4: Tap first search result
          const resultY = Math.floor(screenHeight * 0.25);
          const resultX = Math.floor(screenWidth * 0.5);
          console.log(`Tapping first result at (${resultX}, ${resultY})...`);
          await runAdb(`shell input tap ${resultX} ${resultY}`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Step 5: Type message
          console.log(`Typing message: "${step.text}"...`);
          const messageText = (step.text || '').replace(/\s/g, '%s');
          await runAdb(`shell input text "${messageText}"`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Step 6: Find and tap send button
          console.log('Finding send button...');
          await runAdb('shell uiautomator dump');
          const uiDump = await runAdb('shell cat /sdcard/window_dump.xml');
          
          const sendButtonMatch = uiDump.output.match(/resource-id="com\.whatsapp:id\/send"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
          
          if (sendButtonMatch) {
            const x1 = parseInt(sendButtonMatch[1]);
            const y1 = parseInt(sendButtonMatch[2]);
            const x2 = parseInt(sendButtonMatch[3]);
            const y2 = parseInt(sendButtonMatch[4]);
            const sendX = Math.floor((x1 + x2) / 2);
            const sendY = Math.floor((y1 + y2) / 2);
            console.log(`Found send button at (${sendX}, ${sendY})`);
            await runAdb(`shell input tap ${sendX} ${sendY}`);
            result = { success: true, output: 'Message sent successfully' };
          } else {
            console.log('Using fallback coordinates (671, 802)');
            await runAdb('shell input tap 671 802');
            result = { success: true, output: 'Message sent (fallback method)' };
          }
          break;

        case 'call':
          // Resolve contact
          let callNumber = step.target;
          if (!/^\+?\d+$/.test(step.target)) {
            const searchResult = await runAdb(
              'shell content query --uri content://contacts/phones --projection display_name:number'
            );
            const lines = searchResult.output.split('\n');
            const queryLower = step.target.toLowerCase();
            
            for (const line of lines) {
              if (line.includes('display_name=') && line.includes('number=')) {
                const nameMatch = line.match(/display_name=([^,]+)/);
                const numberMatch = line.match(/number=([^,\s]+)/);
                
                if (nameMatch && numberMatch) {
                  const name = nameMatch[1].trim();
                  if (name.toLowerCase().includes(queryLower)) {
                    callNumber = numberMatch[1].trim();
                    console.log(`Resolved "${step.target}" to ${callNumber}`);
                    break;
                  }
                }
              }
            }
          }
          
          callNumber = callNumber.replace(/[^\d+]/g, '');
          result = await runAdb(`shell am start -a android.intent.action.CALL -d tel:${callNumber}`);
          break;

        case 'email':
          const subjectParam = step.subject ? `--es android.intent.extra.SUBJECT "${step.subject}"` : '';
          const bodyParam = step.text ? `--es android.intent.extra.TEXT "${step.text}"` : '';
          result = await runAdb(
            `shell am start -a android.intent.action.SENDTO -d "mailto:${step.target}" ${subjectParam} ${bodyParam}`
          );
          break;

        case 'wait':
          const waitTime = parseInt(step.target) || 2000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          result = { success: true, output: `Waited ${waitTime}ms` };
          break;

        case 'tap':
          result = await runAdb(`shell input tap ${step.x} ${step.y}`);
          break;

        case 'type':
          const escapedText = step.text.replace(/\s/g, '%s').replace(/'/g, "\\'");
          result = await runAdb(`shell input text "${escapedText}"`);
          break;

        case 'key':
          result = await runAdb(`shell input keyevent ${step.keycode}`);
          break;

        default:
          result = { success: false, error: `Unknown action: ${step.action}` };
      }

      results.push({
        step: step.action,
        reasoning: step.reasoning,
        success: result.success,
        output: result.output,
        error: result.error
      });

      // Small delay between steps
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      results.push({
        step: step.action,
        reasoning: step.reasoning,
        success: false,
        error: error.message
      });
    }
  }

  res.json({ success: true, results });
});

app.listen(PORT, () => {
  console.log(`\n🤖 ADB Automation Agent running on http://localhost:${PORT}`);
  console.log('\nMake sure:');
  console.log('1. ADB is installed and in PATH');
  console.log('2. Device is connected via USB or WiFi');
  console.log('3. USB debugging is enabled');
  console.log('\nTest connection: http://localhost:3000/status\n');
});
