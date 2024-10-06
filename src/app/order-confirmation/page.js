'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function OrderConfirmationPage() {
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

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

        setOrder(orderData);

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

    if (!order) {
        return <div>Loading order details...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Order Confirmation</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Order ID: {order.id}</p>
                    <p>Total Price: ${order.tprice.toFixed(2)}</p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderItems.map((item) => (
                                <TableRow key={item.itemid}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quen}</TableCell>
                                    <TableCell>${item.Price.toFixed(2)}</TableCell>
                                    <TableCell>${item.totalPrice.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}