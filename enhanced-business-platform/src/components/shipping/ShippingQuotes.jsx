import React, { useState, useEffect } from 'react';
// motion is used via JSX tags (e.g. <motion.div />); ESLint may false-positive that it's unused
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  MapPin,
  Package,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ShippingQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const mockQuotes = [
        {
          id: 1,
          quoteNumber: 'SQ20250906001',
          merchant: 'متجر الأسواق الحديثة',
          pickupCity: 'الرياض',
          deliveryCity: 'جدة',
          distance: 950,
          packageWeight: 25.0,
          packageDimensions: '60x40x40',
          packageType: 'إلكترونيات',
          serviceType: 'express',
          pickupDate: '2025-09-09',
          deliveryDate: '2025-09-10',
          quotedPrice: 180,
          currency: 'SAR',
          validUntil: '2025-09-13',
          status: 'sent',
          notes: 'خدمة سريعة - التسليم خلال 24 ساعة',
          createdAt: '2025-09-06',
          sentAt: '2025-09-06'
        },
        {
          id: 2,
          quoteNumber: 'SQ20250906002',
          merchant: 'سوق المدينة',
          pickupCity: 'الدمام',
          deliveryCity: 'الرياض',
          distance: 400,
          packageWeight: 10.0,
          packageDimensions: '30x30x20',
          packageType: 'وثائق',
          serviceType: 'standard',
          pickupDate: '2025-09-08',
          deliveryDate: '2025-09-09',
          quotedPrice: 75,
          currency: 'SAR',
          validUntil: '2025-09-11',
          status: 'pending',
          notes: 'شحنة عادية',
          createdAt: '2025-09-06'
        },
        {
          id: 3,
          quoteNumber: 'SQ20250905001',
          merchant: 'متجر الجودة',
          pickupCity: 'جدة',
          deliveryCity: 'مكة المكرمة',
          distance: 80,
          packageWeight: 5.0,
          packageDimensions: '25x20x15',
          packageType: 'هدايا',
          serviceType: 'express',
          pickupDate: '2025-09-07',
          deliveryDate: '2025-09-07',
          quotedPrice: 50,
          currency: 'SAR',
          validUntil: '2025-09-10',
          status: 'accepted',
          notes: 'تسليم في نفس اليوم',
          createdAt: '2025-09-05',
          sentAt: '2025-09-05',
          respondedAt: '2025-09-06'
        }
      ];
      setQuotes(mockQuotes);
    } catch (error) {
      console.error('خطأ في جلب عروض الأسعار:', error);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
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
      case 'sent':
        return 'تم الإرسال';
      case 'accepted':
        return 'مقبول';
      case 'rejected':
        return 'مرفوض';
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
      case 'sent':
        return <Send className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'expired':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getServiceTypeText = (type) => {
    switch (type) {
      case 'standard':
        return 'عادي';
      case 'express':
        return 'سريع';
      case 'overnight':
        return 'ليلي';
      default:
        return type;
    }
  };

  const handleSendQuote = (quoteId) => {
    setQuotes(quotes.map(quote => 
      quote.id === quoteId 
        ? { ...quote, status: 'sent', sentAt: new Date().toISOString().split('T')[0] }
        : quote
    ));
  };

  const quoteStatuses = ['all', 'pending', 'sent', 'accepted', 'rejected', 'expired'];

  return (
    <div className="p-6 space-y-6">
      {/* العنوان والإحصائيات */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">عروض الأسعار</h1>
            <p className="text-gray-600">إدارة عروض أسعار الشحن والتوصيل</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            إنشاء عرض سعر جديد
          </Button>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي العروض</p>
                  <p className="text-2xl font-bold">{quotes.length}</p>
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
                    {quotes.filter(q => q.status === 'pending').length}
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
                  <p className="text-sm text-gray-600">مقبولة</p>
                  <p className="text-2xl font-bold text-green-600">
                    {quotes.filter(q => q.status === 'accepted').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي القيمة</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {quotes.filter(q => q.status === 'accepted')
                           .reduce((sum, q) => sum + q.quotedPrice, 0).toLocaleString()} ريال
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
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
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {quoteStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'جميع الحالات' : getStatusText(status)}
                    </option>
                  ))}
                </select>
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
              عرض {filteredQuotes.length} من أصل {quotes.length} عرض سعر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredQuotes.map((quote) => (
                <motion.div
                  key={quote.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{quote.quoteNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(quote.status)}`}>
                          {getStatusIcon(quote.status)}
                          {getStatusText(quote.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">التاجر: {quote.merchant}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{quote.pickupCity} → {quote.deliveryCity} ({quote.distance} كم)</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-gray-900">{quote.quotedPrice} {quote.currency}</p>
                      <p className="text-sm text-gray-600">خدمة {getServiceTypeText(quote.serviceType)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">تفاصيل الشحنة</p>
                      <p className="text-sm font-medium">{quote.packageType}</p>
                      <p className="text-sm text-gray-500">{quote.packageWeight} كجم - {quote.packageDimensions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">تاريخ الاستلام</p>
                      <p className="text-sm font-medium">{quote.pickupDate}</p>
                      {quote.deliveryDate && (
                        <p className="text-sm text-gray-500">التسليم: {quote.deliveryDate}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">صالح حتى</p>
                      <p className="text-sm font-medium">{quote.validUntil}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(quote.validUntil) > new Date() ? 'ساري' : 'منتهي الصلاحية'}
                      </p>
                    </div>
                  </div>

                  {quote.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{quote.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {quote.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleSendQuote(quote.id)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        إرسال العرض
                      </Button>
                    )}
                    
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      عرض التفاصيل
                    </Button>
                    
                    {quote.status === 'accepted' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Package className="h-4 w-4 mr-1" />
                        إنشاء شحنة
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredQuotes.length === 0 && (
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

export default ShippingQuotes;

