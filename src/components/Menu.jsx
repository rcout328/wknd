'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabaseClient"; // Import the Supabase client
import Header from './Header';
import SidebarMenu from './SidebarMenu';
import Footer from './Footer';
import LoginPromptModal from './LoginPromptModal'; // Import the modal

const menuCategories = ['All', 'Cupcake', 'Browniee', 'CheesCake', 'Swiss Roll', 'Bundtt Cake', 'Bomboloni',
  'Muffins'
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]); // State to hold menu items
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false); // We'll keep this for now, but won't use it

  // Add this function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

  // Check for user email in local storage on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setIsLoggedIn(true);
      console.log('Current logged in user email:', storedEmail);
    } else {
      console.log('User is not logged in');
    }
  }, []);

  const filteredItems = menuItems.filter(item => 
    (activeCategory === 'All' || item.cat === activeCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header toggleSidebar={toggleSidebar} />
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Our Delightful Menu</h1>

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
                  <span className="text-lg font-bold text-pink-500">₹{item.Price.toFixed(2)}</span>
                </div>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => window.open(item.swiggielink, '_blank')}>
                    Order on Swiggy
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
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