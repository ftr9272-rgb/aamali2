import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const SupplierProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  // modal and selection handled in separate pages; not used here

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try real API first
        const { products } = await import('../../lib/api.js').then(m => m.apiFetch('/api/supplier/products'));
        if (Array.isArray(products)) {
          setProducts(products.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            stock: p.stock_quantity ?? p.stock ?? 0,
            status: p.is_active ? 'active' : (p.stock_quantity <= 0 ? 'out_of_stock' : 'low_stock'),
            image: p.images && p.images.length ? p.images[0] : '/api/placeholder/150/150',
            description: p.description || '',
            sku: p.sku || `SKU-${p.id}`
          })));
          return;
        }
      } catch (err) {
        // fallback to mock data if backend not available
        console.warn('API fetch failed, using mock products', err);
      }

      // Mock fallback
      const mockProducts = [
        {
          id: 1,
          name: 'جهاز كمبيوتر محمول HP',
          category: 'إلكترونيات',
          price: 2500,
          stock: 25,
          status: 'active',
          image: '/api/placeholder/150/150',
          description: 'جهاز كمبيوتر محمول عالي الأداء',
          sku: 'HP-LAP-001'
        },
        {
          id: 2,
          name: 'هاتف ذكي Samsung',
          category: 'إلكترونيات',
          price: 1800,
          stock: 15,
          status: 'active',
          image: '/api/placeholder/150/150',
          description: 'هاتف ذكي بمواصفات متقدمة',
          sku: 'SAM-PHO-002'
        }
      ];
      setProducts(mockProducts);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'متوفر';
      case 'low_stock':
        return 'مخزون منخفض';
      case 'out_of_stock':
        return 'نفد المخزون';
      default:
        return status;
    }
  };

  const categories = ['all', 'إلكترونيات', 'أثاث', 'ملابس', 'أدوات منزلية'];

  // delete handled inline to call backend API

  return (
    <div className="p-6 space-y-6">
      {/* العنوان والإحصائيات */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المنتجات</h1>
            <p className="text-gray-600">إدارة وتنظيم منتجاتك بسهولة</p>
          </div>
          <Button 
            onClick={() => navigate('/supplier/add-product')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            إضافة منتج جديد
          </Button>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المنتجات</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">المنتجات النشطة</p>
                  <p className="text-2xl font-bold text-green-600">
                    {products.filter(p => p.status === 'active').length}
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
                  <p className="text-sm text-gray-600">مخزون منخفض</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {products.filter(p => p.status === 'low_stock').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">نفد المخزون</p>
                  <p className="text-2xl font-bold text-red-600">
                    {products.filter(p => p.status === 'out_of_stock').length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
  </div>

      {/* أدوات البحث والتصفية */}
      <div>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="البحث في المنتجات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'جميع الفئات' : category}
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
  </div>

      {/* قائمة المنتجات */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>قائمة المنتجات</CardTitle>
            <CardDescription>
              عرض {filteredProducts.length} من أصل {products.length} منتج
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredProducts.map((product) => (
                       <div
                         key={product.id}
                         className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                       >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">السعر</p>
                        <p className="font-bold text-lg">{product.price.toLocaleString()} ريال</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">المخزون</p>
                        <p className="font-bold text-lg">{product.stock}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/supplier/products/${product.id}`)}>
                      <Eye className="h-4 w-4 mr-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/supplier/edit-product/${product.id}`)}>
                      <Edit className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={async () => {
                        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
                        try {
                          const api = await import('../../lib/api.js');
                          await api.apiFetch(`/api/supplier/products/${product.id}`, { method: 'DELETE' });
                          setProducts(prev => prev.filter(p => p.id !== product.id));
                        } catch (err) {
                          console.error('حذف المنتج فشل:', err);
                          alert('فشل حذف المنتج');
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
            </div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد منتجات تطابق البحث</p>
              </div>
            )}
          </CardContent>
        </Card>
  </div>
    </div>
  );
};

export default SupplierProducts;

