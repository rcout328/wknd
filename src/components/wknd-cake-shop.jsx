'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, ShoppingBag, ChevronRight, Menu, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from './Footer';
import Header from './Header';
import SidebarMenu from './SidebarMenu';
import { supabase } from "@/lib/supabaseClient";
import { ScrollArea } from './ui/scroll-area';



function WkndCakeShop() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch menu items from Supabase
  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data, error } = await supabase
        .from('menu')
        .select('*');

      if (error) {
        console.error('Error fetching menu items:', error);
      } else {
        console.log('Fetched menu items:', data);
        setMenuItems(data);
      }
    };

    fetchMenuItems();
  }, []);

  const handleSwiggyOrder = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header toggleSidebar={toggleSidebar} />
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="container mx-auto px-4 py-8">
        <section className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
          <div className="md:w-1/2 space-y-8">
            <h1 className="text-6xl font-bold text-gray-800 leading-tight">
              Indulge in <span className="text-pink-500">Heavenly</span> Cakes
            </h1>
            <p className="text-xl text-gray-600">
              Experience the magic of our handcrafted cakes, baked with love and the finest ingredients. Perfect for any occasion or just because you deserve a treat!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/menu" passHref>
                <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white w-full">
                  Order Now
                </Button>
              </Link>
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                onClick={() => handleSwiggyOrder('https://www.swiggy.com/menu/967811?source=sharing')}
              >
                Order on Swiggy
              </Button>
            </div>
            <Link href="/about-us" passHref>
              <Button
                size="lg"
                variant="outline"
                className="text-pink-500 border-pink-500 hover:bg-pink-50 w-full mt-4">
                Our Story
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end relative">
            <Image
              src="https://cdn.igp.com/f_auto,q_auto,t_pnopt19prodlp/products/p-classic-red-velvet-cake-half-kg--109230-m.jpg"
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
          <Tabs defaultValue="All" className="w-full">
          
            <TabsContent value="All" className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {menuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover" />
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4">{item.desc}</p>
                    <div className="flex flex-row mb-4">
                      <p className="text-gray-600">₹</p>
                      <p className="text-gray-600">{item.Price}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => handleSwiggyOrder(item.swiggielink)}>
                        Order on Swiggy
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default WkndCakeShop;