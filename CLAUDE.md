# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tuberose Floral** — a floral shop e-commerce site built with Next.js 14 (App Router) and AWS Amplify Gen 2. All pages are gated behind AWS Cognito authentication via the `<Authenticator>` wrapper in the root layout.

## Commands

```bash
npm run dev      # Start local dev server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### AWS Amplify backend (local sandbox)

```bash
npx ampx sandbox   # Start local Amplify backend sandbox
```

The sandbox generates/updates `amplify_outputs.json`, which is committed and used by the frontend to configure Amplify.

## Environment Variables

Create `.env.local` for local development:

```
UNSPLASH_ACCESS_KEY=<your-key>
```

Server-side pages read `process.env.UNSPLASH_ACCESS_KEY ?? process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` — the server-only key is preferred. Without a key, images silently fall back to placeholder backgrounds.

## Architecture

### Authentication flow
`app/layout.tsx` wraps the entire app in `<CartProvider>` then `<Authenticator>` (AWS Amplify UI). Every page is behind authentication. Amplify is configured via `Amplify.configure(outputs)` in the layout using `amplify_outputs.json`.

### Server/client component split
Pages that fetch Unsplash images are **async server components** with `export const dynamic = "force-dynamic"` to prevent caching. They fetch images server-side and pass them as props to client components:

- `app/shop/page.tsx` (server) → `app/shop/ShopClient.tsx` (client)
- `app/about/page.tsx` (server, self-contained)
- `app/gallery/page.tsx` (server, self-contained)

Client-only pages: `app/cart/page.tsx`, `app/contact/page.tsx`.

### Cart state
`app/context/CartContext.tsx` — React Context with `localStorage` persistence. Provides `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `count`, and `subtotal`. Wrap access with `useCart()` hook. The cart is not connected to any backend — it is entirely client-side.

### Styling
CSS Modules (`.module.css`) per page/component. Global styles in `app/globals.css` and `app/app.css`.

### AWS Amplify backend (`amplify/`)
- Auth: Cognito with email login (`amplify/auth/resource.ts`)
- Data: AppSync + DynamoDB with a `Todo` schema (`amplify/data/resource.ts`) — this is from the starter template and not used by the floral UI
- Backend definition: `amplify/backend.ts`
- Deployment config: `amplify.yml` (used by AWS Amplify CI/CD)

### Product data
Products are defined as static arrays in `app/shop/page.tsx`. Each product has a `query` string used to fetch a matching image from the Unsplash API at request time. There is no database backing products.
