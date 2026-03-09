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
  // ── Bouquets (30) ─────────────────────────────────────────────
  { name: "Classic Rose Bouquet", category: "Bouquets", price: 45, query: "red rose bouquet", description: "A timeless dozen red roses with baby's breath" },
  { name: "Sunflower Bouquet", category: "Bouquets", price: 35, query: "sunflower bouquet", description: "Bright sunflowers with rustic greenery" },
  { name: "Tulip Bouquet", category: "Bouquets", price: 40, query: "tulip bouquet", description: "Fresh seasonal tulips in assorted colors" },
  { name: "Mixed Spring Bouquet", category: "Bouquets", price: 55, query: "colorful spring flower bouquet", description: "A cheerful mix of seasonal spring blooms" },
  { name: "Peony Blush Bouquet", category: "Bouquets", price: 52, query: "pink peony bouquet", description: "Soft pink peonies with eucalyptus greens" },
  { name: "Lavender Fields Bouquet", category: "Bouquets", price: 38, query: "lavender flower bouquet", description: "Fragrant dried and fresh lavender stems" },
  { name: "White Elegance Bouquet", category: "Bouquets", price: 60, query: "white flower bouquet elegant", description: "Pure white roses, lilies, and ranunculus" },
  { name: "Garden Party Bouquet", category: "Bouquets", price: 48, query: "garden flower bouquet colorful", description: "Loose garden-style mix of dahlias and zinnias" },
  { name: "Wildflower Meadow", category: "Bouquets", price: 32, query: "wildflower bouquet", description: "Hand-picked style wildflowers with grasses" },
  { name: "Romantic Blush Bouquet", category: "Bouquets", price: 58, query: "blush pink flower bouquet", description: "Blush roses, astilbe, and dusty miller" },
  { name: "Citrus Sunrise Bouquet", category: "Bouquets", price: 42, query: "orange yellow flower bouquet", description: "Vibrant orange and yellow gerberas and roses" },
  { name: "Midnight Velvet Bouquet", category: "Bouquets", price: 65, query: "dark red burgundy flower bouquet", description: "Deep burgundy roses and dark dahlias" },
  { name: "Sweet Pastel Bouquet", category: "Bouquets", price: 44, query: "pastel flower bouquet", description: "Soft pastels of carnations and lisianthus" },
  { name: "Daisy Delight Bouquet", category: "Bouquets", price: 28, query: "daisy bouquet", description: "Cheerful white and yellow daisies" },
  { name: "Lilac Dream Bouquet", category: "Bouquets", price: 50, query: "lilac purple flower bouquet", description: "Purple lilacs paired with white stock" },
  { name: "Tropical Paradise Bouquet", category: "Bouquets", price: 62, query: "tropical flower bouquet", description: "Exotic birds of paradise and protea" },
  { name: "Rustic Charm Bouquet", category: "Bouquets", price: 46, query: "rustic burlap flower bouquet", description: "Country roses with burlap wrap and twine" },
  { name: "Cherry Blossom Bouquet", category: "Bouquets", price: 55, query: "cherry blossom bouquet", description: "Delicate cherry blossom branches with ranunculus" },
  { name: "English Garden Bouquet", category: "Bouquets", price: 70, query: "english garden roses bouquet", description: "David Austin roses with trailing ivy" },
  { name: "Dried Flower Bouquet", category: "Bouquets", price: 40, query: "dried flower bouquet", description: "Long-lasting dried pampas grass and wheat" },
  { name: "Rainbow Rose Bouquet", category: "Bouquets", price: 75, query: "rainbow roses bouquet", description: "A vibrant spectrum of multi-colored roses" },
  { name: "Magnolia Bouquet", category: "Bouquets", price: 58, query: "magnolia flower bouquet", description: "Lush magnolia blooms with deep green leaves" },
  { name: "Anemone Pop Bouquet", category: "Bouquets", price: 52, query: "anemone flower bouquet", description: "Bold black-centered anemones with ranunculus" },
  { name: "Eucalyptus & Rose Bouquet", category: "Bouquets", price: 48, query: "eucalyptus rose bouquet", description: "Fragrant eucalyptus greens with cream roses" },
  { name: "Blue Hydrangea Bouquet", category: "Bouquets", price: 50, query: "blue hydrangea bouquet", description: "Full blue hydrangea heads with delphinium" },
  { name: "Petite Posy Bouquet", category: "Bouquets", price: 25, query: "small posy bouquet", description: "A charming petite posy of seasonal favorites" },
  { name: "Coral Sunset Bouquet", category: "Bouquets", price: 54, query: "coral flower bouquet", description: "Warm coral roses and peach carnations" },
  { name: "Winter Berry Bouquet", category: "Bouquets", price: 47, query: "winter berry flower bouquet", description: "Red berries with white roses and pine sprigs" },
  { name: "Protea Statement Bouquet", category: "Bouquets", price: 68, query: "protea flower bouquet", description: "Striking king protea with native foliage" },
  { name: "Lily of the Valley Bouquet", category: "Bouquets", price: 72, query: "lily of the valley bouquet", description: "Delicate and fragrant lily of the valley stems" },

  // ── Weddings (30) ─────────────────────────────────────────────
  { name: "Bridal Bouquet", category: "Weddings", price: 120, query: "bridal wedding bouquet white flowers", description: "Classic white bridal bouquet with roses and peonies" },
  { name: "Wedding Centerpiece", category: "Weddings", price: 85, query: "wedding flower centerpiece table", description: "Elegant low table centerpiece for receptions" },
  { name: "Bridesmaid Bouquet", category: "Weddings", price: 65, query: "bridesmaid bouquet pastel flowers", description: "Matching pastel bouquet for the bridal party" },
  { name: "Ceremony Arch", category: "Weddings", price: 350, query: "wedding flower arch ceremony", description: "Full floral arch for ceremony backdrops" },
  { name: "Bridal Hair Flowers", category: "Weddings", price: 75, query: "bridal hair flowers", description: "Delicate fresh flower hair pins and combs" },
  { name: "Boutonniere", category: "Weddings", price: 18, query: "wedding boutonniere", description: "Single rose boutonniere with greenery" },
  { name: "Flower Girl Basket", category: "Weddings", price: 45, query: "flower girl basket petals", description: "Woven basket with fresh petals for the flower girl" },
  { name: "Cake Topper Flowers", category: "Weddings", price: 55, query: "wedding cake flowers", description: "Fresh floral cake topper arrangement" },
  { name: "Church Pew Arrangement", category: "Weddings", price: 40, query: "church pew flower arrangement", description: "Small bouquets to adorn ceremony seating" },
  { name: "Head Table Garland", category: "Weddings", price: 180, query: "wedding head table garland", description: "Lush greenery garland for the head table" },
  { name: "Corsage Set", category: "Weddings", price: 30, query: "wedding corsage wrist", description: "Wrist corsage for mothers and grandmothers" },
  { name: "Bridal Shower Arrangement", category: "Weddings", price: 95, query: "bridal shower flower arrangement", description: "Festive flowers for the pre-wedding celebration" },
  { name: "Garden Wedding Package", category: "Weddings", price: 500, query: "garden wedding flowers outdoor", description: "Full outdoor garden wedding floral package" },
  { name: "Rustic Wedding Bundle", category: "Weddings", price: 420, query: "rustic wedding flowers burlap", description: "Country-chic florals with burlap and lace accents" },
  { name: "Modern Minimalist Bridal", category: "Weddings", price: 110, query: "minimalist bridal bouquet", description: "Clean-line bouquet with calla lilies and orchids" },
  { name: "Boho Bridal Bouquet", category: "Weddings", price: 130, query: "boho wedding bouquet", description: "Free-spirited mix with pampas grass and roses" },
  { name: "Reception Welcome Sign Flowers", category: "Weddings", price: 90, query: "wedding welcome sign flowers", description: "Floral accent for your reception welcome sign" },
  { name: "Sweetheart Table Arrangement", category: "Weddings", price: 150, query: "sweetheart table flowers wedding", description: "Romantic arrangement for the couple's table" },
  { name: "Aisle Runner Florals", category: "Weddings", price: 200, query: "wedding aisle flowers", description: "Petals and posies lining the ceremony aisle" },
  { name: "Rehearsal Dinner Flowers", category: "Weddings", price: 80, query: "rehearsal dinner flower arrangement", description: "Intimate arrangements for the rehearsal dinner" },
  { name: "Ring Bearer Pillow Flowers", category: "Weddings", price: 35, query: "ring bearer pillow flowers", description: "Tiny fresh flowers adorning the ring pillow" },
  { name: "Wedding Canopy Draping", category: "Weddings", price: 450, query: "wedding canopy flowers draping", description: "Luxurious floral canopy with cascading blooms" },
  { name: "Vintage Wedding Centerpiece", category: "Weddings", price: 100, query: "vintage wedding centerpiece flowers", description: "Antique-inspired arrangement in vintage vessels" },
  { name: "Tropical Wedding Bouquet", category: "Weddings", price: 140, query: "tropical wedding bouquet", description: "Bold tropical blooms for a destination wedding" },
  { name: "Winter Wedding Bouquet", category: "Weddings", price: 135, query: "winter wedding bouquet", description: "White roses, pinecones, and evergreen accents" },
  { name: "Elopement Bouquet", category: "Weddings", price: 85, query: "elopement small bridal bouquet", description: "Petite hand-tied bouquet perfect for elopements" },
  { name: "Wedding Wreath", category: "Weddings", price: 120, query: "wedding flower wreath door", description: "Welcoming floral wreath for venue entrance" },
  { name: "Cascading Bridal Bouquet", category: "Weddings", price: 160, query: "cascading bridal bouquet", description: "Dramatic trailing bouquet with orchids and ivy" },
  { name: "Cocktail Hour Flowers", category: "Weddings", price: 70, query: "cocktail hour flowers small arrangement", description: "Petite bud vases for cocktail tables" },
  { name: "Wedding Toss Bouquet", category: "Weddings", price: 45, query: "wedding toss bouquet", description: "Smaller toss bouquet for the reception tradition" },

  // ── Events (20) ───────────────────────────────────────────────
  { name: "Event Centerpiece", category: "Events", price: 75, query: "floral event centerpiece arrangement", description: "Versatile centerpiece for any event table" },
  { name: "Corporate Arrangement", category: "Events", price: 95, query: "elegant floral office arrangement", description: "Sophisticated arrangement for the corporate office" },
  { name: "Gala Table Flowers", category: "Events", price: 110, query: "luxury gala table flower decoration", description: "Luxury low arrangement for formal gala tables" },
  { name: "Birthday Party Flowers", category: "Events", price: 60, query: "birthday party flower arrangement", description: "Festive colorful blooms for birthday celebrations" },
  { name: "Baby Shower Arrangement", category: "Events", price: 70, query: "baby shower flower arrangement", description: "Soft pastel arrangement for baby showers" },
  { name: "Graduation Bouquet", category: "Events", price: 45, query: "graduation flower bouquet", description: "Congratulatory bouquet in school colors" },
  { name: "Holiday Centerpiece", category: "Events", price: 85, query: "holiday centerpiece flowers", description: "Seasonal holiday centerpiece with candles" },
  { name: "Funeral Spray", category: "Events", price: 150, query: "funeral flower spray", description: "Respectful standing spray of white lilies" },
  { name: "Sympathy Wreath", category: "Events", price: 130, query: "sympathy wreath flowers", description: "Circular wreath for memorial services" },
  { name: "Anniversary Arrangement", category: "Events", price: 90, query: "anniversary flower arrangement", description: "Romantic red and gold anniversary flowers" },
  { name: "Restaurant Table Flowers", category: "Events", price: 35, query: "small restaurant table flowers", description: "Petite bud vases for restaurant tabletops" },
  { name: "Grand Opening Display", category: "Events", price: 200, query: "grand opening flower display", description: "Impressive floral display for business openings" },
  { name: "Charity Gala Flowers", category: "Events", price: 175, query: "charity gala flower arrangement", description: "Elegant arrangements for fundraiser events" },
  { name: "Cocktail Party Flowers", category: "Events", price: 80, query: "cocktail party flower arrangement", description: "Chic and compact arrangements for cocktail events" },
  { name: "Conference Table Arrangement", category: "Events", price: 65, query: "conference table flower arrangement", description: "Low-profile arrangement for meeting rooms" },
  { name: "Housewarming Bouquet", category: "Events", price: 55, query: "housewarming gift flowers", description: "Welcoming bouquet for new homeowners" },
  { name: "Retirement Celebration Flowers", category: "Events", price: 85, query: "retirement celebration flowers", description: "Celebratory arrangement for retirement parties" },
  { name: "Awards Ceremony Flowers", category: "Events", price: 120, query: "awards ceremony stage flowers", description: "Stage and podium floral decorations" },
  { name: "Outdoor Festival Garland", category: "Events", price: 160, query: "outdoor festival flower garland", description: "Long floral garland for festival booths" },
  { name: "Thank You Bouquet", category: "Events", price: 50, query: "thank you flower bouquet", description: "Thoughtful thank-you arrangement with a card" },

  // ── Plants (20) ───────────────────────────────────────────────
  { name: "Orchid Plant", category: "Plants", price: 55, query: "orchid potted plant", description: "Elegant phalaenopsis orchid in ceramic pot" },
  { name: "Lavender Plant", category: "Plants", price: 25, query: "lavender potted plant", description: "Fragrant lavender in a terracotta pot" },
  { name: "Peace Lily", category: "Plants", price: 35, query: "peace lily indoor plant", description: "Air-purifying peace lily in a basket planter" },
  { name: "Hydrangea Plant", category: "Plants", price: 45, query: "hydrangea potted plant", description: "Full blooming hydrangea in a decorative pot" },
  { name: "Fiddle Leaf Fig", category: "Plants", price: 85, query: "fiddle leaf fig plant", description: "Tall statement fiddle leaf fig tree" },
  { name: "Snake Plant", category: "Plants", price: 30, query: "snake plant potted", description: "Low-maintenance snake plant in modern pot" },
  { name: "Pothos Plant", category: "Plants", price: 20, query: "pothos trailing plant", description: "Easy-care trailing pothos with long vines" },
  { name: "Monstera Deliciosa", category: "Plants", price: 65, query: "monstera deliciosa plant", description: "Iconic split-leaf monstera in a woven basket" },
  { name: "Succulent Garden", category: "Plants", price: 35, query: "succulent garden arrangement", description: "Assorted succulents in a wooden planter" },
  { name: "Bonsai Tree", category: "Plants", price: 75, query: "bonsai tree potted", description: "Miniature bonsai tree with decorative stones" },
  { name: "Fern Hanging Basket", category: "Plants", price: 30, query: "fern hanging basket plant", description: "Lush Boston fern in a macrame hanging basket" },
  { name: "ZZ Plant", category: "Plants", price: 40, query: "zz plant potted", description: "Glossy ZZ plant thriving in low light" },
  { name: "Rubber Plant", category: "Plants", price: 45, query: "rubber plant potted", description: "Burgundy rubber plant in a ceramic planter" },
  { name: "Aloe Vera Plant", category: "Plants", price: 18, query: "aloe vera potted plant", description: "Medicinal aloe vera in a simple clay pot" },
  { name: "Calathea Plant", category: "Plants", price: 38, query: "calathea prayer plant", description: "Striking patterned calathea prayer plant" },
  { name: "Bird of Paradise Plant", category: "Plants", price: 80, query: "bird of paradise plant indoor", description: "Dramatic bird of paradise in a floor planter" },
  { name: "Herb Garden Kit", category: "Plants", price: 28, query: "herb garden kit potted", description: "Basil, rosemary, and mint in a window planter" },
  { name: "Cactus Collection", category: "Plants", price: 22, query: "cactus collection potted", description: "Trio of desert cacti in matching pots" },
  { name: "Anthurium Plant", category: "Plants", price: 42, query: "anthurium red plant", description: "Red anthurium with heart-shaped blooms" },
  { name: "Olive Tree", category: "Plants", price: 70, query: "olive tree potted indoor", description: "Mediterranean olive tree in a statement pot" },
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
          description: product.description,
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
