'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Minus, Plus, X, ShoppingBag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';

// Dynamically import components that might cause server-side rendering issues
const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const SidebarMenu = dynamic(() => import('./SidebarMenu'), { ssr: false });

export function AdvancedCartComponent() {
  const [cartItems, setCartItems] = useState([]);
  const { toast } = useToast();
  const { userEmail } = useUser();
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (userEmail) {
      fetchCartItems(userEmail);
    }
  }, [userEmail]);

  const fetchCartItems = async (userEmail) => {
    // Fetch cart items
    const { data: cartData, error: cartError } = await supabase
      .from('Cart')
      .select('item_id')
      .eq('sid', userEmail);

    if (cartError) {
      console.error('Error fetching cart items:', cartError);
      return;
    }

    if (cartData && cartData.length > 0) {
      const itemIds = cartData.map(item => item.item_id);

      // Fetch menu items for the cart items
      const { data: menuItems, error: menuError } = await supabase
        .from('menu')
        .select('*')
        .in('id', itemIds);

      if (menuError) {
        console.error('Error fetching menu items:', menuError);
        return;
      }

      const combinedItems = menuItems.map(menuItem => ({
        ...menuItem,
        quantity: 1 // Default quantity, you might want to adjust this
      }));

      setCartItems(combinedItems);
      calculateTotalPrice(combinedItems);
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => sum + item.Price * item.quantity, 0);
    setTotalPrice(total);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    calculateTotalPrice(updatedItems);
  };

  const removeItem = async (itemId) => {
    const { error } = await supabase
      .from('Cart')
      .delete()
      .eq('item_id', itemId)
      .eq('sid', userEmail);

    if (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    } else {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems);
    }
  };

  const handleCheckout = async () => {
    if (!userEmail || cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty or you are not logged in.",
        variant: "destructive",
      });
      return;
    }

    // Fetch the cart items again to get the correct item_id from the Cart table
    const { data: cartData, error: cartError } = await supabase
      .from('Cart')
      .select('item_id')
      .eq('sid', userEmail);

    if (cartError) {
      console.error('Error fetching cart items:', cartError);
      toast({
        title: "Error",
        description: "Failed to fetch cart items. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Create a single order entry with all item IDs and quantities as arrays
    const orderEntry = {
      sid: userEmail,
      tprice: totalPrice,
      itemidd: cartData.map(item => item.item_id), 
      quen: cartItems.map(item => item.quantity) // Store quantities as an array of integers
    };

  
    const { data: orderData, error: orderError } = await supabase
      .from('Order')
      .insert([orderEntry])
      .select();

    if (orderError) {
      console.error('Error creating order:', orderError);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    } else {
      setOrderId(orderData[0].id);
      // Clear the cart after successful order creation
      await supabase
        .from('Cart')
        .delete()
        .eq('sid', userEmail);
      // Redirect to order confirmation form with order ID
      window.location.href = `/order-confirmation-form?orderId=${orderData[0].id}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header />
      <SidebarMenu />
      <main className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Your Sweet Cart</h1>
        
        <div className="flex flex-row lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <Card>
              <CardContent className="p-6">
                <AnimatePresence>
                  {cartItems.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8">
                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-xl text-gray-600">Your cart is empty</p>
                    </motion.div>
                  ) : (
                    cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center py-4">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="rounded-lg" />
                        <div className="ml-4 flex-grow">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-gray-600">${item.Price.toFixed(2)} x {item.quantity} = ${(item.Price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-4"
                          onClick={() => removeItem(item.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>

            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Free Shipping!</AlertTitle>
              <AlertDescription>
                Orders over $100 qualify for free standard shipping.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default dynamic(() => Promise.resolve(AdvancedCartComponent), { ssr: false });