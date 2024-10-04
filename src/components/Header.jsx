'use client'

import Link from 'next/link'
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header({ toggleSidebar }) {
  return (
    <header className="sticky top-0 z-30 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-pink-500">WKND</Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="text-gray-700 hover:text-pink-500">Home</Link>
          <Link href="/about-us" className="text-gray-700 hover:text-pink-500">About Us</Link>
          <Link href="/menu" className="text-gray-700 hover:text-pink-500">Menu</Link> {/* Updated link */}
          <Link href="/contact-us" className="text-gray-700 hover:text-pink-500">Contact Us</Link> {/* Added link */}
        </nav>
        <div className="flex items-center space-x-4">
          <Input className="hidden md:block" placeholder="Search" type="search" />
          <Button size="icon" variant="ghost">
            <Search className="h-5 w-5 text-gray-700" />
            <span className="sr-only">Search</span>
          </Button>
          <Button size="icon" variant="ghost" className="bg-orange-100 text-orange-500">
            <ShoppingBag className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          <Button size="icon" variant="ghost" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5 text-gray-700" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}