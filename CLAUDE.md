# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tuberose Floral** — a floral shop e-commerce site built with Next.js 14 (App Router) and AWS Amplify Gen 2. All pages are gated behind AWS Cognito authentication via the `<Authenticator>` wrapper in the root layout.

## Commands

```bash
npm run dev        # Start local dev server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npx ampx sandbox   # Start local Amplify backend sandbox (generates amplify_outputs.json)
```

## Environment Variables

Create `.env.local` for local development:

```
UNSPLASH_ACCESS_KEY=<your-key>
```

Server-side pages read `process.env.UNSPLASH_ACCESS_KEY ?? process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`. Without a key, images silently fall back to placeholder backgrounds.

## Architecture

### Authentication
`app/layout.tsx` wraps the entire app in `<CartProvider>` then `<Authenticator>` (AWS Amplify UI). Amplify is configured via `Amplify.configure(outputs)` using `amplify_outputs.json`.

### Server/client component split
Pages that fetch Unsplash images are **async server components** with `export const dynamic = "force-dynamic"`. Only use `"use client"` at the leaf level (forms, buttons, interactive UI).

- `app/shop/page.tsx` (server) → `app/shop/ShopClient.tsx` (client)
- `app/about/page.tsx` (server, self-contained)
- `app/gallery/page.tsx` (server, self-contained)
- `app/cart/page.tsx`, `app/contact/page.tsx` (client-only)

### Cart state
`app/context/CartContext.tsx` — React Context with `localStorage` persistence. Provides `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `count`, and `subtotal` via `useCart()`. Entirely client-side, no backend.

### Styling
CSS Modules (`.module.css`) per page/component. Global styles in `app/globals.css` and `app/app.css`.

### AWS Amplify backend (`amplify/`)
- Auth: Cognito with email login (`amplify/auth/resource.ts`)
- Data: AppSync + DynamoDB with a `Todo` schema (`amplify/data/resource.ts`) — starter template, **not used by the floral UI**
- Backend definition: `amplify/backend.ts`
- Deployment config: `amplify.yml`

### Product data
Products are static arrays in `app/shop/page.tsx`. Each product has a `query` string used to fetch a matching Unsplash image at request time. No database backing.
