// Test Creem API directly
const apiKey = 'creem_test_6KdlTldMzkVvkPglJ4brob';
const productId = 'prod_73f2TIH0PZehGLpKVzhShE';

async function testCreemAPI() {
  console.log('🔍 Testing Creem API...\n');

  // Test 1: List products
  console.log('📋 Test 1: Listing all products...');
  try {
    const listResponse = await fetch('https://api.creem.io/v1/products', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    });

    const products = await listResponse.json();
    console.log('✅ Products list:', JSON.stringify(products, null, 2));
    console.log('\n');
  } catch (error) {
    console.error('❌ Failed to list products:', error);
  }

  // Test 2: Get specific product
  console.log(`📦 Test 2: Getting product ${productId}...`);
  try {
    const productResponse = await fetch(`https://api.creem.io/v1/products/${productId}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    });

    const product = await productResponse.json();
    console.log('✅ Product details:', JSON.stringify(product, null, 2));
    console.log('\n');
  } catch (error) {
    console.error('❌ Failed to get product:', error);
  }

  // Test 3: Create checkout session (original format)
  console.log('💳 Test 3: Creating checkout session (customer object)...');
  try {
    const checkoutBody = {
      product_id: productId,
      customer: {
        email: 'test@example.com',
      },
      success_url: 'http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}',
    };

    console.log('Request body:', JSON.stringify(checkoutBody, null, 2));

    const checkoutResponse = await fetch('https://api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutBody),
    });

    const checkout = await checkoutResponse.json();
    console.log(`Status: ${checkoutResponse.status}`);
    console.log('Response:', JSON.stringify(checkout, null, 2));
    console.log('\n');
  } catch (error) {
    console.error('❌ Failed to create checkout:', error);
  }

  // Test 4: Create checkout session (customer_email format)
  console.log('💳 Test 4: Creating checkout session (customer_email string)...');
  try {
    const checkoutBody = {
      product_id: productId,
      customer_email: 'test@example.com',
      success_url: 'http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}',
    };

    console.log('Request body:', JSON.stringify(checkoutBody, null, 2));

    const checkoutResponse = await fetch('https://api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutBody),
    });

    const checkout = await checkoutResponse.json();
    console.log(`Status: ${checkoutResponse.status}`);
    console.log('Response:', JSON.stringify(checkout, null, 2));
  } catch (error) {
    console.error('❌ Failed to create checkout:', error);
  }
}

testCreemAPI();
