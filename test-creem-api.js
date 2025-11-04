// Test Creem API with official sample code - PRODUCTION CREDENTIALS
import axios from 'axios';

// Using production credentials
const apiKey = 'creem_6ukMYM5SkJaeI2PnOHHChw';
const productId = 'prod_2QE0CLXZ4FdRHEIUR6fDDt';

async function testCreemAPI() {
  console.log('🔍 Testing Creem API with Official Sample Code...\n');
  console.log(`API Key: ${apiKey}`);
  console.log(`Product ID: ${productId}\n`);

  // Official sample code test: Seat-based checkout
  console.log('💳 Test: Creating seat-based checkout (Official Sample)...');
  try {
    const seatBasedCheckout = await axios.post(
      `https://api.creem.io/v1/checkouts`,
      {
        product_id: productId,
        units: 5, // Number of seats to purchase
      },
      {
        headers: { "x-api-key": apiKey },
      }
    );

    console.log('✅ Success! Status:', seatBasedCheckout.status);
    console.log('Response:', JSON.stringify(seatBasedCheckout.data, null, 2));

    if (seatBasedCheckout.data.url) {
      console.log('\n🎉 Checkout URL:', seatBasedCheckout.data.url);
    }
  } catch (error) {
    console.error('❌ Failed to create checkout');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }

  // Additional test: Without units (basic checkout)
  console.log('\n💳 Test 2: Creating basic checkout (no units)...');
  try {
    const basicCheckout = await axios.post(
      `https://api.creem.io/v1/checkouts`,
      {
        product_id: productId,
      },
      {
        headers: { "x-api-key": apiKey },
      }
    );

    console.log('✅ Success! Status:', basicCheckout.status);
    console.log('Response:', JSON.stringify(basicCheckout.data, null, 2));

    if (basicCheckout.data.url) {
      console.log('\n🎉 Checkout URL:', basicCheckout.data.url);
    }
  } catch (error) {
    console.error('❌ Failed to create basic checkout');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error:', error.message);
    }
  }
}

testCreemAPI();
