import outputs from "../amplify_outputs.json";

// Usage: npx tsx scripts/seed-products.ts <email> <password>
// The user must be in the "admin" Cognito group.

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: npx tsx scripts/seed-products.ts <email> <password>");
  process.exit(1);
}

const COGNITO_REGION = outputs.auth.aws_region;
const CLIENT_ID = outputs.auth.user_pool_client_id;
const GRAPHQL_URL = outputs.data.url;

const createProductMutation = /* GraphQL */ `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
    }
  }
`;

const products = [
  { name: "Classic Rose Bouquet", category: "Bouquets", price: 45, query: "red rose bouquet" },
  { name: "Sunflower Bouquet", category: "Bouquets", price: 35, query: "sunflower bouquet" },
  { name: "Tulip Bouquet", category: "Bouquets", price: 40, query: "tulip bouquet" },
  { name: "Mixed Spring Bouquet", category: "Bouquets", price: 55, query: "colorful spring flower bouquet" },
  { name: "Bridal Bouquet", category: "Weddings", price: 120, query: "bridal wedding bouquet white flowers" },
  { name: "Wedding Centerpiece", category: "Weddings", price: 85, query: "wedding flower centerpiece table" },
  { name: "Bridesmaid Bouquet", category: "Weddings", price: 65, query: "bridesmaid bouquet pastel flowers" },
  { name: "Ceremony Arch", category: "Weddings", price: 350, query: "wedding flower arch ceremony" },
  { name: "Event Centerpiece", category: "Events", price: 75, query: "floral event centerpiece arrangement" },
  { name: "Corporate Arrangement", category: "Events", price: 95, query: "elegant floral office arrangement" },
  { name: "Gala Table Flowers", category: "Events", price: 110, query: "luxury gala table flower decoration" },
  { name: "Orchid Plant", category: "Plants", price: 55, query: "orchid potted plant" },
  { name: "Lavender Plant", category: "Plants", price: 25, query: "lavender potted plant" },
  { name: "Peace Lily", category: "Plants", price: 35, query: "peace lily indoor plant" },
  { name: "Hydrangea Plant", category: "Plants", price: 45, query: "hydrangea potted plant" },
];

async function getAccessToken(): Promise<string> {
  const res = await fetch(
    `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
      body: JSON.stringify({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      }),
    }
  );
  const data = await res.json();
  if (data.__type || !data.AuthenticationResult) {
    console.error("Auth failed:", data.message || data);
    process.exit(1);
  }
  return data.AuthenticationResult.AccessToken;
}

async function createProduct(token: string, product: typeof products[0]) {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      query: createProductMutation,
      variables: {
        input: {
          name: product.name,
          category: product.category,
          price: product.price,
          query: product.query,
          inStock: true,
        },
      },
    }),
  });
  return res.json();
}

async function seed() {
  console.log(`Signing in as ${email}...`);
  const token = await getAccessToken();
  console.log("Authenticated.\n");

  console.log(`Seeding ${products.length} products...\n`);
  for (const product of products) {
    const result = await createProduct(token, product);
    if (result.errors) {
      console.error(`Failed: "${product.name}"`, result.errors);
    } else {
      console.log(`Created: ${result.data.createProduct.name} (${result.data.createProduct.id})`);
    }
  }

  console.log("\nDone!");
}

seed();
