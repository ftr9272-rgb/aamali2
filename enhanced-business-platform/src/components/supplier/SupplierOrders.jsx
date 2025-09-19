import React, { useState, useEffect } from 'react';
// keep motion import for animated JSX elements
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Truck,
  DollarSign,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const SupplierOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  // details handled in separate page

  useEffect(() => {
    const fetchOrders = async () => {
    try {
      // Try real API
      const api = await import('../../lib/api.js');
      const resp = await api.apiFetch('/api/supplier/orders');
      if (resp && Array.isArray(resp.orders)) {
        setOrders(resp.orders.map(o => ({
          id: o.id,
          orderNumber: o.order_number || o.orderNumber || `ORD-${o.id}`,
          merchant: o.merchant || { name: o.merchant_name || 'تاجر' },
          items: o.items || [],
          totalAmount: o.total_amount || o.totalAmount || 0,
          status: o.status,
          orderDate: o.created_at ? o.created_at.split('T')[0] : (o.orderDate || ''),
          deliveryDate: o.delivery_date || o.deliveryDate || '',
          shippingAddress: o.shipping_address || o.shippingAddress || ''
        })));
        return;
      }

      // محاكاة البيانات - في التطبيق الحقيقي ستأتي من API
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'ORD-001',
          merchant: {
            name: 'متجر الأسواق الحديثة',
            email: 'modern@markets.com',
            phone: '+966501234567'
          },
          items: [
            { name: 'جهاز كمبيوتر محمول HP', quantity: 2, price: 2500 },
            { name: 'هاتف ذكي Samsung', quantity: 1, price: 1800 }
          ],
          totalAmount: 6800,
          status: 'pending',
          orderDate: '2025-09-06',
          deliveryDate: '2025-09-10',
          shippingAddress: 'الرياض، حي النخيل، شارع الملك فهد'
        },
        {
          id: 2,
          orderNumber: 'ORD-002',
          merchant: {
            name: 'سوق المدينة',
            email: 'city@market.com',
            phone: '+966502345678'
          },
          items: [
            { name: 'طاولة مكتب خشبية', quantity: 3, price: 800 },
            { name: 'كرسي مكتب مريح', quantity: 3, price: 450 }
          ],
          totalAmount: 3750,
          status: 'processing',
          orderDate: '2025-09-05',
          deliveryDate: '2025-09-08',
          shippingAddress: 'جدة، حي الصفا، شارع التحلية'
        },
        {
          id: 3,
          orderNumber: 'ORD-003',
          merchant: {
            name: 'متجر الجودة',
            email: 'quality@store.com',
            phone: '+966503456789'
          },
          items: [
            { name: 'جهاز كمبيوتر محمول HP', quantity: 1, price: 2500 }
          ],
          totalAmount: 2500,
          status: 'completed',
          orderDate: '2025-09-04',
          deliveryDate: '2025-09-07',
          shippingAddress: 'الدمام، حي الفيصلية، شارع الأمير محمد'
        },
        {
          id: 4,
          orderNumber: 'ORD-004',
          merchant: {
            name: 'متجر التقنية',
            email: 'tech@store.com',
            phone: '+966504567890'
          },
          items: [
            { name: 'هاتف ذكي Samsung', quantity: 5, price: 1800 }
          ],
          totalAmount: 9000,
          status: 'shipped',
          orderDate: '2025-09-03',
          deliveryDate: '2025-09-06',
          shippingAddress: 'مكة المكرمة، حي العزيزية، شارع الحرم'
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('خطأ في جلب الطلبات:', error);
    }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.merchant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'shipped':
        return 'تم الشحن';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <AlertCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    // Optimistic UI update and call API
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    (async () => {
      try {
        const api = await import('../../lib/api.js');
        await api.apiFetch(`/api/supplier/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
      } catch (err) {
        console.error('Failed to update order status', err);
        // revert optimistic change on error
        setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: 'pending' } : order));
        alert('فشل تحديث حالة الطلب');
      }
    })();
  };

  const orderStatuses = ['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled'];

  return (
    <div className="p-6 space-y-6">
      {/* العنوان والإحصائيات */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الطلبات</h1>
          <p className="text-gray-600">متابعة وإدارة جميع الطلبات الواردة من التجار</p>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">في الانتظار</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">قيد المعالجة</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {orders.filter(o => o.status === 'processing').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">مكتملة</p>
                  <p className="text-2xl font-bold text-green-600">
                    {orders.filter(o => o.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* أدوات البحث والتصفية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="البحث في الطلبات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {orderStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'جميع الحالات' : getStatusText(status)}
                    </option>
                  ))}
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  تصفية
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* قائمة الطلبات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>قائمة الطلبات</CardTitle>
            <CardDescription>
              عرض {filteredOrders.length} من أصل {orders.length} طلب
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{order.orderNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">التاجر: {order.merchant.name}</p>
                      <p className="text-sm text-gray-500">تاريخ الطلب: {order.orderDate}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-gray-900">{order.totalAmount.toLocaleString()} ريال</p>
                      <p className="text-sm text-gray-600">{order.items.length} منتج</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">معلومات التاجر</p>
                      <p className="text-sm">{order.merchant.email}</p>
                      <p className="text-sm">{order.merchant.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">تاريخ التسليم المتوقع</p>
                      <p className="text-sm font-medium">{order.deliveryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">عنوان الشحن</p>
                      <p className="text-sm">{order.shippingAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = `/supplier/orders/${order.id}`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      عرض التفاصيل
                    </Button>
                    
                    {order.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleStatusUpdate(order.id, 'processing')}
                      >
                        قبول الطلب
                      </Button>
                    )}
                    
                    {order.status === 'processing' && (
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleStatusUpdate(order.id, 'shipped')}
                      >
                        تأكيد الشحن
                      </Button>
                    )}
                    
                    {order.status === 'shipped' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                      >
                        تأكيد التسليم
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد طلبات تطابق البحث</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SupplierOrders;

