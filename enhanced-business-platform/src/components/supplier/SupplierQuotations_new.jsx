import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Send,
  Clock,
  CheckCircle,
  FileText,
  DollarSign,
  Calendar,
  User
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useNavigate } from 'react-router-dom';

const SupplierQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [_selectedQuotation, _setSelectedQuotation] = useState(null);
  const [_showQuotationModal, _setShowQuotationModal] = useState(false);
  const _navigate = useNavigate();

  useEffect(() => {
    const fetchQuotations = async () => {
    try {
      const api = await import('../../lib/api.js');
      const resp = await api.apiFetch('/api/supplier/quotations');
      if (resp && Array.isArray(resp.quotations)) {
        setQuotations(resp.quotations.map(q => ({
          id: q.id,
          quotationNumber: q.quotation_number || q.quotationNumber || `QUO-${q.id}`,
          merchant: q.merchant || { name: q.merchant_name || 'تاجر' },
          requestedItems: q.items || q.requestedItems || [],
          status: q.status,
          requestDate: q.created_at ? q.created_at.split('T')[0] : (q.requestDate || ''),
          deadline: q.valid_until || q.deadline || '',
          notes: q.notes || '',
          quotedPrice: q.total_amount || q.quotedPrice || null,
        })));
        return;
      }

      // محاكاة البيانات - في التطبيق الحقيقي ستأتي من API
      const mockQuotations = [
        {
          id: 1,
          quotationNumber: 'QUO-001',
          merchant: {
            name: 'متجر الأسواق الحديثة',
            email: 'modern@markets.com',
            phone: '+966501234567'
          },
          requestedItems: [
            { name: 'جهاز كمبيوتر محمول HP', quantity: 10, specifications: 'معالج i7، ذاكرة 16GB' },
            { name: 'هاتف ذكي Samsung', quantity: 5, specifications: 'ذاكرة 128GB، كاميرا 64MP' }
          ],
          status: 'pending',
          requestDate: '2025-09-06',
          deadline: '2025-09-08',
          notes: 'نحتاج عرض سعر تنافسي للكميات المطلوبة',
          quotedPrice: null,
          quotedDate: null
        },
        {
          id: 2,
          quotationNumber: 'QUO-002',
          merchant: {
            name: 'سوق المدينة',
            email: 'city@market.com',
            phone: '+966502345678'
          },
          requestedItems: [
            { name: 'طاولة مكتب خشبية', quantity: 20, specifications: 'خشب طبيعي، أبعاد 120x80 سم' },
            { name: 'كرسي مكتب مريح', quantity: 20, specifications: 'قابل للتعديل، مسند ظهر' }
          ],
          status: 'quoted',
          requestDate: '2025-09-05',
          deadline: '2025-09-07',
          notes: 'مطلوب للمكاتب الجديدة',
          quotedPrice: 25000,
          quotedDate: '2025-09-06'
        },
        {
          id: 3,
          quotationNumber: 'QUO-003',
          merchant: {
            name: 'متجر الجودة',
            email: 'quality@store.com',
            phone: '+966503456789'
          },
          requestedItems: [
            { name: 'جهاز كمبيوتر محمول HP', quantity: 3, specifications: 'للاستخدام المكتبي' }
          ],
          status: 'accepted',
          requestDate: '2025-09-04',
          deadline: '2025-09-06',
          notes: 'عاجل - مطلوب بأسرع وقت',
          quotedPrice: 7500,
          quotedDate: '2025-09-05'
        },
        {
          id: 4,
          quotationNumber: 'QUO-004',
          merchant: {
            name: 'متجر التقنية',
            email: 'tech@store.com',
            phone: '+966504567890'
          },
          requestedItems: [
            { name: 'هاتف ذكي Samsung', quantity: 15, specifications: 'أحدث إصدار متوفر' }
          ],
          status: 'rejected',
          requestDate: '2025-09-03',
          deadline: '2025-09-05',
          notes: 'للبيع في المتجر',
          quotedPrice: 27000,
          quotedDate: '2025-09-04'
        }
      ];
      setQuotations(mockQuotations);
    } catch (error) {
      console.error('خطأ في جلب عروض الأسعار:', error);
    }
    };
    fetchQuotations();
  }, []);

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.merchant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || quotation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'quoted':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'quoted':
        return 'تم إرسال العرض';
      case 'accepted':
        return 'تم القبول';
      case 'rejected':
        return 'تم الرفض';
      case 'expired':
        return 'منتهي الصلاحية';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'quoted':
        return <Send className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleSendQuotation = async (quotationId, price) => {
    setQuotations(prev => prev.map(q => q.id === quotationId ? { ...q, status: 'quoted', quotedPrice: price, quotedDate: new Date().toISOString().split('T')[0] } : q));
    try {
      const api = await import('../../lib/api.js');
      // Update status
      await api.apiFetch(`/api/supplier/quotations/${quotationId}/status`, { method: 'PUT', body: JSON.stringify({ status: 'quoted' }) });
    } catch (err) {
      console.error('Failed to send quotation', err);
      alert('فشل إرسال عرض السعر');
    }
  };

  const quotationStatuses = ['all', 'pending', 'quoted', 'accepted', 'rejected', 'expired'];

  return (
    <div className="p-6 space-y-6">
      {/* العنوان والإحصائيات */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">عروض الأسعار</h1>
          <p className="text-gray-600">إدارة طلبات عروض الأسعار من التجار</p>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold">{quotations.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">في الانتظار</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {quotations.filter(q => q.status === 'pending').length}
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
                  <p className="text-sm text-gray-600">تم الإرسال</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {quotations.filter(q => q.status === 'quoted').length}
                  </p>
                </div>
                <Send className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">تم القبول</p>
                  <p className="text-2xl font-bold text-green-600">
                    {quotations.filter(q => q.status === 'accepted').length}
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
                    placeholder="البحث في عروض الأسعار..."
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
                  {quotationStatuses.map(status => (
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

      {/* قائمة عروض الأسعار */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>قائمة عروض الأسعار</CardTitle>
            <CardDescription>
              عرض {filteredQuotations.length} من أصل {quotations.length} طلب
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredQuotations.map((quotation) => (
                <motion.div
                  key={quotation.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{quotation.quotationNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(quotation.status)}`}>
                          {getStatusIcon(quotation.status)}
                          {getStatusText(quotation.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">التاجر: {quotation.merchant.name}</p>
                      <p className="text-sm text-gray-500">تاريخ الطلب: {quotation.requestDate}</p>
                    </div>
                    <div className="text-left">
                      {quotation.quotedPrice && (
                        <p className="text-2xl font-bold text-gray-900">{quotation.quotedPrice.toLocaleString()} ريال</p>
                      )}
                      <p className="text-sm text-gray-600">{quotation.requestedItems.length} منتج</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">معلومات التاجر</p>
                      <p className="text-sm">{quotation.merchant.email}</p>
                      <p className="text-sm">{quotation.merchant.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">الموعد النهائي</p>
                      <p className="text-sm font-medium">{quotation.deadline}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">ملاحظات</p>
                      <p className="text-sm">{quotation.notes}</p>
                    </div>
                  </div>

                  {/* المنتجات المطلوبة */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">المنتجات المطلوبة:</p>
                    <div className="space-y-2">
                      {quotation.requestedItems.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">{item.specifications}</p>
                            </div>
                            <p className="font-bold">الكمية: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.location.href = `/supplier/quotations/${quotation.id}`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      عرض التفاصيل
                    </Button>

                    {quotation.status === 'pending' && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          const price = prompt('أدخل السعر المقترح:');
                          if (price) {
                            handleSendQuotation(quotation.id, parseFloat(price));
                          }
                        }}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        إرسال عرض سعر
                      </Button>
                    )}

                    {quotation.status === 'quoted' && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">تم الإرسال في: {quotation.quotedDate}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredQuotations.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد عروض أسعار تطابق البحث</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SupplierQuotations;
