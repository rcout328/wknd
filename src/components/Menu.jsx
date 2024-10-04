'use client'

import { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from './Header';
import SidebarMenu from './SidebarMenu';
import Footer from './Footer';

const menuCategories = ['All', 'Cakes', 'Cupcakes', 'Pastries', 'Seasonal'];

const menuItems = [
  { id: 1, name: 'Chocolate Delight', category: 'Cakes', price: 35, image: 'https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/3c83e2fd-f499-4960-bc1e-33418257f740/Leonardo_Phoenix_A_beautiful_gourmet_cheesecake_placed_on_an_e_2.jpg', description: 'Rich chocolate cake with ganache', popular: true },
  { id: 2, name: 'Vanilla Dream', category: 'Cakes', price: 30, image: 'https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/027d40d2-1cf7-4389-863e-121998db024e/Leonardo_Phoenix_A_beautiful_gourmet_chocolatey_caked_placed_o_1.jpg', description: 'Light and fluffy vanilla sponge' },
  { id: 3, name: 'Red Velvet', category: 'Cupcakes', price: 3.5, image: 'https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/432cd102-61e8-4eaf-a97e-74299a084d05/Leonardo_Phoenix_A_beautiful_gourmem_strawberry_caked_placed_o_0.jpg', description: 'Classic red velvet with cream cheese frosting' },
  { id: 4, name: 'Lemon Tart', category: 'Pastries', price: 4, image: 'https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/281e2dc7-9a3b-47c9-bca4-e87b1743e6dc/Leonardo_Phoenix_A_beautiful_gourmet_waffle_caked_placed_on_an_0.jpg', description: 'Tangy lemon curd in a buttery crust' },
  { id: 5, name: 'Pumpkin Spice', category: 'Seasonal', price: 4.5, image: 'https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/5c3412c9-c329-4133-922a-078ab60afa0e/Leonardo_Phoenix_A_stunning_multitiered_cake_designed_with_int_1.jpg', description: 'Fall favorite with warm spices', seasonal: true },
  { id: 6, name: 'Strawberry Shortcake', category: 'Cakes', price: 32, image: 'https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/432cd102-61e8-4eaf-a97e-74299a084d05/Leonardo_Phoenix_A_beautiful_gourmem_strawberry_caked_placed_o_0.jpg', description: 'Fresh strawberries and whipped cream' },
  { id: 7, name: 'Blueberry Muffin', category: 'Pastries', price: 2.5, image: 'https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/281e2dc7-9a3b-47c9-bca4-e87b1743e6dc/Leonardo_Phoenix_A_beautiful_gourmet_waffle_caked_placed_on_an_0.jpg', description: 'Bursting with juicy blueberries' },
  { id: 8, name: 'Caramel Macchiato', category: 'Cupcakes', price: 3.75, image: 'https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/432cd102-61e8-4eaf-a97e-74299a084d05/Leonardo_Phoenix_A_beautiful_gourmem_strawberry_caked_placed_o_0.jpg', description: 'Coffee-infused cake with caramel drizzle' },
  { id: 9, name: 'Apple Pie', category: 'Seasonal', price: 18, image: 'https://cdn.leonardo.ai/users/326f8494-f765-49cb-a889-d303538d931e/generations/5c3412c9-c329-4133-922a-078ab60afa0e/Leonardo_Phoenix_A_stunning_multitiered_cake_designed_with_int_1.jpg', description: 'Classic apple pie with a flaky crust', seasonal: true },
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredItems = menuItems.filter(item => 
    (activeCategory === 'All' || item.category === activeCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (itemId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prevCart, { id: itemId, quantity: 1 }];
      }
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header toggleSidebar={toggleSidebar} />
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="container mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold text-center mb-12">Our Delightful Menu</h1>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <ScrollArea className="w-full md:w-auto">
            <Tabs defaultValue="All" className="w-full md:w-auto">
              <TabsList>
                {menuCategories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    onClick={() => setActiveCategory(category)}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </ScrollArea>
          <div className="w-full md:w-64">
            <Input
              type="search"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative">
                <Image
                  src={item.image} // Use the actual image URL from the array
                  alt={item.name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105" />
                {(item.popular || item.seasonal) && (
                  <div className="absolute top-2 left-2 space-x-2">
                    {item.popular && <Badge className="bg-yellow-400 text-yellow-900">Popular</Badge>}
                    {item.seasonal && <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 border-green-300">Seasonal</Badge>}
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <span className="text-lg font-bold text-pink-500">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button
                  size="sm"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={() => addToCart(item.id)}>
                  Add to Cart
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Menu;