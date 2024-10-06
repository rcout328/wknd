'use client'

import Image from 'next/image';
import { Search, ShoppingBag, ChevronRight, Instagram, Facebook, Twitter, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8"> {/* Adjusted padding */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-pink-400">WKND</h3>
            <p className="text-gray-400">Baking happiness since 2010</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4 text-pink-400">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Menu', 'About Us', 'Contact', 'FAQ'].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4 text-pink-400">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-6 w-6 mr-2 text-pink-400 flex-shrink-0" />
                <span className="text-gray-400">123 Cake Street, Dessert City, 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-6 w-6 mr-2 text-pink-400" />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-6 w-6 mr-2 text-pink-400" />
                <span className="text-gray-400">info@wkndcakes.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4 text-pink-400">Newsletter</h4>
            <p className="text-gray-400 mb-4">Stay updated with our latest offers and cake designs!</p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center pt-4"> {/* Adjusted margin-top */}
          <p className="text-gray-400 text-sm">&copy; 2024 WKND Cakes. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}