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

export function Userorder() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const whatsappNumber = "+1234567890"; // Replace with your actual WhatsApp number

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    setUserEmail(email);
    if (email) {
      fetchUserOrders(email);
      fetchMenuItems();
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
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <main className="flex-grow">
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
          <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Your Orders</CardTitle>
              <CardDescription>View your order history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                <p className="font-bold">Note:</p>
                <p>To inquire about an order, please click the WhatsApp button next to the order. Remember to share your order ID first when contacting our admin.</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Special Instructions</TableHead>
                    <TableHead>Delivery Time</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>${order.tprice.toFixed(2)}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{order.cname}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell>{order.address}</TableCell>
                      <TableCell>{order.deliverydate}</TableCell>
                      <TableCell>{order.pmethod}</TableCell>
                      <TableCell>{order.specialinstructions}</TableCell>
                      <TableCell>{order.deliverytime}</TableCell>
                      <TableCell>
                        {order.itemidd.map((itemId, index) => {
                          const menuItem = menuItems[itemId];
                          return (
                            <div key={itemId} className="flex items-center space-x-2 mb-2">
                              {menuItem && menuItem.image && (
                                <Image
                                  src={menuItem.image}
                                  alt={menuItem ? menuItem.name : 'Unknown Item'}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              )}
                              <span>
                                {menuItem ? menuItem.name : 'Unknown Item'}: {order.quen[index]}
                              </span>
                            </div>
                          );
                        })}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleWhatsAppClick(order.id)}>
                          WhatsApp
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
}