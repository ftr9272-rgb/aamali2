import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, Star, PlusCircle, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            <p className="text-gray-600 mb-4">عذراً، حدث خطأ أثناء عرض الموردين. يرجى المحاولة مرة أخرى.</p>
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

// mock suppliers (module-level, stable)
const MOCK_SUPPLIERS = [
  {
    id: 1,
    company_name: 'شركة النور للإلكترونيات',
    description: 'متخصص في إلكترونيات المكتب والأجهزة المنزلية',
    rating: 4.8,
    total_orders: 24,
    is_favorite: true,
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    address: 'الرياض، المملكة العربية السعودية',
    email: 'info@alnoor-electronics.com',
    phone: '966-11-234-5678'
  },
  {
    id: 2,
    company_name: 'مصنع الأخشاب الذهبية',
    description: 'توريد وتصنيع الأثاث المكتبي والمكتبي',
    rating: 4.6,
    total_orders: 18,
    is_favorite: false,
    logo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    address: 'جدة، المملكة العربية السعودية',
    email: 'sales@golden-wood.com',
    phone: '966-12-345-6789'
  },
  {
    id: 3,
    company_name: 'شركة التقنية الآمنة',
    description: 'أنظمة المراقبة الأمنية وحلول الحماية',
    rating: 4.7,
    total_orders: 32,
    is_favorite: false,
    logo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    address: 'الدمام، المملكة العربية السعودية',
    email: 'contact@secure-tech.com',
    phone: '966-13-456-7890'
  },
  {
    id: 4,
    company_name: 'شركة الطباعة الحديثة',
    description: 'خدمات الطباعة الرقمية والتصميم',
    rating: 4.5,
    total_orders: 15,
    is_favorite: true,
    logo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    address: 'الرياض، المملكة العربية السعودية',
    email: 'info@modern-print.com',
    phone: '966-14-567-8901'
  },
  {
    id: 5,
    company_name: 'مؤسسة المعدات الثقيلة',
    description: 'توريد وصيانة المعدات الثقيلة',
    rating: 4.4,
    total_orders: 9,
    is_favorite: false,
    logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    address: 'الدمام، المملكة العربية السعودية',
    email: 'sales@heavy-equip.com',
    phone: '966-15-678-9012'
  },
  {
    id: 6,
    company_name: 'شركة الأمن الشامل',
    description: 'خدمات الأمن وحماية المنشآت',
    rating: 4.3,
    total_orders: 12,
    is_favorite: false,
    logo: 'https://images.unsplash.com/photo-1554224154-1a7f3e871c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    address: 'جدة، المملكة العربية السعودية',
    email: 'contact@comprehensive-security.com',
    phone: '966-16-789-0123'
  }
];

const MerchantSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  

  const loadSuppliers = React.useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      let filteredSuppliers = MOCK_SUPPLIERS;
      if (search) {
        filteredSuppliers = MOCK_SUPPLIERS.filter(supplier => 
          supplier.company_name.toLowerCase().includes(search.toLowerCase()) ||
          supplier.description.toLowerCase().includes(search.toLowerCase())
        );
      }
      const itemsPerPage = 6;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);
      setSuppliers(paginatedSuppliers);
      setTotalPages(Math.ceil(filteredSuppliers.length / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError('حدث خطأ أثناء تحميل الموردين');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const handleSearch = () => {
    loadSuppliers(1, searchTerm);
  };

  const handleAddToFavorites = async (supplierId) => {
    try {
      // محاكاة طلب API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update supplier status in UI
      setSuppliers(prevSuppliers =>
        prevSuppliers.map(s =>
          s.id === supplierId ? { ...s, is_favorite: true } : s
        )
      );
      alert('تم إضافة المورد إلى المفضلة بنجاح!');
    } catch (error) {
      alert(`خطأ: ${error.message}`);
    }
  };

  if (loading && suppliers.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل الموردين...</p>
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
            onClick={() => loadSuppliers()}
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">تصفح الموردين</h1>

        <div className="flex space-x-4 rtl:space-x-reverse">
          <Input
            type="text"
            placeholder="ابحث عن مورد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
          />
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Search className="h-4 w-4 ml-2" /> بحث
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <Card key={supplier.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={supplier.logo || 'https://via.placeholder.com/80'} 
                        alt={supplier.company_name} 
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{supplier.company_name}</CardTitle>
                    </div>
                    {supplier.is_favorite && (
                      <Star className="h-5 w-5 text-yellow-500" fill="currentColor" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{supplier.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Star className="h-4 w-4 text-yellow-500 ml-2" />
                    <span>التقييم: {supplier.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <ExternalLink className="h-4 w-4 text-green-500 ml-2" />
                    <span>إجمالي الطلبات: {supplier.total_orders || 0}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <span className="mr-2">📍</span> {supplier.address}
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="mr-2">📧</span> {supplier.email}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <Link to={`/merchant/suppliers/${supplier.id}/products`}>
                      <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400">
                        عرض المنتجات <ExternalLink className="h-4 w-4 mr-2" />
                      </Button>
                    </Link>
                    {!supplier.is_favorite ? (
                      <Button onClick={() => handleAddToFavorites(supplier.id)} className="bg-purple-600 hover:bg-purple-700 text-white">
                        <PlusCircle className="h-4 w-4 ml-2" /> إضافة للمفضلة
                      </Button>
                    ) : (
                      <Button disabled className="bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed">
                        <Star className="h-4 w-4 ml-2" /> في المفضلة
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <AlertCircle className="h-16 w-16 mx-auto" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد موردين لعرضهم.</p>
              <button 
                onClick={() => loadSuppliers()} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 rtl:space-x-reverse mt-6">
            <Button
              onClick={() => loadSuppliers(currentPage - 1, searchTerm)}
              disabled={currentPage === 1}
              variant="outline"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            >
              السابق
            </Button>
            {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  onClick={() => loadSuppliers(index + 1, searchTerm)}
                variant={currentPage === index + 1 ? "default" : "outline"}
                className={currentPage === index + 1 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              onClick={() => loadSuppliers(currentPage + 1, searchTerm)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
            >
              التالي
            </Button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default MerchantSuppliers;
