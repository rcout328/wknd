'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import Image from 'next/image'
import { useSearchParams } from 'next/navigation';
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from 'next/link'

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  postalCode: z.string().min(5, { message: "Postal code must be at least 5 characters." }),
  deliveryDate: z.date({
    required_error: "Delivery date is required.",
  }),
  deliveryTime: z.string({
    required_error: "Please select a delivery time.",
  }),
  paymentMethod: z.enum(["credit", "debit", "paypal"], {
    required_error: "Please select a payment method.",
  }),
  specialInstructions: z.string().optional(),
})

export function OrderConfirmationFormComponent() {
  const [date, setDate] = useState()
  const [orderItems, setOrderItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id) => {
    // Fetch order details
    const { data: orderData, error: orderError } = await supabase
      .from('Order')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) {
      console.error('Error fetching order details:', orderError);
      return;
    }

    setTotalPrice(orderData.tprice);

    // Fetch order items
    const { data: itemsData, error: itemsError } = await supabase
      .from('Order')
      .select('itemid, quen')
      .eq('id', id);

    if (itemsError) {
      console.error('Error fetching order items:', itemsError);
      return;
    }

    // Fetch menu items for each order item
    const menuItemPromises = itemsData.map(item => 
      supabase
        .from('menu')
        .select('*')
        .eq('id', item.itemid)
        .single()
    );

    const menuItemsResults = await Promise.all(menuItemPromises);
    const menuItems = menuItemsResults.map(result => result.data);

    // Combine order items with menu items
    const combinedItems = itemsData.map((item, index) => ({
      ...item,
      ...menuItems[index],
      totalPrice: item.quen * menuItems[index].Price
    }));

    setOrderItems(combinedItems);
  };

  const onSubmit = (data) => {
    console.log(data)
    // Here you would typically send the data to your server
    alert("Order submitted successfully!")
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 relative">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="absolute top-4 left-4 text-pink-600"
        >
         
          <Link href="/advanced-cart" className="flex flex-row"> <ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
        </Button>
        
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-pink-600">Order Confirmation</CardTitle>
            <CardDescription className="text-center">Please review your order and fill in your details to confirm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Order Details</h3>
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center mb-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md mr-4" />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quen}</p>
                      <p className="text-sm text-gray-600">${item.Price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Delivery Information</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" {...register("fullName")} />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register("phone")} />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" {...register("address")} />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" {...register("city")} />
                      {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" {...register("postalCode")} />
                      {errors.postalCode && <p className="text-red-500 text-sm">{errors.postalCode.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(newDate) => {
                            setDate(newDate)
                            setValue("deliveryDate", newDate)
                          }}
                          initialFocus />
                      </PopoverContent>
                    </Popover>
                    {errors.deliveryDate && <p className="text-red-500 text-sm">{errors.deliveryDate.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">Delivery Time</Label>
                    <Select onValueChange={(value) => setValue("deliveryTime", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select delivery time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                        <SelectItem value="evening">Evening (5PM - 9PM)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.deliveryTime && <p className="text-red-500 text-sm">{errors.deliveryTime.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <RadioGroup onValueChange={(value) => setValue("paymentMethod", value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit" id="credit" />
                        <Label htmlFor="credit">Credit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="debit" id="debit" />
                        <Label htmlFor="debit">Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                    </RadioGroup>
                    {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                    <Textarea id="specialInstructions" {...register("specialInstructions")} />
                  </div>
                  <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                    Confirm Order
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}