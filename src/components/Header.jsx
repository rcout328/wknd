'use client'

import { useEffect, useState } from 'react'; // Import useEffect and useState
import Link from 'next/link';
import { ShoppingBag, Menu, User } from 'lucide-react'; // Add User icon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header({ toggleSidebar }) {
  return (
    <header className="sticky top-0 z-30 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-pink-500">WKND Bakes</Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="text-gray-700 hover:text-pink-500 border-b-2 border-transparent hover:border-pink-500 transition-all duration-300">Home</Link>
          <Link href="/about-us" className="text-gray-700 hover:text-pink-500 border-b-2 border-transparent hover:border-pink-500 transition-all duration-300">About Us</Link>
          <Link href="/menu" className="text-gray-700 hover:text-pink-500 border-b-2 border-transparent hover:border-pink-500 transition-all duration-300">Menu</Link>
          <Link href="/contact-us" className="text-gray-700 hover:text-pink-500 border-b-2 border-transparent hover:border-pink-500 transition-all duration-300">Contact Us</Link>
        </nav>
        <div className="flex items-center space-x-4">
        <Button size="icon" variant="ghost" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5 text-gray-700" />
            <span className="sr-only">Menu</span>
          </Button>
          <Link href="/admin-dashboard">
            <Button variant="outline" className="text-gray-700 hover:text-pink-500">
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}