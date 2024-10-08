'use client'

import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SidebarMenu from '@/components/SidebarMenu';
import Image from 'next/image';
import LoginPromptModal from './LoginPromptModal';
import { MessageCircle } from 'lucide-react'; // Add this import at the top of the file

export function Userorder() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  const whatsappNumber = "+1234567890"; // Replace with your actual WhatsApp number

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
    if (email) {
      fetchUserOrders(email);
      fetchMenuItems();
    } else {
      setIsLoginPromptOpen(true);
    }
  }, []);

  const fetchUserOrders = async (email) => {
    const { data, error } = await supabase
      .from('Order')
      .select('*')
      .eq('sid', email);

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data);
    }
  };

  const fetchMenuItems = async () => {
    const { data, error } = await supabase.from('menu').select('*');
    if (error) {
      console.error('Error fetching menu items:', error);
    } else {
      const menuItemsMap = {};
      data.forEach(item => {
        menuItemsMap[item.id] = item;
      });
      setMenuItems(menuItemsMap);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleWhatsAppClick = (orderId) => {
    const message = encodeURIComponent(`Hello, I would like to inquire about my order with ID: ${orderId}`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header toggleSidebar={toggleSidebar} />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-6xl mx-auto shadow-lg">
          <CardHeader className="bg-pink-100 text-pink-800 rounded-t-lg">
            <CardTitle className="text-2xl sm:text-3xl font-bold">Your Orders</CardTitle>
            <CardDescription className="text-pink-700">View and manage your order history</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-r-lg">
              <p className="font-bold mb-2">Note:</p>
              <p>To inquire about an order, click the WhatsApp button next to the order. Please share your order ID when contacting our admin.</p>
            </div>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-pink-50">
                    <TableHead className="font-semibold text-pink-800">Order ID</TableHead>
                    <TableHead className="font-semibold text-pink-800">Total</TableHead>
                    <TableHead className="font-semibold text-pink-800">Date</TableHead>
                    <TableHead className="font-semibold text-pink-800">Status</TableHead>
                    <TableHead className="font-semibold text-pink-800">Items</TableHead>
                    <TableHead className="font-semibold text-pink-800">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-pink-50 transition-colors">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>${order.tprice.toFixed(2)}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                          order.status === 'Processing' ? 'bg-blue-200 text-blue-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {order.status || 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {order.itemidd.map((itemId) => {
                            const menuItem = menuItems[itemId];
                            return menuItem ? (
                              <div key={itemId} className="flex items-center bg-white rounded-full px-2 py-1 text-xs border border-pink-200">
                                <Image
                                  src={menuItem.image}
                                  alt={menuItem.name}
                                  width={20}
                                  height={20}
                                  className="rounded-full mr-1"
                                />
                                {menuItem.name}
                              </div>
                            ) : null;
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleWhatsAppClick(order.id)}
                          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                        >
                          <MessageCircle size={18} /> {/* WhatsApp icon */}
                          <span className="hidden sm:inline">WhatsApp</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <LoginPromptModal isOpen={isLoginPromptOpen} onClose={() => setIsLoginPromptOpen(false)} />
    </div>
  );
}