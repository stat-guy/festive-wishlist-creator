const https = require('https');

// fal.ai API key
const FAL_KEY = "3eaba188-7132-4f0c-b43c-256f96dbef61:2fb3c066d7665fe10e18d670599c9765";

// Simple test request
const payload = {
  modelId: 'sd-turbo',
  input: {
    prompt: "Test image",
    width: 512,
    height: 512,
    num_images: 1
  }
};

// Setup request options
const options = {
  hostname: 'api.fal.ai',
  port: 443,
  path: '/v1/generation/image',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Key ${FAL_KEY}`
  }
};

console.log('Sending test request to fal.ai...');

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:');
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log('Failed to parse JSON:', e.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  
  // Try to resolve the hostname manually
  require('dns').lookup('api.fal.ai', (err, address, family) => {
    if (err) {
      console.error(`DNS lookup failed: ${err.message}`);
    } else {
      console.log(`Address: ${address}, Family: IPv${family}`);
    }
  });
});

// Write data to request body
req.write(JSON.stringify(payload));
req.end();

console.log('Request sent, waiting for response...');