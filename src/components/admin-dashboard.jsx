'use client'

import { useState, useEffect } from 'react';
import { MoreHorizontal, Plus, Pencil, Trash2, LogOut } from 'lucide-react';
import { supabase } from "@/lib/supabaseClient"; // Import the Supabase client
import { Label } from './ui/label';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from './ui/textarea';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AdminDashboardComponent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);
  const [isEditOrderDialogOpen, setIsEditOrderDialogOpen] = useState(false);
  const [isAddMenuDialogOpen, setIsAddMenuDialogOpen] = useState(false);
  const [isEditMenuDialogOpen, setIsEditMenuDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // State for order form fields
  const [orderFields, setOrderFields] = useState({
    sid: '',
    totalPrice: 0,
    customerName: '',
    phone: '',
    address: '',
    deliveryDate: '',
    paymentMethod: '',
    specialInstructions: '',
    deliveryTime: '',
    itemIds: [],
    quantities: []
  });

  // State for menu form fields
  const [menuFields, setMenuFields] = useState({
    name: '',
    desc: '',
    image: '',
    cat: '',
    price: 0
  });

  // Add this new state to manage selected items
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const checkAdminStatus = () => {
      const storedEmail = localStorage.getItem('userEmail');
      if (storedEmail === 'admin123@gmail.com') {
        setIsAdmin(true);
        console.log('Admin logged in:', storedEmail);
      } else {
        setIsAdmin(false);
        console.log('User is not an admin');
      }
    };

    checkAdminStatus();
    if (isAdmin) {
      fetchOrders();
      fetchMenuItems();
    }
  }, [isAdmin]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('Order')
      .select('*'); // Fetch all columns from the Order table

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      console.log('Fetched orders:', data);
      setOrders(data); // Set the fetched data to state
    }
  };

  const fetchMenuItems = async () => {
    const { data, error } = await supabase.from('menu').select('*');
    if (error) {
      console.error('Error fetching menu items:', error);
    } else {
      console.log('Fetched menu items:', data);
      setMenuItems(data);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    
    // Fetch item details from menu based on item_ids in the cart
    const selectedItemsWithDetails = order.itemidd.map((id, index) => {
      const menuItem = menuItems.find(item => item.id === id);
      return {
        id: id,
        name: menuItem ? menuItem.name : 'Unknown Item',
        price: menuItem ? menuItem.Price : 0,
        quantity: order.quen[index]
      };
    });

    setSelectedItems(selectedItemsWithDetails);
    setOrderFields({
      sid: order.sid,
      totalPrice: order.tprice,
      customerName: order.cname,
      phone: order.phone,
      address: order.address,
      deliveryDate: order.deliverydate,
      paymentMethod: order.pmethod,
      specialInstructions: order.specialinstructions,
      deliveryTime: order.deliverytime,
      itemIds: order.itemidd,
      quantities: order.quen
    });
    setIsEditOrderDialogOpen(true);
  };

  const handleDeleteOrder = async (id) => {
    const { error } = await supabase.from('Order').delete().eq('id', id);
    if (error) {
      console.error('Error deleting order:', error);
    } else {
      console.log('Order deleted successfully');
      fetchOrders(); // Refetch the orders to update the UI
    }
  };

  // Add this new function to handle item selection
  const handleItemSelection = (e) => {
    const selectedItemId = e.target.value;
    const selectedItem = menuItems.find(item => item.id === selectedItemId);
    if (selectedItem && !selectedItems.some(item => item.id === selectedItemId)) {
      setSelectedItems([...selectedItems, { id: selectedItemId, name: selectedItem.name, price: selectedItem.Price, quantity: 1 }]);
    }
  };

  // Modify handleQuantityChange to work for both add and edit forms
  const handleQuantityChange = (id, change) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };

  // Add this function to remove an item
  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  // Modify handleUpdateOrder
  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    const updatedOrderFields = {
      ...orderFields,
      itemIds: selectedItems.map(item => item.id),
      quantities: selectedItems.map(item => item.quantity),
      totalPrice: selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    };
    const { error } = await supabase
      .from('Order')
      .update({
        sid: updatedOrderFields.sid,
        tprice: updatedOrderFields.totalPrice,
        cname: updatedOrderFields.customerName,
        phone: updatedOrderFields.phone,
        address: updatedOrderFields.address,
        deliverydate: updatedOrderFields.deliveryDate,
        pmethod: updatedOrderFields.paymentMethod,
        specialinstructions: updatedOrderFields.specialInstructions,
        deliverytime: updatedOrderFields.deliveryTime,
        itemidd: updatedOrderFields.itemIds,
        quen: updatedOrderFields.quantities,
      })
      .eq('id', selectedOrder.id);

    if (error) {
      console.error('Error updating order:', error);
    } else {
      console.log('Order updated successfully');
      setIsEditOrderDialogOpen(false);
      fetchOrders();
    }
  };

  const handleAddMenuItem = () => {
    setMenuFields({
      name: '',
      desc: '',
      image: '',
      cat: '',
      price: 0
    });
    setIsAddMenuDialogOpen(true);
  };

  const handleEditMenuItem = (item) => {
    setSelectedMenuItem(item);
    setMenuFields({
      name: item.name,
      desc: item.desc,
      image: item.image,
      cat: item.cat,
      price: item.Price
    });
    setIsEditMenuDialogOpen(true);
  };

  const handleDeleteMenuItem = async (id) => {
    const { error } = await supabase.from('menu').delete().eq('id', id);
    if (error) {
      console.error('Error deleting menu item:', error);
    } else {
      console.log('Menu item deleted successfully');
      fetchMenuItems();
    }
  };

  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('menu')
      .update({
        name: menuFields.name,
        desc: menuFields.desc,
        image: menuFields.image,
        cat: menuFields.cat,
        Price: menuFields.price,
      })
      .eq('id', selectedMenuItem.id);

    if (error) {
      console.error('Error updating menu item:', error);
    } else {
      console.log('Menu item updated successfully');
      setIsEditMenuDialogOpen(false);
      fetchMenuItems();
    }
  };

  const handleAddNewMenuItem = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('menu')
      .insert({
        name: menuFields.name,
        desc: menuFields.desc,
        image: menuFields.image,
        cat: menuFields.cat,
        Price: menuFields.price,
      });

    if (error) {
      console.error('Error adding menu item:', error);
    } else {
      console.log('Menu item added successfully');
      setIsAddMenuDialogOpen(false);
      fetchMenuItems();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail'); // Remove the email from localStorage
    setIsAdmin(false); // Update the admin state
    // The redirection will be handled by the Link component
  };

  const handleAddItemToOrder = async () => {
    if (!selectedItemId) {
      toast({
        title: "Error",
        description: "Please select an item to add.",
        variant: "destructive",
      });
      return;
    }

    const { data: orderData, error: orderError } = await supabase
      .from('Order')
      .select('itemidd, quen')
      .eq('id', selectedOrder.id)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      return;
    }

    // Update itemidd and quen arrays
    const updatedItemidd = [...orderData.itemidd, selectedItemId];
    const updatedQuen = [...orderData.quen, 1]; // Adding new item with quantity 1

    const { error: updateError } = await supabase
      .from('Order')
      .update({ itemidd: updatedItemidd, quen: updatedQuen })
      .eq('id', selectedOrder.id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      toast({
        title: "Error",
        description: "Failed to add item to order.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Item added to order successfully.",
        variant: "success",
      });
      fetchOrders(); // Refresh the orders list
      setSelectedItemId(null); // Reset the selected item ID
    }
  };

  const renderOrdersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>SID</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const itemsDetails = order.itemidd.map((id, index) => {
            const menuItem = menuItems.find(item => item.id === id);
            return menuItem ? `${menuItem.name} (Qty: ${order.quen[index]})` : null;
          }).filter(Boolean).join(', ');

          return (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.sid}</TableCell>
              <TableCell>${order.tprice ? order.tprice.toFixed(2) : '0.00'}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{itemsDetails}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteOrder(order.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );

  const renderMenuTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {menuItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.desc}</TableCell>
            <TableCell>{item.cat}</TableCell>
            <TableCell>${item.Price.toFixed(2)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleEditMenuItem(item)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteMenuItem(item.id)}>
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button >
              <Link href="/login-register">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <Link href="/login-register" passHref>
        <Button 
          onClick={handleLogout} 
          className="absolute top-4 left-4 bg-red-500 hover:bg-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </Link>

      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Admin Dashboard</CardTitle>
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
                {/* Remove the Add Order button */}
              </div>
              {renderOrdersTable()}
            </TabsContent>
            <TabsContent value="menu" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Menu Items</h2>
                <Button onClick={handleAddMenuItem}>
                  <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                </Button>
              </div>
              {renderMenuTable()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Edit Dialog */}
      <Dialog open={isEditOrderDialogOpen} onOpenChange={setIsEditOrderDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              Update the details for the selected order.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateOrder}>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(orderFields).map(([key, value]) => {
                if (key !== 'itemIds' && key !== 'quantities') {
                  return (
                    <div key={key}>
                      <Label htmlFor={`edit-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                      <Input
                        id={`edit-${key}`}
                        type={key === 'deliveryDate' ? 'date' : key === 'totalPrice' ? 'number' : 'text'}
                        value={value}
                        onChange={(e) => setOrderFields({ ...orderFields, [key]: key === 'totalPrice' ? parseFloat(e.target.value) : e.target.value })}
                      />
                    </div>
                  );
                }
              })}
            </div>
            <div>
              <Label htmlFor="edit-items">Add Item</Label>
              <Select onValueChange={setSelectedItemId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {menuItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>{item.name} - ${item.Price.toFixed(2)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={handleAddItemToOrder}>Add Item</Button>
            </div>
            <div className="space-y-2">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span>{item.name} - ${item.price.toFixed(2)}</span>
                  <div className="flex items-center space-x-2">
                    <Button type="button" onClick={() => handleQuantityChange(item.id, -1)}>-</Button>
                    <span>{item.quantity}</span>
                    <Button type="button" onClick={() => handleQuantityChange(item.id, 1)}>+</Button>
                    <Button type="button" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit">Update Order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Menu Item Edit Dialog */}
      <Dialog open={isEditMenuDialogOpen} onOpenChange={setIsEditMenuDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              Update the details for the selected menu item.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateMenuItem}>
            {Object.entries(menuFields).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={`edit-menu-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                <Input
                  id={`edit-menu-${key}`}
                  type={key === 'price' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => setMenuFields({ ...menuFields, [key]: key === 'price' ? parseFloat(e.target.value) : e.target.value })}
                />
              </div>
            ))}
            <DialogFooter>
              <Button type="submit">Update Menu Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Menu Item Add Dialog */}
      <Dialog open={isAddMenuDialogOpen} onOpenChange={setIsAddMenuDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
            <DialogDescription>
              Enter the details for the new menu item.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleAddNewMenuItem}>
            {Object.entries(menuFields).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={`add-menu-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                <Input
                  id={`add-menu-${key}`}
                  type={key === 'price' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => setMenuFields({ ...menuFields, [key]: key === 'price' ? parseFloat(e.target.value) : e.target.value })}
                />
              </div>
            ))}
            <DialogFooter>
              <Button type="submit">Add Menu Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}