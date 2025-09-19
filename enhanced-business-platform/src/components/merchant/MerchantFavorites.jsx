import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { DollarSign, CheckCircle, XCircle, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

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
            <p className="text-gray-600 mb-4">عذراً، حدث خطأ أثناء عرض عروض الأسعار المستلمة. يرجى المحاولة مرة أخرى.</p>
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

// Mock quotations moved to module-level constant
const mockQuotations = [
  {
    id: 1,
    title: 'عرض سعر: أثاث مكتبي',
    description: 'عرض سعر لتوريد أثاث مكتبي متكامل',
    supplier: { id: 1, company_name: 'شركة النور للإلكترونيات' },
    total_amount: 18500,
    status: 'sent',
    items: [
      { name: 'مكاتب إدارية', quantity: 8, price: 3000, unit: 'قطعة' },
      { name: 'كراسي مكتب', quantity: 12, price: 750, unit: 'قطعة' },
      { name: 'خزانات أوراق', quantity: 4, price: 1200, unit: 'قطعة' }
    ],
    created_at: '2024-01-12',
    valid_until: '2024-02-12',
    delivery_terms: '15 يوم عمل من تاريخ الموافقة',
    payment_terms: '50% مقدم، 50% عند التسليم'
  },
  {
    id: 2,
    title: 'عرض سعر: إلكترونيات مكتبية',
    description: 'عرض سعر لتوريد أجهزة كمبيوتر ومعدات إلكترونية',
    supplier: { id: 3, company_name: 'شركة التقنية الآمنة' },
    total_amount: 22000,
    status: 'accepted',
    items: [
      { name: 'حواسيب محمولة', quantity: 6, price: 4000, unit: 'قطعة' },
      { name: 'شاشات عرض', quantity: 8, price: 2000, unit: 'قطعة' },
      { name: 'طابعات ليزر', quantity: 2, price: 1500, unit: 'قطعة' }
    ],
    created_at: '2024-01-10',
    accepted_at: '2024-01-15',
    order_number: 'ORD-2024-001',
    delivery_terms: '10 يوم عمل من تاريخ الموافقة',
    payment_terms: 'دفع كامل عند التسليم'
  },
  {
    id: 3,
    title: 'عرض سعر: نظام أمني',
    description: 'عرض سعر لتوريد وتركيب نظام مراقبة أمنية',
    supplier: { id: 2, company_name: 'مصنع الأخشاب الذهبية' },
    total_amount: 12500,
    status: 'sent',
    items: [
      { name: 'كاميرات مراقبة', quantity: 10, price: 500, unit: 'قطعة' },
      { name: 'جهاز تسجيل', quantity: 2, price: 1000, unit: 'جهاز' },
      { name: 'شاشات عرض', quantity: 2, price: 2000, unit: 'قطعة' }
    ],
    created_at: '2024-01-14',
    valid_until: '2024-02-14',
    delivery_terms: '7 يوم عمل من تاريخ الموافقة',
    payment_terms: '30% مقدم، 70% عند التسليم'
  },
  {
    id: 4,
    title: 'عرض سعر: طابعة ضغط',
    description: 'عرض سعر لتوريد طابعة ضغط كبيرة',
    supplier: { id: 4, company_name: 'شركة الطباعة الحديثة' },
    total_amount: 8500,
    status: 'rejected',
    items: [
      { name: 'طابعة ضغط كبيرة', quantity: 1, price: 3500, unit: 'جهاز' },
      { name: 'حبر طابعة ملون', quantity: 5, price: 150, unit: 'عبوة' },
      { name: 'ورق طباعة', quantity: 10, price: 200, unit: 'حزمة' }
    ],
    created_at: '2024-01-08',
    rejected_at: '2024-01-12',
    rejection_reason: 'الع سعر أعلى من الميزانية المخصصة'
  }
];

const MerchantFavorites = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [acceptForm, setAcceptForm] = useState({
    payment_method: 'bank_transfer',
    delivery_address: '',
    delivery_date_requested: '',
    notes: ''
  });

  // use module-level mockQuotations

  const fetchQuotations = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setQuotations(mockQuotations);
    } catch (error) {
      console.error('Error fetching quotations:', error);
      setError('حدث خطأ أثناء تحميل عروض الأسعار');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotations();
  }, [fetchQuotations]);

  const handleAcceptFormChange = (e) => {
    const { name, value } = e.target;
    setAcceptForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAcceptQuotation = async (e) => {
    e.preventDefault();
    if (!selectedQuotation) return;

    setLoading(true);
    try {
      // محاكاة طلب API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // تحديث حالة العرض
      setQuotations(prevQuotations =>
        prevQuotations.map(q =>
          q.id === selectedQuotation.id
            ? {
                ...q,
                status: 'accepted',
                accepted_at: new Date().toISOString().split('T')[0],
                order_number: `ORD-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
              }
            : q
        )
      );

      alert('تم قبول عرض السعر وإنشاء طلب الشراء بنجاح!');
      setIsAcceptModalOpen(false);
      setSelectedQuotation(null);
      setAcceptForm({
        payment_method: 'bank_transfer',
        delivery_address: '',
        delivery_date_requested: '',
        notes: ''
      });
    } catch (error) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectQuotation = (quotationId) => {
    if (!window.confirm('هل أنت متأكد من رفض هذا العرض؟')) return;

    setQuotations(prevQuotations =>
      prevQuotations.map(q =>
        q.id === quotationId
          ? {
              ...q,
              status: 'rejected',
              rejected_at: new Date().toISOString().split('T')[0],
              rejection_reason: 'تم الرفض من قبل المستخدم'
            }
          : q
      )
    );

    alert('تم رفض عرض السعر بنجاح');
  };

  if (loading && quotations.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل عروض الأسعار المستلمة...</p>
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
          <h3 className="text-xl font-bold text-gray-800 mb-2">خطأ في تحميل البيانات</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchQuotations()}
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
  <h1 className="text-3xl font-bold text-gray-800 dark:text-white">الموردين المفضلين</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quotations.length > 0 ? (
            quotations.map((quotation) => (
              <Card key={quotation.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{quotation.title}</CardTitle>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${quotation.status === 'sent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : quotation.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : quotation.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                      {quotation.status === 'sent' ? 'مرسل' : quotation.status === 'accepted' ? 'مقبول' : quotation.status === 'rejected' ? 'مرفوض' : quotation.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">من: {quotation.supplier?.company_name || 'غير معروف'}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300">{quotation.description}</p>

                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <DollarSign className="h-4 w-4 text-green-500 ml-2" />
                    <span>المبلغ الإجمالي: {quotation.total_amount?.toLocaleString('ar-SA')} ر.س</span>
                  </div>

                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <ExternalLink className="h-4 w-4 text-blue-500 ml-2" />
                    <span>عدد المنتجات: {quotation.items.length}</span>
                  </div>

                  {quotation.valid_until && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="mr-2">⏱️</span> صالح حتى: {new Date(quotation.valid_until).toLocaleDateString('ar-SA')}
                    </div>
                  )}

                  {quotation.order_number && (
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      <span className="mr-2">📋</span> رقم الطلب: {quotation.order_number}
                    </div>
                  )}

                  {quotation.rejection_reason && (
                    <div className="text-sm text-red-600 dark:text-red-400 mt-2">
                      <span className="font-medium">سبب الرفض:</span> {quotation.rejection_reason}
                    </div>
                  )}

                  {quotation.status === 'sent' && (
                    <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-4">
                      <Dialog open={isAcceptModalOpen && selectedQuotation?.id === quotation.id} onOpenChange={setIsAcceptModalOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedQuotation(quotation)} className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="h-4 w-4 ml-2" /> قبول
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <DialogHeader>
                            <DialogTitle>قبول عرض السعر وإنشاء طلب شراء</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleAcceptQuotation} className="space-y-4">
                            <div>
                              <Label htmlFor="payment_method">طريقة الدفع</Label>
                              <Input 
                                id="payment_method" 
                                name="payment_method" 
                                value={acceptForm.payment_method} 
                                onChange={handleAcceptFormChange}
                                list="payment-methods"
                              />
                              <datalist id="payment-methods">
                                <option value="bank_transfer">تحويل بنكي</option>
                                <option value="credit_card">بطاقة ائتمان</option>
                                <option value="cash">نقداً</option>
                              </datalist>
                            </div>
                            <div>
                              <Label htmlFor="delivery_address">عنوان التسليم</Label>
                              <Input 
                                id="delivery_address" 
                                name="delivery_address" 
                                value={acceptForm.delivery_address} 
                                onChange={handleAcceptFormChange}
                                placeholder="أدخل عنوان التسليم بالكامل"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="delivery_date_requested">تاريخ التسليم المطلوب</Label>
                              <Input 
                                id="delivery_date_requested" 
                                name="delivery_date_requested" 
                                type="date" 
                                value={acceptForm.delivery_date_requested} 
                                onChange={handleAcceptFormChange}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="notes">ملاحظات</Label>
                              <Textarea 
                                id="notes" 
                                name="notes" 
                                value={acceptForm.notes} 
                                onChange={handleAcceptFormChange}
                                placeholder="أي ملاحظات إضافية للطلب"
                              />
                            </div>
                            <DialogFooter>
                              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                                {loading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> جاري المعالجة...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 ml-2" /> تأكيد القبول
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        onClick={() => handleRejectQuotation(quotation.id)} 
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <XCircle className="h-4 w-4 ml-2" /> رفض
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <AlertCircle className="h-16 w-16 mx-auto" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد عروض أسعار مستلمة حتى الآن.</p>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MerchantFavorites;
