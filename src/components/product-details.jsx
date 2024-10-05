'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Minus, Plus, ShoppingCart, Heart, ArrowLeft
 } from 'lucide-react'
import Link from 'next/link';

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function ProductDetailsComponent() {
  const [quantity, setQuantity] = useState(1)


  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12">
          <Button
          variant="ghost"
          className="absolute top-4 left-4 text-pink-600"// Navigate back to the previous page
        >
         
          <Link href="/" className="flex flex-row"> <ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
          
        </Button>
      <div className="container mx-auto px-3 relative"> {/* Added relative here */}
        {/* Back Button */}
      
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=600&width=600&text=Strawberry+Delight+Cake"
                alt="Strawberry Delight Cake"
                layout="fill"
                objectFit="cover"
                className="w-full h-full object-center" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-md">
                  <Image
                    src={`/placeholder.svg?height=150&width=150&text=Cake+Image+${i}`}
                    alt={`Cake Image ${i}`}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full object-center" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Strawberry Delight Cake</h1>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-yellow-500" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">(128 reviews)</span>
              </div>
            </div>

            <div className="text-2xl font-bold text-gray-900">$49.99</div>

            <p className="text-gray-700">
              Indulge in the perfect blend of sweet and tangy with our Strawberry Delight Cake. 
              Made with fresh strawberries and a light, fluffy sponge, this cake is a true crowd-pleaser.
            </p>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={decrementQuantity}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={incrementQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">
                <Link href="advanced-cart" className="flex flex-row"> <ShoppingCart className="mr-2 h-4 w-4" />Add to Cart</Link>
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex space-x-2">
              <Badge>Fresh</Badge>
              <Badge variant="outline">Bestseller</Badge>
              <Badge variant="outline">Vegetarian</Badge>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <Card>
                  <CardContent className="pt-6">
                    <p>Our Strawberry Delight Cake is a perfect balance of sweetness and tanginess. The light and airy sponge cake is layered with fresh strawberry compote and covered in a delicate strawberry-flavored buttercream. Topped with fresh strawberries, this cake is not only a treat for your taste buds but also a feast for your eyes.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ingredients">
                <Card>
                  <CardContent className="pt-6">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Fresh strawberries</li>
                      <li>Wheat flour</li>
                      <li>Sugar</li>
                      <li>Eggs</li>
                      <li>Butter</li>
                      <li>Baking powder</li>
                      <li>Vanilla extract</li>
                      <li>Heavy cream</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, j) => (
                                <Star
                                  key={j}
                                  className={`h-4 w-4 fill-current ${j < 4 ? 'text-yellow-500' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">John Doe</span>
                          </div>
                          <p className="text-gray-700">This cake was absolutely delicious! The strawberry flavor was perfect and not too sweet. Will definitely order again!</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}