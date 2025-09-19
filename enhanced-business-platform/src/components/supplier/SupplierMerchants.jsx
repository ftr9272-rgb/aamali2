import React, { useState, useEffect } from 'react';
// motion is used via JSX tags (e.g. <motion.div />); ESLint may false-positive that it's unused
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const SupplierMerchants = () => {
  const [merchants, setMerchants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [_selectedMerchant, _setSelectedMerchant] = useState(null);
  const [_showMerchantDetails, _setShowMerchantDetails] = useState(false);

  useEffect(() => {
    const fetchMerchants = async () => {
    try {
      // محاكاة البيانات - في التطبيق الحقيقي ستأتي من API
      const mockMerchants = [
        {
          id: 1,
          name: 'متجر الأسواق الحديثة',
          email: 'modern@markets.com',
          phone: '+966501234567',
          address: 'الرياض، حي النخيل، شارع الملك فهد',
          businessType: 'تجارة إلكترونية',
          rating: 4.8,
          totalOrders: 45,
          totalSpent: 125000,
          lastOrderDate: '2025-09-06',
          status: 'active',
          joinDate: '2024-01-15',
          paymentTerms: '30 يوم',
          creditLimit: 50000,
          notes: 'عميل ممتاز، دفع منتظم'
        },
        {
          id: 2,
          name: 'سوق المدينة',
          email: 'city@market.com',
          phone: '+966502345678',
          address: 'جدة، حي الصفا، شارع التحلية',
          businessType: 'متجر تقليدي',
          rating: 4.5,
          totalOrders: 32,
          totalSpent: 89000,
          lastOrderDate: '2025-09-05',
          status: 'active',
          joinDate: '2024-03-20',
          paymentTerms: '15 يوم',
          creditLimit: 30000,
          notes: 'عميل جيد، يحتاج متابعة'
        },
        {
          id: 3,
          name: 'متجر الجودة',
          email: 'quality@store.com',
          phone: '+966503456789',
          address: 'الدمام، حي الفيصلية، شارع الأمير محمد',
          businessType: 'متجر متخصص',
          rating: 4.9,
          totalOrders: 67,
          totalSpent: 198000,
          lastOrderDate: '2025-09-04',
          status: 'vip',
          joinDate: '2023-11-10',
          paymentTerms: '45 يوم',
          creditLimit: 100000,
          notes: 'عميل VIP، أولوية في الخدمة'
        },
        {
          id: 4,
          name: 'متجر التقنية',
          email: 'tech@store.com',
          phone: '+966504567890',
          address: 'مكة المكرمة، حي العزيزية، شارع الحرم',
          businessType: 'إلكترونيات',
          rating: 3.8,
          totalOrders: 12,
          totalSpent: 25000,
          lastOrderDate: '2025-08-28',
          status: 'inactive',
          joinDate: '2024-06-05',
          paymentTerms: '7 أيام',
          creditLimit: 10000,
          notes: 'عميل جديد، يحتاج تطوير العلاقة'
        }
      ];
      setMerchants(mockMerchants);
    } catch (error) {
      console.error('خطأ في جلب بيانات التجار:', error);
    }
    };
    fetchMerchants();
  }, []);

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.businessType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || 
                         (filterRating === 'high' && merchant.rating >= 4.5) ||
                         (filterRating === 'medium' && merchant.rating >= 3.5 && merchant.rating < 4.5) ||
                         (filterRating === 'low' && merchant.rating < 3.5);
    return matchesSearch && matchesRating;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'vip':
        return 'bg-purple-100 text-purple-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'vip':
        return 'VIP';
      case 'inactive':
        return 'غير نشط';
      default:
        return status;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-200 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const _ratingFilters = ['all', 'high', 'medium', 'low'];

  return (
    <div className="p-6 space-y-6">
      {/* العنوان والإحصائيات */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة التجار</h1>
          <p className="text-gray-600">متابعة وإدارة علاقاتك مع التجار والعملاء</p>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي التجار</p>
                  <p className="text-2xl font-bold">{merchants.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">التجار النشطون</p>
                  <p className="text-2xl font-bold text-green-600">
                    {merchants.filter(m => m.status === 'active' || m.status === 'vip').length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">عملاء VIP</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {merchants.filter(m => m.status === 'vip').length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المبيعات</p>
                  <p className="text-2xl font-bold text-green-600">
                    {merchants.reduce((sum, m) => sum + m.totalSpent, 0).toLocaleString()} ريال
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
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
                    placeholder="البحث في التجار..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع التقييمات</option>
                  <option value="high">تقييم عالي (4.5+)</option>
                  <option value="medium">تقييم متوسط (3.5-4.5)</option>
                  <option value="low">تقييم منخفض (أقل من 3.5)</option>
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

      {/* قائمة التجار */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>قائمة التجار</CardTitle>
            <CardDescription>
              عرض {filteredMerchants.length} من أصل {merchants.length} تاجر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredMerchants.map((merchant) => (
                <motion.div
                  key={merchant.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{merchant.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(merchant.status)}`}>
                          {getStatusText(merchant.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">{merchant.businessType}</p>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(merchant.rating)}
                        <span className="text-sm text-gray-600 mr-1">({merchant.rating})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{merchant.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{merchant.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{merchant.address}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{merchant.totalOrders}</p>
                      <p className="text-xs text-gray-600">طلب</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{merchant.totalSpent.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">ريال</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{merchant.creditLimit.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">حد ائتماني</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">آخر طلب:</span>
                      <span className="font-medium">{merchant.lastOrderDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">شروط الدفع:</span>
                      <span className="font-medium">{merchant.paymentTerms}</span>
                    </div>
                  </div>

                  {merchant.notes && (
                    <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{merchant.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        _setSelectedMerchant(merchant);
                        _setShowMerchantDetails(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      عرض التفاصيل
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      اتصال
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-1" />
                      رسالة
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredMerchants.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا يوجد تجار يطابقون البحث</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SupplierMerchants;

