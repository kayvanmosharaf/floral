import outputs from "../amplify_outputs.json";

// Usage: npx tsx scripts/seed-orders.ts <email> <password>
// The user must be in the "admin" Cognito group.

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error("Usage: npx tsx scripts/seed-orders.ts <email> <password>");
  process.exit(1);
}

const COGNITO_REGION = outputs.auth.aws_region;
const CLIENT_ID = outputs.auth.user_pool_client_id;
const GRAPHQL_URL = outputs.data.url;

const createOrderMutation = /* GraphQL */ `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      orderNumber
    }
  }
`;

function generateOrderNumber() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "TF-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

const names = ["Jane Smith", "Michael Chen", "Sarah Johnson", "David Park", "Emma Wilson"];
const streets = ["123 Bloom St", "456 Garden Ave", "789 Rose Blvd", "321 Petal Lane", "654 Lily Way"];
const cities = ["Los Angeles", "San Francisco", "New York", "Chicago", "Seattle"];
const states = ["CA", "CA", "NY", "IL", "WA"];
const zips = ["90001", "94102", "10001", "60601", "98101"];
const statuses = ["pending", "preparing", "shipped", "delivered"];

const sampleItems = [
  [
    { id: "p1", name: "Classic Rose Bouquet", price: 45, quantity: 2 },
    { id: "p2", name: "Lavender Plant", price: 25, quantity: 1 },
  ],
  [
    { id: "p3", name: "Bridal Bouquet", price: 120, quantity: 1 },
    { id: "p4", name: "Bridesmaid Bouquet", price: 65, quantity: 3 },
  ],
  [
    { id: "p5", name: "Event Centerpiece", price: 75, quantity: 4 },
  ],
  [
    { id: "p6", name: "Orchid Plant", price: 55, quantity: 1 },
    { id: "p7", name: "Peace Lily", price: 35, quantity: 2 },
    { id: "p8", name: "Sunflower Bouquet", price: 35, quantity: 1 },
  ],
  [
    { id: "p9", name: "Wedding Centerpiece", price: 85, quantity: 2 },
    { id: "p10", name: "Ceremony Arch", price: 350, quantity: 1 },
  ],
  [
    { id: "p11", name: "Tulip Bouquet", price: 40, quantity: 3 },
  ],
  [
    { id: "p12", name: "Corporate Arrangement", price: 95, quantity: 2 },
    { id: "p13", name: "Gala Table Flowers", price: 110, quantity: 3 },
  ],
  [
    { id: "p14", name: "Hydrangea Plant", price: 45, quantity: 1 },
  ],
];

function buildOrder(index: number) {
  const items = sampleItems[index % sampleItems.length];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const delivery = 15;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = subtotal + delivery + tax;
  const i = index % names.length;

  return {
    items: JSON.stringify(items),
    shippingName: names[i],
    shippingAddress: streets[i],
    shippingCity: cities[i],
    shippingState: states[i],
    shippingZip: zips[i],
    cardLast4: String(1000 + Math.floor(Math.random() * 9000)),
    subtotal,
    delivery,
    tax,
    total,
    status: statuses[index % statuses.length],
    orderNumber: generateOrderNumber(),
  };
}

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

async function createOrder(token: string, order: ReturnType<typeof buildOrder>) {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      query: createOrderMutation,
      variables: { input: order },
    }),
  });
  return res.json();
}

async function seed() {
  const count = 8;
  console.log(`Signing in as ${email}...`);
  const token = await getAccessToken();
  console.log("Authenticated.\n");

  console.log(`Seeding ${count} test orders...\n`);
  for (let i = 0; i < count; i++) {
    const order = buildOrder(i);
    const result = await createOrder(token, order);
    if (result.errors) {
      console.error(`Failed: ${order.orderNumber}`, result.errors);
    } else {
      console.log(`Created: ${result.data.createOrder.orderNumber} (${result.data.createOrder.id}) - $${order.total.toFixed(2)} [${order.status}]`);
    }
  }

  console.log("\nDone!");
}

seed();
