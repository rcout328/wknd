'use client'

import { useState } from 'react';
import Image from 'next/image'
import { Search, ShoppingBag, ChevronRight, Instagram, Facebook, Twitter, Menu, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Footer from './Footer'; // Import the new Footer component
import SidebarMenu from './SidebarMenu';

// Array of cake objects with names, descriptions, and images
const cakes = [
  {
    name: "Gourmet Cheesecake",
    description: "A rich and creamy cheesecake topped with fresh berries.",
    image: "https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/3c83e2fd-f499-4960-bc1e-33418257f740/Leonardo_Phoenix_A_beautiful_gourmet_cheesecake_placed_on_an_e_2.jpg"
  },
  {
    name: "Chocolatey Delight",
    description: "A decadent chocolate cake with layers of rich chocolate frosting.",
    image: "https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/027d40d2-1cf7-4389-863e-121998db024e/Leonardo_Phoenix_A_beautiful_gourmet_chocolatey_caked_placed_o_1.jpg"
  },
  {
    name: "Waffle Cake",
    description: "A unique cake made with fluffy waffles and maple syrup.",
    image: "https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/281e2dc7-9a3b-47c9-bca4-e87b1743e6dc/Leonardo_Phoenix_A_beautiful_gourmet_waffle_caked_placed_on_an_0.jpg"
  },
  {
    name: "Strawberry Shortcake",
    description: "A light and fluffy cake layered with fresh strawberries and whipped cream.",
    image: "https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/432cd102-61e8-4eaf-a97e-74299a084d05/Leonardo_Phoenix_A_beautiful_gourmem_strawberry_caked_placed_o_0.jpg"
  },
  {
    name: "Classic Red Velvet",
    description: "A classic red velvet cake with cream cheese frosting.",
    image: "https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/3c83e2fd-f499-4960-bc1e-33418257f740/Leonardo_Phoenix_A_beautiful_gourmet_cheesecake_placed_on_an_e_3.jpg"
  },
  {
    name: "Lemon Drizzle Cake",
    description: "A zesty lemon cake drizzled with a sweet lemon glaze.",
    image: "https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/432cd102-61e8-4eaf-a97e-74299a084d05/Leonardo_Phoenix_A_beautiful_gourmem_strawberry_caked_placed_o_3.jpg"
  },
];

export function WkndCakeShop() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-3xl font-bold text-pink-500">WKND</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-pink-500 transition-colors">Home</a>
            <a href="#" className="text-gray-700 hover:text-pink-500 transition-colors">Menu</a>
            <a href="#" className="text-gray-700 hover:text-pink-500 transition-colors">About</a>
            <a href="#" className="text-gray-700 hover:text-pink-500 transition-colors">Contact</a>
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
      <main className="container mx-auto px-6 py-16">
        <section
          className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
          <div className="md:w-1/2 space-y-8">
            <h1 className="text-6xl font-bold text-gray-800 leading-tight">
              Indulge in <span className="text-pink-500">Heavenly</span> Cakes
            </h1>
            <p className="text-xl text-gray-600">
              Experience the magic of our handcrafted cakes, baked with love and the finest ingredients. Perfect for any occasion or just because you deserve a treat!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white">
                Order Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-pink-500 border-pink-500 hover:bg-pink-50">
                Our Story
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end relative">
            <Image
              src="https://cdn.igp.com/f_auto,q_auto,t_pnopt19prodlp/products/p-classic-red-velvet-cake-half-kg--109230-m.jpg" // Ensure this is the correct URL
              alt="Delicious cake"
              width={600}
              height={600}
              className="rounded-3xl shadow-2xl" />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
              <p className="text-lg font-semibold text-gray-800">Fresh Daily</p>
              <p className="text-sm text-gray-600">Baked with love</p>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-12">Our Signature Cakes</h2>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="birthday">Birthday</TabsTrigger>
              <TabsTrigger value="wedding">Wedding</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cakes.map((cake, index) => (
                <Card key={index} className="overflow-hidden">
                  <Image
                    src={cake.image} // Use the image URL from the array
                    alt={cake.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover" />
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{cake.name}</h3> {/* Cake name */}
                    <p className="text-gray-600 mb-4">{cake.description}</p> {/* Cake description */}
                    <Button className="w-full">Order Now</Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            {/* Add similar TabsContent for other categories */}
          </Tabs>
        </section>

        <section className="mb-24">
          <div
            className="bg-pink-100 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-4xl font-bold mb-4">Custom Cake Design</h2>
              <p className="text-xl text-gray-700 mb-8">
                Dream it, and we&apos;ll bake it! Our expert bakers can create the perfect custom cake for your special occasion.
              </p>
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white">
                Start Designing
              </Button>
            </div>
            <div className="md:w-1/2">
              <Image
                src="https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/5c3412c9-c329-4133-922a-078ab60afa0e/Leonardo_Phoenix_A_stunning_multitiered_cake_designed_with_int_1.jpg" // Updated to the new image URL
                alt="Custom Cake Design"
                width={500}
                height={400}
                className="rounded-2xl shadow-lg" />
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose WKND Cakes?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Premium Ingredients', color: 'bg-yellow-100', icon: '🌿' },
              { title: 'Artisanal Craftsmanship', color: 'bg-pink-100', icon: '👨‍🍳' },
              { title: 'Customizable Designs', color: 'bg-blue-100', icon: '🎨' },
              { title: 'On-Time Delivery', color: 'bg-green-100', icon: '🚚' }
            ].map((feature, index) => (
              <div
                key={index}
                className={`${feature.color} p-8 rounded-xl shadow-md transition-transform hover:scale-105`}>
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-pink-100 bg-opacity-70 backdrop-blur-md shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex justify-end p-4">
          <Button variant="ghost" onClick={toggleSidebar}>
            <X className="h-6 w-6 text-pink-600" />
          </Button>
        </div>
        <nav className="px-4">
          <ul className="space-y-4">
            <li><a href="#" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">Home</a></li>
            <li><a href="#" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">Menu</a></li>
            <li><a href="#" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">Custom Cakes</a></li>
            <li><a href="#" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">About Us</a></li>
            <li><a href="#" className="text-lg font-semibold text-pink-800 hover:text-pink-500 transition-colors">Contact</a></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}