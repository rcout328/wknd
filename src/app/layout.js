import localFont from "next/font/local";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "WKND Bakes - Delicious Cakes for Every Occasion",
  description: "Explore our mouth-watering selection of freshly baked cakes for birthdays, weddings, and special events. Experience the joy of sweet indulgence with WKND Bakes!",
};


export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </UserProvider>
  );
}