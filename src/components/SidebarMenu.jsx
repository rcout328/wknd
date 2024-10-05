'use client'

import Link from 'next/link';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function SidebarMenu({ isOpen, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-pink-100 bg-opacity-30 backdrop-blur-sm transition-opacity z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white bg-opacity-40 backdrop-blur-md shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex justify-end p-4">
          <Button variant="ghost" onClick={onClose}>
            <X className="h-6 w-6 text-pink-600" />
          </Button>
        </div>
        <nav className="px-4">
          <ul className="space-y-4">
            <li><Link href="/" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">Home</Link></li>
            <li><Link href="/about-us" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">About Us</Link></li>
            <li><Link href="/menu" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">Menu</Link></li>
            <li><Link href="/admin-dashboard" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">Admin Dashboard</Link></li> {/* Added link */}
            <li><Link href="/contact-us" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">Contact Us</Link></li>
          </ul>
        </nav>
      </div>
    </>
  );
}