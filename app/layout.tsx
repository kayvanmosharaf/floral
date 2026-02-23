"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Navbar from "./components/Navbar";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { CartProvider } from "./context/CartContext";

Amplify.configure(outputs);

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Authenticator>
            <Navbar />
            <main style={{ paddingTop: "56px" }}>
              {children}
            </main>
          </Authenticator>
        </CartProvider>
      </body>
    </html>
  );
}
