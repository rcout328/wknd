'use client'

import { useState, useEffect } from 'react';
import { MoreHorizontal, Plus, Pencil, Trash2, LogOut, MessageCircle, Package, Menu } from 'lucide-react';
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
import ImageSelector from './ImageSelector';

export function AdminDashboardComponent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'order' or 'menuItem'

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
      setLoading(false); // Set loading to false after checking
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
        name: menuItem ? menuItem.name : 'Deleted Item',
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

  const handleDeleteConfirmation = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteOrder = async () => {
    if (!itemToDelete) return;

    const { error } = await supabase.from('Order').delete().eq('id', itemToDelete.id);
    if (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order. Please try again.');
    } else {
      console.log('Order deleted successfully');
      fetchOrders(); // Refetch the orders to update the UI
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteMenuItem = async () => {
    if (!itemToDelete) return;

    const { error } = await supabase.from('menu').delete().eq('id', itemToDelete.id);
    if (error) {
      console.error('Error deleting menu item:', error);
      alert('Failed to delete menu item. Please try again.');
    } else {
      console.log('Menu item deleted successfully');
      fetchMenuItems(); // Refetch the menu items to update the UI
    }
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
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

  // Add this function to handle image selection
  const handleImageSelect = (imagePath) => {
    setMenuFields(prev => ({ ...prev, image: imagePath }));
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
      alert("Error: Please select an item to add.");
      return;
    }

    const { data: orderData, error: orderError } = await supabase
      .from('Order')
      .select('itemidd, quen')
      .eq('id', selectedOrder.id)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);
      alert("Error: Failed to fetch order details.");
      return;
    }

    // Add the new item ID to itemidd array and set its quantity to 1
    const updatedItemidd = [...orderData.itemidd, selectedItemId];
    const updatedQuen = [...orderData.quen, 1];

    const { error: updateError } = await supabase
      .from('Order')
      .update({ itemidd: updatedItemidd, quen: updatedQuen })
      .eq('id', selectedOrder.id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      alert("Error: Failed to add item to order.");
    } else {
      alert("Success: Item added to order successfully.");
      
      // Fetch the updated order details
      const { data: updatedOrder, error: fetchError } = await supabase
        .from('Order')
        .select('*')
        .eq('id', selectedOrder.id)
        .single();

      if (fetchError) {
        console.error('Error fetching updated order:', fetchError);
      } else {
        // Update the selectedOrder state with the new data
        setSelectedOrder(updatedOrder);

        // Update the selectedItems state
        const updatedSelectedItems = updatedOrder.itemidd.map((id, index) => {
          const menuItem = menuItems.find(item => item.id === id);
          return {
            id: id,
            name: menuItem ? menuItem.name : 'Deleted Item',
            price: menuItem ? menuItem.Price : 0,
            quantity: updatedOrder.quen[index]
          };
        });
        setSelectedItems(updatedSelectedItems);
      }
    }

    // Refresh the orders list and reset the selected item
    fetchOrders();
    setSelectedItemId(null);
  };

  const renderOrdersTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="hidden md:table-cell">Total</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.cname || order.sid}</TableCell>
              <TableCell>{order.phone || 'N/A'}</TableCell>
              <TableCell className="hidden md:table-cell">${order.tprice ? order.tprice.toFixed(2) : '0.00'}</TableCell>
              <TableCell className="hidden lg:table-cell">{new Date(order.created_at).toLocaleDateString()}</TableCell>
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
                <div className="max-h-24 overflow-y-auto">
                  {order.itemidd.map((itemId, index) => {
                    const menuItem = menuItems.find(item => item.id === itemId);
                    return (
                      <div key={itemId} className="text-sm mb-1">
                        {menuItem ? menuItem.name : 'Unknown Item'} (x{order.quen[index]})
                      </div>
                    );
                  })}
                </div>
              </TableCell>
              <TableCell className="text-right">
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
                    <DropdownMenuItem onClick={() => handleDeleteConfirmation(order, 'order')}>
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
    </div>
  );

  const renderMenuTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="hidden md:table-cell">{item.desc}</TableCell>
              <TableCell>{item.cat}</TableCell>
              <TableCell>${item.Price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
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
                    <DropdownMenuItem onClick={() => handleDeleteConfirmation(item, 'menuItem')}>
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
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Link href="/login-register">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-pink-800">Admin Dashboard</h1>
          <Link href="/login-register" passHref>
            <Button 
              onClick={handleLogout} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
                <p className="text-3xl font-bold text-pink-600">{orders.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Menu Items</h3>
                <p className="text-3xl font-bold text-pink-600">{menuItems.length}</p>
              </div>
              {/* Add more quick stat cards as needed */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Manage Data</CardTitle>
            <CardDescription>View and edit orders and menu items</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="orders">
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="menu">
                  <Menu className="mr-2 h-4 w-4" />
                  Menu
                </TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Order Information</h2>
                </div>
                {renderOrdersTable()}
              </TabsContent>
              <TabsContent value="menu" className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Menu Items</h2>
                  <Button onClick={handleAddMenuItem}>
                    <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                  </Button>
                </div>
                {renderMenuTable()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Order Edit Dialog */}
      <Dialog open={isEditOrderDialogOpen} onOpenChange={setIsEditOrderDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[80vw] md:max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              Update the details for the selected order.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto px-4">
            <form className="space-y-4" onSubmit={handleUpdateOrder}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="flex space-x-2">
                  <Select onValueChange={setSelectedItemId} className="flex-grow">
                    <SelectTrigger>
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuItems.map(item => (
                        <SelectItem key={item.id} value={item.id}>{item.name} - ${item.Price.toFixed(2)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={handleAddItemToOrder}>Add</Button>
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span className="text-sm">{item.name} - ${item.price.toFixed(2)}</span>
                    <div className="flex items-center space-x-2">
                      <Button type="button" size="sm" onClick={() => handleQuantityChange(item.id, -1)}>-</Button>
                      <span className="text-sm">{item.quantity}</span>
                      <Button type="button" size="sm" onClick={() => handleQuantityChange(item.id, 1)}>+</Button>
                      <Button type="button" size="sm" variant="destructive" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" onClick={handleUpdateOrder}>Update Order</Button>
          </DialogFooter>
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
                {key === 'image' ? (
                  <ImageSelector onImageSelect={handleImageSelect} initialImage={menuFields.image} />
                ) : (
                  <Input
                    id={`edit-menu-${key}`}
                    type={key === 'price' ? 'number' : 'text'}
                    value={value}
                    onChange={(e) => setMenuFields({ ...menuFields, [key]: key === 'price' ? parseFloat(e.target.value) : e.target.value })}
                  />
                )}
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
                {key === 'image' ? (
                  <ImageSelector onImageSelect={handleImageSelect} />
                ) : (
                  <Input
                    id={`add-menu-${key}`}
                    type={key === 'price' ? 'number' : 'text'}
                    value={value}
                    onChange={(e) => setMenuFields({ ...menuFields, [key]: key === 'price' ? parseFloat(e.target.value) : e.target.value })}
                  />
                )}
              </div>
            ))}
            <DialogFooter>
              <Button type="submit">Add Menu Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteType === 'order' ? handleDeleteOrder : handleDeleteMenuItem}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}