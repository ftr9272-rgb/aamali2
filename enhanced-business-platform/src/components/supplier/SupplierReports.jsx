import React, { useState, useEffect } from 'react';
// motion is used via JSX tags (e.g. <motion.div />); ESLint may false-positive that it's unused
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Download,
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const SupplierReports = () => {
  const [reportData, setReportData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('sales');

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      // محاكاة البيانات - في التطبيق الحقيقي ستأتي من API
      const mockData = {
        sales: {
          current: 125000,
          previous: 98000,
          growth: 27.6,
          chartData: [
            { month: 'يناير', sales: 85000 },
            { month: 'فبراير', sales: 92000 },
            { month: 'مارس', sales: 78000 },
            { month: 'أبريل', sales: 105000 },
            { month: 'مايو', sales: 118000 },
            { month: 'يونيو', sales: 125000 }
          ]
        },
        orders: {
          total: 89,
          completed: 81,
          pending: 8,
          cancelled: 0,
          chartData: [
            { status: 'مكتملة', count: 81, color: '#10B981' },
            { status: 'في الانتظار', count: 8, color: '#F59E0B' }
          ]
        },
        products: {
          total: 156,
          active: 142,
          lowStock: 8,
          outOfStock: 6,
          topSelling: [
            { name: 'جهاز كمبيوتر محمول HP', sales: 25, revenue: 62500 },
            { name: 'هاتف ذكي Samsung', sales: 18, revenue: 32400 },
            { name: 'طاولة مكتب خشبية', sales: 15, revenue: 12000 },
            { name: 'كرسي مكتب مريح', sales: 12, revenue: 5400 }
          ]
        },
        merchants: {
          total: 24,
          active: 18,
          vip: 3,
          topMerchants: [
            { name: 'متجر الأسواق الحديثة', orders: 45, spent: 125000 },
            { name: 'متجر الجودة', orders: 67, spent: 198000 },
            { name: 'سوق المدينة', orders: 32, spent: 89000 },
            { name: 'متجر التقنية', orders: 12, spent: 25000 }
          ]
        }
      };
      setReportData(mockData);
    } catch (error) {
      console.error('خطأ في جلب بيانات التقارير:', error);
    }
  };

  const reportTypes = [
    { id: 'sales', label: 'تقرير المبيعات', icon: DollarSign },
    { id: 'orders', label: 'تقرير الطلبات', icon: ShoppingCart },
    { id: 'products', label: 'تقرير المنتجات', icon: Package },
    { id: 'merchants', label: 'تقرير التجار', icon: Users }
  ];

  const periods = [
    { id: 'week', label: 'أسبوعي' },
    { id: 'month', label: 'شهري' },
    { id: 'quarter', label: 'ربع سنوي' },
    { id: 'year', label: 'سنوي' }
  ];

  const handleExportReport = (format) => {
    // منطق تصدير التقرير
    console.log(`تصدير التقرير بصيغة ${format}`);
    alert(`سيتم تصدير التقرير بصيغة ${format}`);
  };

  const renderSalesReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المبيعات الحالية</p>
                <p className="text-2xl font-bold">{reportData.sales?.current?.toLocaleString()} ريال</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المبيعات السابقة</p>
                <p className="text-2xl font-bold">{reportData.sales?.previous?.toLocaleString()} ريال</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">معدل النمو</p>
                <p className="text-2xl font-bold text-green-600">+{reportData.sales?.growth}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اتجاه المبيعات</CardTitle>
          <CardDescription>المبيعات خلال الأشهر الماضية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.sales?.chartData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{item.month}</span>
                <span className="font-bold text-green-600">{item.sales.toLocaleString()} ريال</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrdersReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{reportData.orders?.total}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">طلبات مكتملة</p>
                <p className="text-2xl font-bold text-green-600">{reportData.orders?.completed}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">طلبات معلقة</p>
                <p className="text-2xl font-bold text-yellow-600">{reportData.orders?.pending}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">طلبات ملغية</p>
                <p className="text-2xl font-bold text-red-600">{reportData.orders?.cancelled}</p>
              </div>
              <FileText className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>توزيع الطلبات</CardTitle>
          <CardDescription>توزيع الطلبات حسب الحالة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.orders?.chartData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium">{item.status}</span>
                </div>
                <span className="font-bold">{item.count} طلب</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProductsReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold">{reportData.products?.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">منتجات نشطة</p>
                <p className="text-2xl font-bold text-green-600">{reportData.products?.active}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{reportData.products?.lowStock}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">نفد المخزون</p>
                <p className="text-2xl font-bold text-red-600">{reportData.products?.outOfStock}</p>
              </div>
              <Package className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
          <CardDescription>المنتجات الأكثر مبيعاً خلال الفترة المحددة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.products?.topSelling?.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} مبيعة</p>
                </div>
                <p className="font-bold text-green-600">{product.revenue.toLocaleString()} ريال</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMerchantsReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي التجار</p>
                <p className="text-2xl font-bold">{reportData.merchants?.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تجار نشطون</p>
                <p className="text-2xl font-bold text-green-600">{reportData.merchants?.active}</p>
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
                <p className="text-2xl font-bold text-purple-600">{reportData.merchants?.vip}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>أفضل التجار</CardTitle>
          <CardDescription>التجار الأكثر نشاطاً وإنفاقاً</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.merchants?.topMerchants?.map((merchant, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{merchant.name}</p>
                  <p className="text-sm text-gray-600">{merchant.orders} طلب</p>
                </div>
                <p className="font-bold text-green-600">{merchant.spent.toLocaleString()} ريال</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'sales':
        return renderSalesReport();
      case 'orders':
        return renderOrdersReport();
      case 'products':
        return renderProductsReport();
      case 'merchants':
        return renderMerchantsReport();
      default:
        return renderSalesReport();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* العنوان والأدوات */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">التقارير والإحصائيات</h1>
            <p className="text-gray-600">تحليل شامل لأداء أعمالك ومبيعاتك</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExportReport('PDF')}>
              <Download className="h-4 w-4 mr-2" />
              تصدير PDF
            </Button>
            <Button variant="outline" onClick={() => handleExportReport('Excel')}>
              <Download className="h-4 w-4 mr-2" />
              تصدير Excel
            </Button>
          </div>
        </div>

        {/* أدوات التحكم */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex gap-2">
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {reportTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {periods.map(period => (
                    <option key={period.id} value={period.id}>{period.label}</option>
                  ))}
                </select>
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                تطبيق المرشحات
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* محتوى التقرير */}
      <motion.div
        key={selectedReport}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderReportContent()}
      </motion.div>
    </div>
  );
};

export default SupplierReports;

