import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Users,
  DollarSign,
  ShoppingBag,
  UserPlus,
  MessageCircle,
  Star,
  ChevronDown,
  BarChart3,
  Truck,
  Eye,
  Plus,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SupplierDashboard = () => {
  const [_selectedPeriod, _setSelectedPeriod] = useState('daily');
  const navigate = useNavigate();

  // دالة للانتقال إلى صفحة المنتجات
  const goToProducts = () => {
    navigate('/supplier/products');
  };

  // دالة للانتقال إلى صفحة الطلبات
  const goToOrders = () => {
    navigate('/supplier/orders');
  };

  // دالة للانتقال إلى صفحة عروض الأسعار
  const _goToQuotations = () => {
    navigate('/supplier/quotations');
  };

  // دالة للانتقال إلى صفحة التجار
  const goToMerchants = () => {
    navigate('/supplier/merchants');
  };

  // دالة للانتقال إلى صفحة التقارير
  const goToReports = () => {
    navigate('/supplier/reports');
  };

  // دالة للانتقال إلى صفحة الإعدادات
  const _goToSettings = () => {
    navigate('/supplier/settings');
  };

  // دالة للانتقال إلى صفحة الملف الشخصي
  const _goToProfile = () => {
    navigate('/supplier/profile');
  };

  // دالة للانتقال إلى السوق الذكي
  const _goToMarketplace = () => {
    navigate('/marketplace');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const statsCards = [
    {
      title: 'إجمالي المبيعات',
      value: '180,450',
      unit: 'ر.س',
      change: '+18.3%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-400',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'المنتجات النشطة',
      value: '89',
      unit: 'منتج',
      change: '+5.7%',
      changeType: 'positive',
      icon: Package,
      color: 'from-blue-500 to-indigo-400',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'العملاء النشطين',
      value: '34',
      unit: 'عميل',
      change: '+12.1%',
      changeType: 'positive',
      icon: Users,
      color: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'الطلبات الجديدة',
      value: '23',
      unit: 'طلب',
      change: '+9.4%',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'from-amber-500 to-orange-400',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'order',
      title: 'طلب جديد من شركة التجارة المتقدمة',
      time: 'منذ 5 دقائق',
      icon: ShoppingBag,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      type: 'product',
      title: 'تم إضافة منتج جديد للكتالوج',
      time: 'منذ 30 دقيقة',
      icon: Package,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      type: 'inventory',
      title: 'تحديث مخزون المنتجات',
      time: 'منذ ساعة',
      icon: Package,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      id: 4,
      type: 'message',
      title: 'استفسار جديد من عميل',
      time: 'منذ ساعتين',
      icon: MessageCircle,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600'
    }
  ];

  const myProducts = [
    {
      id: 1,
      name: 'لابتوب HP EliteBook',
      category: 'إلكترونيات',
      price: 2500,
      stock: 15,
      status: 'متوفر',
      orders: 45,
      views: 234,
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'الأكثر مبيعاً', color: 'bg-green-500' }
    },
    {
      id: 2,
      name: 'كاميرا مراقبة ذكية',
      category: 'أمان',
      price: 320,
      stock: 25,
      status: 'متوفر',
      orders: 67,
      views: 189,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'جديد', color: 'bg-blue-500' }
    },
    {
      id: 3,
      name: 'راوتر WiFi 6 متقدم',
      category: 'شبكات',
      price: 450,
      stock: 0,
      status: 'نفد',
      orders: 89,
      views: 156,
      image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'نفد المخزون', color: 'bg-red-500' }
    },
    {
      id: 4,
      name: 'مكتب الأعمال المطور',
      category: 'أثاث',
      price: 4250,
      stock: 12,
      status: 'قليل',
      orders: 23,
      views: 98,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'مخزون قليل', color: 'bg-amber-500' }
    }
  ];

  const pendingOrders = [
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      customer: 'شركة الأعمال التجارية',
      product: 'لابتوب HP EliteBook',
      quantity: 10,
      amount: 25000,
      date: '2024-09-07',
      status: 'جديد'
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-002',
      customer: 'مؤسسة التقنية الحديثة',
      product: 'كاميرا مراقبة ذكية',
      quantity: 5,
      amount: 1600,
      date: '2024-09-07',
      status: 'قيد المراجعة'
    },
    {
      id: 3,
      orderNumber: 'ORD-2024-003',
      customer: 'شركة الأمن الشامل',
      product: 'مكتب الأعمال المطور',
      quantity: 3,
      amount: 12750,
      date: '2024-09-06',
      status: 'جديد'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'متوفر': return 'text-green-600 bg-green-50';
      case 'قليل': return 'text-amber-600 bg-amber-50';
      case 'نفد': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-3xl p-10 text-white shadow-2xl mb-8"
        {...fadeInUp}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="mb-8 lg:mb-0">
            <h2 className="text-4xl font-bold mb-3">لوحة تحكم المورد</h2>
            <p className="text-green-100 text-lg max-w-2xl">
              اعرض منتجاتك واستقبل طلبات التجار وأدر عملياتك التجارية بكفاءة عالية.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                className="bg-white text-green-600 px-6 py-2 rounded-full font-bold hover:bg-green-50 transition-colors"
                onClick={goToProducts}
              >
                إضافة منتج جديد
              </button>
              <button 
                className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full font-bold hover:bg-white/10 transition-colors"
                onClick={goToReports}
              >
                عرض الإحصائيات
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="text-center">
              <p className="text-4xl font-bold">89</p>
              <p className="text-green-200">منتج نشط</p>
            </div>
            <div className="w-px h-12 bg-green-400 hidden sm:block"></div>
            <div className="text-center">
              <p className="text-4xl font-bold">34</p>
              <p className="text-green-200">عميل نشط</p>
            </div>
            <div className="w-px h-12 bg-green-400 hidden sm:block"></div>
            <div className="text-center">
              <p className="text-4xl font-bold">180K</p>
              <p className="text-green-200">إجمالي المبيعات</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-full -translate-y-4 translate-x-4"
                 style={{ background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}></div>

            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center transition-transform duration-300 hover:rotate-12 hover:scale-110`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
              <span className="text-gray-500 text-sm mr-2">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity & My Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">آخر النشاطات</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="flex items-start hover:bg-gray-50 p-3 rounded-lg transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <div className={`w-10 h-10 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0 ml-3`}>
                  <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full mt-6 text-center text-green-600 font-medium hover:text-green-700 transition-colors">
            عرض كل النشاطات
          </button>
        </motion.div>

        {/* My Products */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">منتجاتي المعروضة</h3>
            <button 
              className="text-green-600 font-medium hover:text-green-700 flex items-center transition-colors"
              onClick={goToProducts}
            >
              <span>إدارة المنتجات</span>
              <ChevronDown className="w-4 h-4 mr-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className={`absolute top-3 left-3 ${product.badge.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                    {product.badge.text}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </div>
                  <p className="text-gray-500 mb-4 text-sm">{product.category}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="font-bold text-xl text-green-600">
                        {product.price.toLocaleString()} <span className="text-sm">ر.س</span>
                      </span>
                      <p className="text-xs text-gray-500">الكمية: {product.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{product.orders} طلب</p>
                      <p className="text-xs text-gray-500">{product.views} مشاهدة</p>
                    </div>
                  </div>
                  <button 
                    className="w-full bg-green-500 text-white py-2 rounded-full font-semibold hover:bg-green-600 transition-colors text-sm"
                    onClick={goToProducts}
                  >
                    تعديل المنتج
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pending Orders */}
      <motion.div
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">طلبات التجار</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{pendingOrders.length} طلب جديد</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-semibold text-gray-700">رقم الطلب</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">العميل</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">المنتج</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الكمية</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">المبلغ</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الحالة</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                >
                  <td className="py-4 px-4 font-medium text-gray-800">{order.orderNumber}</td>
                  <td className="py-4 px-4 text-gray-600">{order.customer}</td>
                  <td className="py-4 px-4 text-gray-600">{order.product}</td>
                  <td className="py-4 px-4 text-gray-600">{order.quantity}</td>
                  <td className="py-4 px-4 font-semibold text-green-600">{order.amount.toLocaleString()} ر.س</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'جديد' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        onClick={() => goToOrders()}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        onClick={() => {
                          if (window.confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
                            // هنا يمكن إضافة منطق رفض الطلب
                            alert('تم رفض الطلب بنجاح');
                          }
                        }}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
            onClick={goToProducts}
          >
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">إضافة منتج</span>
          </button>
          <button 
            className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
            onClick={goToOrders}
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">إدارة المخزون</span>
          </button>
          <button 
            className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
            onClick={goToMerchants}
          >
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">إدارة العملاء</span>
          </button>
          <button 
            className="flex flex-col items-center p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors group"
            onClick={goToReports}
          >
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">عرض التقارير</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SupplierDashboard;
