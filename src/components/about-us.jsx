'use client'

import { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from './Header';
import SidebarMenu from './SidebarMenu';
import Footer from './Footer';

export function AboutUsComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header toggleSidebar={toggleSidebar} />
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="container mx-auto px-6 py-16">
        <section className="mb-24">
          <h1 className="text-5xl font-bold text-center mb-8">Our Sweet Journey</h1>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <Image
                src="https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/5c3412c9-c329-4133-922a-078ab60afa0e/Leonardo_Phoenix_A_stunning_multitiered_cake_designed_with_int_2.jpg"
                alt="WKND Bakery"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg" />
            </div>
            <div className="md:w-1/2 space-y-6">
              <p className="text-lg text-gray-700">
                At WKND Cakes, we believe in baking happiness. Our handcrafted cakes are made with love and the finest ingredients, perfect for any occasion or just because you deserve a treat!
              </p>
              <p className="text-lg text-gray-700">
                Our mission is simple: to spread joy through delicious, handcrafted cakes. Every creation is a labor of love, made with the finest ingredients and a dash of magic.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <div className="bg-white rounded-3xl p-12 shadow-lg">
            <h2 className="text-4xl font-bold text-center mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Quality Ingredients', icon: '🌾' },
                { title: 'Creativity', icon: '🎨' },
                { title: 'Customer Satisfaction', icon: '😊' },
                { title: 'Community', icon: '🤝' }
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-12">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {[
              { number: "50+", label: "Happy Customers" },
              { number: "20+", label: "Cake Designs" },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md text-center w-full">
                <div className="text-4xl font-bold text-pink-500 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}