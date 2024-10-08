'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Minus, Plus, X, ShoppingBag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import LoginPromptModal from './LoginPromptModal';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const SidebarMenu = dynamic(() => import('./SidebarMenu'), { ssr: false });

export function AdvancedCartComponent() {
  const [cartItems, setCartItems] = useState([]);
  const { toast } = useToast();
  const { userEmail } = useUser();
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [isCheckoutClicked, setIsCheckoutClicked] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (userEmail) {
      fetchCartItems(userEmail);
    } else {
      const localCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(localCartItems);
      calculateTotalPrice(localCartItems);
    }
  }, [userEmail]);

  const fetchCartItems = async (userEmail) => {
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
        quantity: 1
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

    if (!userEmail) {
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    }
  };

  const removeItem = async (itemId) => {
    if (userEmail) {
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
    } else {
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      calculateTotalPrice(updatedItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    }
  };

  const handleCheckout = async () => {
    if (!userEmail) {
      setIsLoginPromptOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty.",
        variant: "destructive",
      });
      return;
    }

    if (isCheckoutClicked) {
      return;
    }

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

    const orderEntry = {
      sid: userEmail,
      tprice: totalPrice,
      itemidd: cartData.map(item => item.item_id), 
      quen: cartItems.map(item => item.quantity)
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
      const { error: deleteError } = await supabase
        .from('Cart')
        .delete()
        .eq('sid', userEmail)
        .in('item_id', cartData.map(item => item.item_id));

      if (deleteError) {
        console.error('Error removing items from cart:', deleteError);
        toast({
          title: "Warning",
          description: "Order created, but failed to clear cart. Please clear manually.",
          variant: "warning",
        });
      } else {
        console.log('Cart cleared successfully');
      }

      setOrderId(orderData[0].id);
      setIsCheckoutClicked(true);
      setCartItems([]);
      setTotalPrice(0);
      toast({
        title: "Success",
        description: "Order created successfully. Click 'Order Confirmation' to proceed.",
        variant: "success",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header toggleSidebar={toggleSidebar} />
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">Your Sweet Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3">
            <Card>
              <CardContent className="p-4 sm:p-6">
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
                        className="flex flex-col sm:flex-row items-center py-4 border-b last:border-b-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg mb-4 sm:mb-0 sm:mr-4" />
                        <div className="flex-grow text-center sm:text-left mb-4 sm:mb-0">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-gray-600">${item.Price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1">
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="mx-2 w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-4 text-red-500 hover:text-red-700"
                            onClick={() => removeItem(item.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                {isCheckoutClicked && orderId ? (
                  <Link href={`/order-confirmation-form/${orderId}`} passHref>
                    <Button 
                      className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white"
                    >
                      Order Confirmation
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                )}
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
        <LoginPromptModal 
          isOpen={isLoginPromptOpen} 
          onClose={() => setIsLoginPromptOpen(false)}
          onLogin={() => {
            setIsLoginPromptOpen(false);
            // Redirect to login page or show login form
            router.push('/login-register');
          }}
        />
      </main>
      <Footer />
    </div>
  );
}

export default dynamic(() => Promise.resolve(AdvancedCartComponent), { ssr: false });