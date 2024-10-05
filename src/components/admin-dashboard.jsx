'use client'

import { useState } from 'react'
import { MoreHorizontal, Plus, Pencil, Trash2 } from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const orders = [
  { id: 1, customer: "John Doe", date: "2023-05-01", status: "Completed", total: 59.99 },
  { id: 2, customer: "Jane Smith", date: "2023-05-02", status: "Processing", total: 79.99 },
  { id: 3, customer: "Bob Johnson", date: "2023-05-03", status: "Pending", total: 49.99 },
]

const menuItems = [
  { id: 1, name: "Chocolate Delight", category: "Cakes", price: 35.99 },
  { id: 2, name: "Strawberry Dream", category: "Cakes", price: 39.99 },
  { id: 3, name: "Vanilla Bliss", category: "Cupcakes", price: 24.99 },
]

export function AdminDashboardComponent() {
  const [activeTab, setActiveTab] = useState("orders")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const handleAdd = () => {
    setIsAddDialogOpen(true)
  }

  const handleEdit = (item) => {
    setSelectedItem(item)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log(`Delete item with id: ${id}`)
  }

  const renderTable = (items, columns) => (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index}>{column}</TableHead>
          ))}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            {columns.map((column, index) => (
              <TableCell key={index}>{item[column.toLowerCase()]}</TableCell>
            ))}
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleEdit(item)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    (<div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">WKND Admin Dashboard</CardTitle>
          <CardDescription>Manage orders and menu items</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="menu">Menu</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Order Information</h2>
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" /> Add Order
                </Button>
              </div>
              {renderTable(orders, ["ID", "Customer", "Date", "Status", "Total"])}
            </TabsContent>
            <TabsContent value="menu" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Menu Items</h2>
                <Button onClick={handleAdd}>
                  <Plus className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>
              {renderTable(menuItems, ["ID", "Name", "Category", "Price"])}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {activeTab === "orders" ? "Order" : "Menu Item"}</DialogTitle>
            <DialogDescription>
              Enter the details for the new {activeTab === "orders" ? "order" : "menu item"}.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            {activeTab === "orders" ? (
              <>
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <Input id="customer" />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input id="status" />
                </div>
                <div>
                  <Label htmlFor="total">Total</Label>
                  <Input id="total" type="number" step="0.01" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" step="0.01" />
                </div>
              </>
            )}
          </form>
          <DialogFooter>
            <Button type="submit">Add {activeTab === "orders" ? "Order" : "Item"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {activeTab === "orders" ? "Order" : "Menu Item"}</DialogTitle>
            <DialogDescription>
              Update the details for the selected {activeTab === "orders" ? "order" : "menu item"}.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            {activeTab === "orders" ? (
              <>
                <div>
                  <Label htmlFor="edit-customer">Customer</Label>
                  <Input id="edit-customer" defaultValue={selectedItem?.customer} />
                </div>
                <div>
                  <Label htmlFor="edit-date">Date</Label>
                  <Input id="edit-date" type="date" defaultValue={selectedItem?.date} />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Input id="edit-status" defaultValue={selectedItem?.status} />
                </div>
                <div>
                  <Label htmlFor="edit-total">Total</Label>
                  <Input
                    id="edit-total"
                    type="number"
                    step="0.01"
                    defaultValue={selectedItem?.total} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input id="edit-name" defaultValue={selectedItem?.name} />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Input id="edit-category" defaultValue={selectedItem?.category} />
                </div>
                <div>
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    defaultValue={selectedItem?.price} />
                </div>
              </>
            )}
          </form>
          <DialogFooter>
            <Button type="submit">Update {activeTab === "orders" ? "Order" : "Item"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>)
  );
}