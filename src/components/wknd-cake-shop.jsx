'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, ShoppingBag, ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link'; // Import Link from next/link

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from './Footer';
import Header from './Header';
import SidebarMenu from './SidebarMenu';
import { supabase } from "@/lib/supabaseClient"; // Import the Supabase client

const menuCategories = ['All', 'Cakes', 'Cupcakes', 'Pastries', 'Seasonal'];

function WkndCakeShop() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]); // State to hold menu items
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Check for user email in local storage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setIsLoggedIn(true); // User is logged in
      console.log('Current logged in user email:', storedEmail); // Log the email to the console
    } else {
      console.log('User is not logged in');
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Fetch menu items from Supabase
  useEffect(() => {
    const fetchMenuItems = async () => {
      const { data, error } = await supabase
        .from('menu') // Table name
        .select('*'); // Columns to fetch

      if (error) {
        console.error('Error fetching menu items:', error);
      } else {
        console.log('Fetched menu items:', data); // Log the fetched data
        setMenuItems(data); // Set the fetched data to state
      }
    };

    fetchMenuItems();
  }, []);

  // Function to handle adding item to cart
  const handleAddToCart = async (itemId) => {
    const storedEmail = localStorage.getItem('userEmail');
    if (!storedEmail) {
      alert('You must be logged in to order items.');
      return;
    }

    // Insert the item into the Cart table
    const { error: insertError } = await supabase
      .from('Cart')
      .insert([
        { item_id: itemId, sid: storedEmail }
      ]);

    if (insertError) {
      console.error('Error adding item to cart:', insertError);
      alert('Failed to add item to cart. Please try again.');
    } else {
      console.log('Item added to cart successfully');
      alert('Item added to cart successfully!');
    }
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
              <Link href="/product-details">
                <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white w-full">
                  Order Now
                </Button>
              </Link>
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
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {menuCategories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
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
                    <Button className="w-full" onClick={() => handleAddToCart(item.id)}>Order Now</Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            {/* Add similar TabsContent for other categories */}
            {menuCategories.slice(1).map((category) => (
              <TabsContent key={category} value={category} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {menuItems.filter(item => item.cat === category).map((item) => (
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
                      <Button className="w-full" onClick={() => handleAddToCart(item.id)}>Order Now</Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </section>
        <section className="mb-24">
          <div className="bg-pink-100 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-8">
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
                src="https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/5c3412c9-c329-4133-922a-078ab60afa0e/Leonardo_Phoenix_A_stunning_multitiered_cake_designed_with_int_1.jpg"
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
    </div>
  );
}

export default WkndCakeShop;