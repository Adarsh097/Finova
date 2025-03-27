import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Finova",
  description: "Your Intelligent Financial Partner.™",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          {/* HEADER */}
          <Header />

          {/* MAIN */}
          <main className="min-h-screen">{children}</main>

          {/* FOOTER */}

          <footer className="bg-blue-50 py-12 mt-10">
            <div className="container mx-auto px-4 text-center">
              <p>Your Intelligent Financial Partner™</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
