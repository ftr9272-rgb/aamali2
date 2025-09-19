import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { DollarSign, Package, CalendarDays, MapPin, FileText, ShoppingCart } from 'lucide-react';

const MerchantPurchaseOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await apiFetch(`/api/merchant/purchase-orders/${orderId}`);
        setOrder(data.order);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'processing': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) return <div className="text-center py-8">جاري تحميل تفاصيل الطلب...</div>;
  if (error) return <div className="text-center py-8 text-red-500">خطأ في تحميل البيانات: {error}</div>;
  if (!order) return <div className="text-center py-8 text-gray-500 dark:text-gray-400">لم يتم العثور على طلب الشراء.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">تفاصيل طلب الشراء #{order.order_number}</h1>

      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">معلومات الطلب</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <ShoppingCart className="h-5 w-5 text-blue-500 ml-2" />
            <span>المورد: {order.supplier?.company_name || 'غير معروف'}</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <DollarSign className="h-5 w-5 text-green-500 ml-2" />
            <span>المبلغ الإجمالي: {order.total_amount?.toLocaleString('ar-SA')} ر.س</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <CalendarDays className="h-5 w-5 text-purple-500 ml-2" />
            <span>تاريخ الطلب: {new Date(order.created_at).toLocaleDateString('ar-SA')}</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <MapPin className="h-5 w-5 text-red-500 ml-2" />
            <span>عنوان التسليم: {order.delivery_address}</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <FileText className="h-5 w-5 text-orange-500 ml-2" />
            <span>طريقة الدفع: {order.payment_method}</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              الحالة: {order.status === 'pending' ? 'معلق' : order.status === 'confirmed' ? 'مؤكد' : order.status === 'processing' ? 'قيد المعالجة' : order.status === 'shipped' ? 'تم الشحن' : order.status === 'delivered' ? 'تم التسليم' : order.status === 'cancelled' ? 'ملغي' : order.status}
            </span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : order.payment_status === 'partial' ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
              حالة الدفع: {order.payment_status === 'paid' ? 'مدفوع' : order.payment_status === 'partial' ? 'مدفوع جزئياً' : 'معلق'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">عناصر الطلب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.product_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">الكمية: {item.quantity} {item.unit || ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{item.total_price?.toLocaleString('ar-SA')} ر.س</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">سعر الوحدة: {item.unit_price?.toLocaleString('ar-SA')} ر.س</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">لا توجد عناصر في هذا الطلب.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">المدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.payments && order.payments.length > 0 ? (
              order.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">دفعة #{payment.payment_number}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">طريقة الدفع: {payment.payment_method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{payment.amount?.toLocaleString('ar-SA')} ر.س</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">تاريخ الدفع: {new Date(payment.payment_date).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">لا توجد دفعات لهذا الطلب.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantPurchaseOrderDetails;

