
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { 
  getOrders,
  updateOrderStatus
} from '@/services/database';
import { 
  Search, 
  Clock, 
  Eye, 
  Phone,
  MapPin,
  User,
  ShoppingBag
} from 'lucide-react';
import { OrderStatus } from '@/models/types';
import { Badge } from '@/components/ui/badge';

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [viewOrderId, setViewOrderId] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  const orders = getOrders();
  
  // Sort orders by creation date, most recent first
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Filter orders based on search query and status
  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        order.id.toString().includes(searchQuery.toLowerCase()) ||
                        (order.customerAddress && order.customerAddress.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleViewOrder = (id: number) => {
    setViewOrderId(id);
    setViewDialogOpen(true);
  };
  
  const handleUpdateStatus = (id: number, status: OrderStatus) => {
    updateOrderStatus(id, status);
  };
  
  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      preparing: { color: 'bg-purple-100 text-purple-800', label: 'Preparing' },
      ready: { color: 'bg-orange-100 text-orange-800', label: 'Ready' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Get the order details for the view dialog
  const selectedOrder = viewOrderId !== null ? orders.find(order => order.id === viewOrderId) : null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-playfair">Orders</h1>
          <p className="text-gray-500 mt-2">
            Manage customer orders and update their status
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search orders by name, ID, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>
                      <Badge variant={order.orderType === 'delivery' ? 'default' : 'outline'}>
                        {order.orderType === 'delivery' ? 'Delivery' : 'Takeaway'}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.orderItems.length} items</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-1 h-3 w-3 text-gray-500" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleUpdateStatus(order.id, value as OrderStatus)}
                        >
                          <SelectTrigger className="h-9 w-[130px]">
                            <SelectValue placeholder="Change Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirm</SelectItem>
                            <SelectItem value="preparing">Preparing</SelectItem>
                            <SelectItem value="ready">Ready</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No orders found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-start text-sm">
                      <User className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <p className="font-medium">Name</p>
                        <p>{selectedOrder.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start text-sm">
                      <Phone className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p>{selectedOrder.customerPhone}</p>
                      </div>
                    </div>
                    {selectedOrder.customerAddress && (
                      <div className="flex items-start text-sm">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                        <div>
                          <p className="font-medium">Delivery Address</p>
                          <p>{selectedOrder.customerAddress}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Order Type:</span>
                      <span className="capitalize">{selectedOrder.orderType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span>{getStatusBadge(selectedOrder.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold">${selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {item.size && <div>Size: {item.size}</div>}
                            {item.toppings && item.toppings.length > 0 && (
                              <div>Toppings: {item.toppings.join(', ')}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={4} className="px-6 py-3 text-right text-sm font-semibold">
                          Total
                        </td>
                        <td className="px-6 py-3 text-right text-sm font-bold">
                          ${selectedOrder.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {selectedOrder.specialInstructions && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2">Special Instructions</h3>
                  <p className="text-sm">{selectedOrder.specialInstructions}</p>
                </div>
              )}
              
              <DialogFooter className="flex justify-between">
                <div>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => {
                      handleUpdateStatus(selectedOrder.id, value as OrderStatus);
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirm</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Orders;
