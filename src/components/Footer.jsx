'use client'

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, ArrowRight, Clock } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-pink-400">WKND</h3>
            <p className="text-gray-400">Baking happiness since 2010</p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/wknd.bakes?igsh=MzRlODBiNWFlZA==" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4 text-pink-400">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Menu', path: '/menu' },
                { name: 'About Us', path: '/about-us' },
                { name: 'Contact', path: '/contact-us' }
              ].map((item, index) => (
                <li key={index}>
                  <Link href={item.path} className="text-gray-400 hover:text-white transition-colors flex items-center group">
                    <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4 text-pink-400">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-pink-400 mr-3 flex-shrink-0" />
                <p className="text-gray-400">05,GROUND FLOOR SHOP,DEVPREET COMPLEX,NFD CIRCLE,AHMEDABAD 380054</p>
              </div>
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-pink-400 mr-3" />
                <p className="text-gray-400">9427083584,6354423444</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-pink-400 mr-3" />
                <p className="text-gray-400">info@wkndcakes.com</p>
              </div>
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-pink-400 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">Mon-Sun: 11:00 AM - 12:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center pt-4">
          <p className="text-gray-400 text-sm">&copy; 2024 WKND Cakes. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}