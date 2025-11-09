const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

console.log('\n🎭 MOCK ADB Agent - For Testing Without Device\n');
console.log('This simulates ADB responses for development/testing');
console.log('Use real server (npm start) when you have a device\n');

// Mock contacts database
const mockContacts = [
  { name: 'Jutin', number: '+1234567890' },
  { name: 'John Smith', number: '+1234567891' },
  { name: 'Jane Doe', number: '+1234567892' },
  { name: 'Bob Johnson', number: '+1234567893' },
  { name: 'Alice Williams', number: '+1234567894' },
];

// Check Connection
app.get('/status', (req, res) => {
  console.log('✅ Status check');
  res.json({
    connected: true,
    message: 'Mock device connected',
    mock: true,
  });
});

// Get All Contacts
app.get('/contacts', (req, res) => {
  console.log('📇 Get all contacts');
  res.json({
    success: true,
    contacts: mockContacts,
  });
});

// Search Contact
app.post('/contacts/search', (req, res) => {
  const { query } = req.body;
  console.log(`🔍 Search contact: "${query}"`);
  
  const queryLower = query.toLowerCase();
  const matches = mockContacts.filter(c => 
    c.name.toLowerCase().includes(queryLower)
  );
  
  if (matches.length > 0) {
    res.json({
      success: true,
      contact: matches[0],
      allMatches: matches,
    });
  } else {
    res.json({
      success: false,
      contact: null,
      error: `No contact found matching "${query}"`,
      suggestions: mockContacts.slice(0, 3).map(c => c.name),
    });
  }
});

// Open URL
app.post('/open-url', (req, res) => {
  const { url, browser } = req.body;
  console.log(`🌐 Open URL: ${url} in ${browser || 'default'}`);
  res.json({
    success: true,
    output: `Simulated: Opened ${url} in ${browser || 'default browser'}`,
  });
});

// Open App
app.post('/open-app', (req, res) => {
  const { packageName } = req.body;
  console.log(`📱 Open app: ${packageName}`);
  res.json({
    success: true,
    output: `Simulated: Opened ${packageName}`,
  });
});

// WhatsApp
app.post('/whatsapp', (req, res) => {
  const { contact, message } = req.body;
  console.log(`💬 WhatsApp to ${contact}: "${message}"`);
  
  // Resolve contact
  const queryLower = contact.toLowerCase();
  const match = mockContacts.find(c => 
    c.name.toLowerCase().includes(queryLower)
  );
  
  res.json({
    success: true,
    output: `Simulated: Opened WhatsApp with message to ${contact}`,
    resolvedNumber: match ? match.number : contact,
  });
});

// Phone Call
app.post('/call', (req, res) => {
  const { contact } = req.body;
  console.log(`📞 Call: ${contact}`);
  
  // Resolve contact
  const queryLower = contact.toLowerCase();
  const match = mockContacts.find(c => 
    c.name.toLowerCase().includes(queryLower)
  );
  
  res.json({
    success: true,
    output: `Simulated: Initiated call to ${contact}`,
    resolvedNumber: match ? match.number : contact,
  });
});

// Email
app.post('/email', (req, res) => {
  const { to, subject, body } = req.body;
  console.log(`📧 Email to ${to}: ${subject}`);
  res.json({
    success: true,
    output: `Simulated: Sent email to ${to}`,
  });
});

// Tap
app.post('/tap', (req, res) => {
  const { x, y } = req.body;
  console.log(`👆 Tap at (${x}, ${y})`);
  res.json({
    success: true,
    output: `Simulated: Tapped at (${x}, ${y})`,
  });
});

// Type
app.post('/type', (req, res) => {
  const { text } = req.body;
  console.log(`⌨️  Type: "${text}"`);
  res.json({
    success: true,
    output: `Simulated: Typed "${text}"`,
  });
});

// Key
app.post('/key', (req, res) => {
  const { keycode } = req.body;
  console.log(`🔘 Press key: ${keycode}`);
  res.json({
    success: true,
    output: `Simulated: Pressed key ${keycode}`,
  });
});

// Execute Plan
app.post('/execute-plan', (req, res) => {
  const { steps } = req.body;
  console.log(`\n🤖 Executing automation plan with ${steps.length} steps:\n`);
  
  const results = steps.map((step, index) => {
    console.log(`  ${index + 1}. ${step.action}: ${step.reasoning}`);
    return {
      step: step.action,
      reasoning: step.reasoning,
      success: true,
      output: `Simulated: ${step.action} completed`,
    };
  });
  
  console.log('\n✅ Plan execution complete (simulated)\n');
  
  res.json({
    success: true,
    results,
  });
});

// Screenshot
app.get('/screenshot', (req, res) => {
  console.log('📸 Screenshot');
  res.json({
    success: true,
    output: 'Simulated: Screenshot taken',
  });
});

// UI Dump
app.get('/ui-dump', (req, res) => {
  console.log('🗂️  UI Dump');
  res.json({
    success: true,
    xml: '<mock>UI hierarchy</mock>',
  });
});

app.listen(PORT, () => {
  console.log(`\n🎭 Mock ADB Agent running on http://localhost:${PORT}`);
  console.log('\n📋 Available endpoints:');
  console.log('  GET  /status');
  console.log('  GET  /contacts');
  console.log('  POST /contacts/search');
  console.log('  POST /whatsapp');
  console.log('  POST /call');
  console.log('  POST /open-url');
  console.log('  POST /execute-plan');
  console.log('\n💡 This is a MOCK server for testing without a device');
  console.log('   All actions are simulated and logged to console');
  console.log('   Use "npm start" for real ADB automation\n');
});
