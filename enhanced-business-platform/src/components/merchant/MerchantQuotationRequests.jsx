import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { PlusCircle, FileText, Send, XCircle, CalendarDays, Loader2, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md border border-red-200">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">حدث خطأ</h3>
            <p className="text-gray-600 mb-4">عذراً، حدث خطأ أثناء عرض طلبات عروض الأسعار. يرجى المحاولة مرة أخرى.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
// Module-level mock requests
const MOCK_QUOTATION_REQUESTS = [
  {
    id: 1,
    request_number: 'QR-2024-001',
    title: 'طلب عرض سعر: أثاث مكتبي',
    description: 'طلب لتوريد أثاث مكتبي متكامل للمكاتب',
    delivery_date_required: '2024-02-15',
    delivery_address: 'الرياض، المملكة العربية السعودية',
    notes: 'ملاحظات إضافية حول الطلب',
    status: 'sent',
    items: [
      { product_name: 'مكاتب إدارية', quantity_needed: 8, unit: 'قطعة', max_price: '3000', specifications: 'مقاس 160x80 سم' }
    ],
    created_at: '2024-01-10',
    quotations_count: 3
  },
  {
    id: 2,
    request_number: 'QR-2024-002',
    title: 'طلب عرض سعر: إلكترونيات مكتبية',
    description: 'طلب لتوريد أجهزة كمبيوتر ومعدات إلكترونية للمؤسسة',
    delivery_date_required: '2024-02-20',
    delivery_address: 'جدة، المملكة العربية السعودية',
    notes: 'ملاحظات حول التوافق والمتطلبات الفنية',
    status: 'sent',
    items: [
      { product_name: 'حواسيب محمولة', quantity_needed: 6, unit: 'قطعة', max_price: '4000', specifications: 'Intel i7, 16GB RAM, 512GB SSD' }
    ],
    created_at: '2024-01-15',
    quotations_count: 2
  }
];

const MerchantQuotationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    delivery_date_required: "",
    delivery_address: "",
    notes: "",
    items: [{ product_name: "", quantity_needed: "", unit: "", max_price: "", specifications: "" }]
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // mock requests now defined at module-level (MOCK_QUOTATION_REQUESTS)

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 800));

      // تعيين البيانات الوهمية مؤقتاً للعرض
      setRequests(MOCK_QUOTATION_REQUESTS);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('حدث خطأ أثناء تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleNewRequestChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = newRequest.items.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setNewRequest(prev => ({ ...prev, items: updatedItems }));
  };

  const handleAddItem = () => {
    setNewRequest(prev => ({
      ...prev,
      items: [...prev.items, { product_name: "", quantity_needed: "", unit: "", max_price: "", specifications: "" }]
    }));
  };

  const handleRemoveItem = (index) => {
    setNewRequest(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitNewRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
  // محاكاة طلب API
  await new Promise(resolve => setTimeout(resolve, 1000));

  // أنشئ سجل الطلب محلياً
      const newRequestData = {
        id: requests.length + 1,
        request_number: `QR-2024-${String(requests.length + 1).padStart(3, '0')}`,
        title: newRequest.title,
        description: newRequest.description,
        delivery_date_required: newRequest.delivery_date_required,
        delivery_address: newRequest.delivery_address,
        notes: newRequest.notes,
        status: 'draft',
        items: newRequest.items,
        created_at: new Date().toISOString().split('T')[0],
        quotations_count: 0
      };

  // أضف الطلب الجديد لقائمة العرض
  setRequests(prev => [newRequestData, ...prev]);

  alert('تم إنشاء طلب عرض السعر بنجاح!');
      setIsModalOpen(false);
      setNewRequest({
        title: "",
        description: "",
        delivery_date_required: "",
        delivery_address: "",
        notes: "",
        items: [{ product_name: "", quantity_needed: "", unit: "", max_price: "", specifications: "" }]
      });
    } catch (error) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && requests.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل طلبات عروض الأسعار...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md border border-red-200">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">تعذر تحميل الطلبات</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchRequests()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">طلبات عروض الأسعار</h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <PlusCircle className="h-4 w-4 ml-2" /> إنشاء طلب جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <DialogHeader>
                <DialogTitle>إنشاء طلب عرض سعر جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitNewRequest} className="space-y-4">
                <div>
                  <Label htmlFor="title">العنوان</Label>
                  <Input id="title" name="title" value={newRequest.title} onChange={handleNewRequestChange} required />
                </div>
                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea id="description" name="description" value={newRequest.description} onChange={handleNewRequestChange} />
                </div>
                <div>
                  <Label htmlFor="delivery_date_required">تاريخ التسليم المطلوب</Label>
                  <Input id="delivery_date_required" name="delivery_date_required" type="date" value={newRequest.delivery_date_required} onChange={handleNewRequestChange} />
                </div>
                <div>
                  <Label htmlFor="delivery_address">عنوان التسليم</Label>
                  <Input id="delivery_address" name="delivery_address" value={newRequest.delivery_address} onChange={handleNewRequestChange} />
                </div>
                <div>
                  <Label htmlFor="notes">ملاحظات</Label>
                  <Textarea id="notes" name="notes" value={newRequest.notes} onChange={handleNewRequestChange} />
                </div>

                <h3 className="text-lg font-semibold mt-6">تفاصيل العناصر</h3>
                {newRequest.items.map((item, index) => (
                  <Card key={index} className="p-4 bg-gray-50 dark:bg-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`product_name-${index}`}>اسم المنتج</Label>
                        <Input id={`product_name-${index}`} name="product_name" value={item.product_name} onChange={(e) => handleItemChange(index, e)} required />
                      </div>
                      <div>
                        <Label htmlFor={`quantity_needed-${index}`}>الكمية المطلوبة</Label>
                        <Input id={`quantity_needed-${index}`} name="quantity_needed" type="number" value={item.quantity_needed} onChange={(e) => handleItemChange(index, e)} required />
                      </div>
                      <div>
                        <Label htmlFor={`unit-${index}`}>الوحدة</Label>
                        <Input id={`unit-${index}`} name="unit" value={item.unit} onChange={(e) => handleItemChange(index, e)} />
                      </div>
                      <div>
                        <Label htmlFor={`max_price-${index}`}>أقصى سعر (ر.س)</Label>
                        <Input id={`max_price-${index}`} name="max_price" type="number" step="0.01" value={item.max_price} onChange={(e) => handleItemChange(index, e)} />
                      </div>
                      <div className="col-span-full">
                        <Label htmlFor={`specifications-${index}`}>المواصفات</Label>
                        <Textarea id={`specifications-${index}`} name="specifications" value={item.specifications} onChange={(e) => handleItemChange(index, e)} />
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button type="button" variant="destructive" onClick={() => handleRemoveItem(index)}>
                        <XCircle className="h-4 w-4 ml-2" /> حذف عنصر
                      </Button>
                    </div>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={handleAddItem} className="w-full">
                  <PlusCircle className="h-4 w-4 ml-2" /> إضافة منتج جديد
                </Button>

                <DialogFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                    <Send className="h-4 w-4 ml-2" /> إرسال الطلب
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.length > 0 ? (
            requests.map((req) => (
              <Card key={req.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{req.title}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${req.status === 'sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : req.status === 'draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'}`}>
                      الحالة: {req.status === 'sent' ? 'مرسل' : req.status === 'draft' ? 'مسودة' : req.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">رقم الطلب: {req.request_number}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300">{req.description}</p>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <CalendarDays className="h-4 w-4 text-blue-500 ml-2" />
                    <span>تاريخ التسليم المطلوب: {req.delivery_date_required}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <FileText className="h-4 w-4 text-purple-500 ml-2" />
                    <span>عدد العناصر: {req.items.length}</span>
                  </div>
                  {req.quotations_count > 0 && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <FileText className="h-4 w-4 text-green-500 ml-2" />
                      <span>عدد العروض: {req.quotations_count}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      منذ: {req.created_at}
                    </span>
                    <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400">
                      عرض التفاصيل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="h-16 w-16 mx-auto" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد طلبات لعرضها حالياً.</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MerchantQuotationRequests;
