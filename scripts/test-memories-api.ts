import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testMemoriesAPI() {
  try {
    console.log('Testing Memories API...\n');

    // Test POST endpoint
    console.log('1. Testing POST /api/memories');
    const testMemory = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test memory to verify the API.',
      relation: 'Student'
    };

    console.log('Sending test memory:', testMemory);
    const postResponse = await fetch('http://localhost:3000/api/memories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMemory),
    });

    const postResult = await postResponse.json();
    console.log('POST Response:', postResult, '\n');

    // Test GET endpoint
    console.log('2. Testing GET /api/memories');
    const getResponse = await fetch('http://localhost:3000/api/memories');
    const getResult = await getResponse.json();
    console.log('GET Response:', getResult, '\n');

    console.log('API Test completed successfully!');
  } catch (error) {
    console.error('Error testing API:', error);
    process.exit(1);
  }
}

// Make sure the development server is running before testing
console.log('Make sure your development server (npm run dev) is running on http://localhost:3000');
console.log('Starting tests in 3 seconds...\n');

setTimeout(testMemoriesAPI, 3000); 