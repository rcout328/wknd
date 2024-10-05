'use client';
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Minus, Plus, X, ShoppingBag, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from '@/hooks/use-toast';
import Header from "@/components/Header"; // Adjust the path as necessary
import Footer from "@/components/Footer"; // Adjust the path as necessary
import SidebarMenu from './SidebarMenu';
import Link from 'next/link';
const shippingOptions = [
  { id: 'standard', name: 'Standard Shipping', price: 5, days: '3-5' },
  { id: 'express', name: 'Express Shipping', price: 15, days: '1-2' },
  { id: 'pickup', name: 'Local Pickup', price: 0, days: '1' },
]

export function AdvancedCartComponent() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Chocolate Delight", price: 35, quantity: 1, image: "/placeholder.svg?height=100&width=100&text=Chocolate+Cake" },
    { id: 2, name: "Strawberry Dream", price: 40, quantity: 2, image: "/placeholder.svg?height=100&width=100&text=Strawberry+Cake" },
    { id: 3, name: "Vanilla Bliss", price: 30, quantity: 1, image: "/placeholder.svg?height=100&width=100&text=Vanilla+Cake" },
  ])
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [shipping, setShipping] = useState(shippingOptions[0])
  const { toast } = useToast()

  const updateQuantity = (id, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item))
  }

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'sweet10') {
      setDiscount(10)
      toast({
        title: "Coupon Applied",
        description: "You've received a 10% discount!",
      })
    } else {
      setDiscount(0)
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      })
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = (subtotal * discount) / 100
  const shippingCost = shipping.price
  const tax = (subtotal - discountAmount) * 0.1 // Assuming 10% tax
  const total = subtotal - discountAmount + shippingCost + tax

  useEffect(() => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Your cart is empty. Add some delicious cakes!",
        variant: "destructive",
      })
    }
  }, [cartItems])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header />
      <SidebarMenu />
      <main className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">Your Sweet Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
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
                          <p className="text-gray-600">${item.price.toFixed(2)}</p>
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
                <h3 className="text-xl font-semibold mb-4">Shipping Options</h3>
                <RadioGroup
                  defaultValue={shipping.id}
                  onValueChange={(value) => setShipping(shippingOptions.find(option => option.id === value))}>
                  {shippingOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id}>
                        {option.name} - ${option.price.toFixed(2)} ({option.days} business days)
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:w-1/3">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Label htmlFor="coupon">Coupon Code</Label>
                  <div className="flex mt-1">
                    <Input
                      id="coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-grow" />
                    <Button onClick={applyCoupon} className="ml-2">
                      Apply
                    </Button>
                  </div>
                </div>
                <Button 
                    className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white"
                >
                    <Link href="/order-confirmation">Proceed to Checkout</Link> {/* Ensure this points to the correct route */}
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