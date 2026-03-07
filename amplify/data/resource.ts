import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Product: a
    .model({
      name: a.string().required(),
      category: a.string().required(),
      price: a.float().required(),
      query: a.string().required(),
      description: a.string(),
      inStock: a.boolean().default(true),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["admin"]),
    ]),

  Order: a
    .model({
      items: a.string().required(),
      shippingName: a.string().required(),
      shippingAddress: a.string().required(),
      shippingCity: a.string().required(),
      shippingState: a.string().required(),
      shippingZip: a.string().required(),
      cardLast4: a.string().required(),
      subtotal: a.float().required(),
      delivery: a.float().required(),
      tax: a.float().required(),
      total: a.float().required(),
      status: a.string().default("pending"),
      orderNumber: a.string().required(),
    })
    .authorization((allow) => [
      allow.owner().to(["create", "read"]),
      allow.groups(["admin"]),
    ]),

  ContactMessage: a
    .model({
      name: a.string().required(),
      email: a.string().required(),
      phone: a.string(),
      eventDate: a.string(),
      subject: a.string().required(),
      message: a.string().required(),
      attachmentKey: a.string(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.groups(["admin"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
