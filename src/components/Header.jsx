'use client'

import { useEffect, useState } from 'react'; // Import useEffect and useState
import Link from 'next/link'
import { Search, ShoppingBag, Menu, User } from 'lucide-react'; // Add User icon
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header({ toggleSidebar }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    // Check if the user is logged in
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setIsLoggedIn(true); // User is logged in
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail'); // Clear email from local storage
    window.location.href = '/login-register'; // Redirect to login page
  };

  return (
    <header className="sticky top-0 z-30 bg-white bg-opacity-90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-pink-500">WKND</Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="text-gray-700 hover:text-pink-500">Home</Link>
          <Link href="/about-us" className="text-gray-700 hover:text-pink-500">About Us</Link>
          <Link href="/menu" className="text-gray-700 hover:text-pink-500">Menu</Link>
          <Link href="/contact-us" className="text-gray-700 hover:text-pink-500">Contact Us</Link>
          {!isLoggedIn && (
            <Link href="/login-register" className="text-gray-700 hover:text-pink-500">Login/Register</Link>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          <Input className="hidden md:block" placeholder="Search" type="search" />
          <Button size="icon" variant="ghost">
            <Search className="h-5 w-5 text-gray-700" />
            <span className="sr-only">Search</span>
          </Button>
          {isLoggedIn && (
            <Button size="icon" variant="ghost">
              <Link href="/user-orders"><User className="h-5 w-5 text-gray-700" /></Link>
              <span className="sr-only">My Orders</span>
            </Button>
          )}
          <Button size="icon" variant="ghost" className="bg-orange-100 text-orange-500">
            <Link href="/advanced-cart"><ShoppingBag className="h-5 w-5" /></Link>
          </Button>
          <Button size="icon" variant="ghost" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5 text-gray-700" />
            <span className="sr-only">Menu</span>
          </Button>
          {isLoggedIn ? (
            <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
              Logout
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}