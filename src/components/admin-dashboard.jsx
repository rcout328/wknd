'use client'

import { useState, useEffect } from 'react';
import { MoreHorizontal, Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient"; // Import the Supabase client
import { Label } from './ui/label';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

// Mock data for orders
const orders = [
  { id: 1, customer: "John Doe", date: "2023-05-01", status: "Completed", total: 59.99 },
  { id: 2, customer: "Jane Smith", date: "2023-05-02", status: "Processing", total: 79.99 },
  { id: 3, customer: "Bob Johnson", date: "2023-05-03", status: "Pending", total: 49.99 },
];

export function AdminDashboardComponent() {
  const [activeTab, setActiveTab] = useState("orders");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]); // State to hold menu items

  // State for edit form fields
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editCat, setEditCat] = useState('');
  const [editPrice, setEditPrice] = useState(0);

  // Fetch menu items from Supabase
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

  useEffect(() => {
    fetchMenuItems(); // Call the fetch function on component mount
  }, []);

  const handleAdd = () => {
    setEditName('');
    setEditDesc('');
    setEditImage('');
    setEditCat('');
    setEditPrice(0);
    setIsAddDialogOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditName(item.name);
    setEditDesc(item.desc);
    setEditImage(item.image);
    setEditCat(item.cat);
    setEditPrice(item.Price);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('menu')
      .delete()
      .eq('id', id); // Delete the item with the specified ID

    if (error) {
      console.error('Error deleting menu item:', error);
    } else {
      console.log('Menu item deleted successfully');
      fetchMenuItems(); // Refetch the menu items to update the UI
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('menu')
      .update({
        name: editName,
        desc: editDesc,
        image: editImage,
        cat: editCat,
        Price: editPrice,
      })
      .eq('id', selectedItem.id);

    if (error) {
      console.error('Error updating menu item:', error);
    } else {
      console.log('Menu item updated successfully');
      setIsEditDialogOpen(false);
      fetchMenuItems();
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('menu')
      .insert({
        name: editName,
        desc: editDesc,
        image: editImage,
        cat: editCat,
        Price: editPrice,
      });

    if (error) {
      console.error('Error adding menu item:', error);
    } else {
      console.log('Menu item added successfully');
      setIsAddDialogOpen(false);
      fetchMenuItems();
      // Reset form fields
      setEditName('');
      setEditDesc('');
      setEditImage('');
      setEditCat('');
      setEditPrice(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail'); // Clear email from local storage
    window.location.href = '/login-register'; // Redirect to login page
  };

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
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.desc}</TableCell>
            <TableCell>
              <Image src={item.image} alt={item.name} width={50} height={50} className="object-cover" />
            </TableCell>
            <TableCell>{item.cat}</TableCell>
            <TableCell>${item.Price ? item.Price.toFixed(2) : 'N/A'}</TableCell>
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
                  <DropdownMenuItem onClick={() => handleDelete(item.id)}> {/* Call handleDelete here */}
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <Button onClick={handleLogout} className="mb-4 bg-red-500 hover:bg-red-600 text-white">
        Logout
      </Button>
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
              {renderTable(menuItems, ["Name", "Desc", "Image", "Cat", "Price"])} {/* Updated to show menu items */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the details for the selected menu item.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="edit-desc">Description</Label>
              <Input id="edit-desc" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="edit-image">Image URL</Label>
              <Input id="edit-image" value={editImage} onChange={(e) => setEditImage(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="edit-cat">Category</Label>
              <Input id="edit-cat" value={editCat} onChange={(e) => setEditCat(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="edit-price">Price</Label>
              <Input id="edit-price" type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(parseFloat(e.target.value))} />
            </div>
            <DialogFooter>
              <Button type="submit">Update Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>
              Fill in the details for the new menu item.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddItem}>
            <div>
              <Label htmlFor="add-name">Name</Label>
              <Input id="add-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="add-desc">Description</Label>
              <Input id="add-desc" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="add-image">Image URL</Label>
              <Input id="add-image" value={editImage} onChange={(e) => setEditImage(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="add-cat">Category</Label>
              <Input id="add-cat" value={editCat} onChange={(e) => setEditCat(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="add-price">Price</Label>
              <Input id="add-price" type="number" step="0.01" value={editPrice} onChange={(e) => setEditPrice(parseFloat(e.target.value))} />
            </div>
            <DialogFooter>
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}