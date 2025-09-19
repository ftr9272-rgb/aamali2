import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
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
  Clock,
  MapPin,
  Route
} from 'lucide-react';

import { apiFetch } from '../../lib/api';

const ShippingDashboard = () => {
  const [selectedPeriod, _setSelectedPeriod] = useState('daily');
  // keep selectedPeriod accessible for future period filtering
  const _period = selectedPeriod;
  const [dashboardData, setDashboardData] = useState(null);
  const companyId = 1; // change if needed or pass as prop

  useEffect(() => {
    // fetch dashboard stats for the shipping company
    const fetchDashboard = async () => {
      try {
        const json = await apiFetch(`/api/shipping/companies/${companyId}/dashboard`);
        setDashboardData(json);
      } catch (e) {
        // silently ignore fetch errors; keep using fallback data
        console.debug('Shipping dashboard fetch failed', e);
      }
    };
    fetchDashboard();
  }, [companyId]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const formatNumber = (n) => {
    if (n === null || n === undefined) return '-';
    try { return Number(n).toLocaleString(); } catch { return String(n); }
  };

  const statsCards = [
    {
      title: 'إجمالي الإيرادات',
      value: dashboardData ? formatNumber(dashboardData.total_revenue) : '95,320',
      unit: 'ر.س',
      change: '+22.1%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'from-indigo-500 to-purple-400',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'الشحنات الكليّة',
      value: dashboardData ? formatNumber(dashboardData.total_shipments) : '47',
      unit: 'شحنة',
      change: '+8.5%',
      changeType: 'positive',
      icon: Truck,
      color: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'السائقون/النشطون',
      value: dashboardData ? formatNumber(dashboardData.active_drivers) : '28',
      unit: 'حالة',
      change: '+15.2%',
      changeType: 'positive',
      icon: Users,
      color: 'from-green-500 to-emerald-400',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'عروض مرسلة',
      value: dashboardData ? formatNumber(dashboardData.active_quotes) : '12',
      unit: 'عرض',
      change: '+6.3%',
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
      type: 'shipment',
      title: 'شحنة جديدة من شركة التجارة المتقدمة',
      time: 'منذ 15 دقيقة',
      icon: Truck,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      id: 2,
      type: 'delivery',
      title: 'تم تسليم شحنة إلى الرياض بنجاح',
      time: 'منذ ساعة',
      icon: CheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      type: 'quote',
      title: 'طلب عرض سعر جديد للشحن',
      time: 'منذ ساعتين',
      icon: FileText,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 4,
      type: 'driver',
      title: 'سائق جديد انضم للفريق',
      time: 'منذ 3 ساعات',
      icon: UserPlus,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  const activeShipments = [
    {
      id: 1,
      trackingNumber: 'SHP-2024-001',
      from: 'الرياض',
      to: 'جدة',
      customer: 'شركة الأعمال التجارية',
      driver: 'أحمد محمد',
      status: 'في الطريق',
      progress: 65,
      estimatedDelivery: '2024-09-08',
      value: 15000,
      priority: 'عالية'
    },
    {
      id: 2,
      trackingNumber: 'SHP-2024-002',
      from: 'الدمام',
      to: 'الرياض',
      customer: 'مؤسسة التقنية الحديثة',
      driver: 'محمد علي',
      status: 'تم التحميل',
      progress: 25,
      estimatedDelivery: '2024-09-09',
      value: 8500,
      priority: 'متوسطة'
    },
    {
      id: 3,
      trackingNumber: 'SHP-2024-003',
      from: 'جدة',
      to: 'المدينة',
      customer: 'شركة الأمن الشامل',
      driver: 'عبدالله سعد',
      status: 'جاهز للتسليم',
      progress: 90,
      estimatedDelivery: '2024-09-07',
      value: 12000,
      priority: 'عالية'
    }
  ];

  const pendingQuotes = [
    {
      id: 1,
      quoteNumber: 'QT-2024-001',
      customer: 'شركة الإلكترونيات الحديثة',
      from: 'الرياض',
      to: 'الدمام',
      weight: '500 كجم',
      dimensions: '2×1.5×1 متر',
      requestDate: '2024-09-07',
      urgency: 'عادي'
    },
    {
      id: 2,
      quoteNumber: 'QT-2024-002',
      customer: 'مصنع الأثاث الذهبي',
      from: 'جدة',
      to: 'الرياض',
      weight: '1200 كجم',
      dimensions: '3×2×1.5 متر',
      requestDate: '2024-09-07',
      urgency: 'عاجل'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'في الطريق': return 'text-blue-600 bg-blue-50';
      case 'تم التحميل': return 'text-amber-600 bg-amber-50';
      case 'جاهز للتسليم': return 'text-green-600 bg-green-50';
      case 'تم التسليم': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'عالية': return 'text-red-600 bg-red-50';
      case 'متوسطة': return 'text-amber-600 bg-amber-50';
      case 'منخفضة': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <motion.div 
        className="bg-gradient-to-br from-indigo-600 to-purple-500 rounded-3xl p-6 text-white shadow-2xl mb-8"
        {...fadeInUp}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="mb-8 lg:mb-0">
            <h2 className="text-4xl font-bold mb-3">لوحة تحكم شركة الشحن</h2>
            <p className="text-indigo-100 text-lg max-w-2xl">
              أدر شحناتك وسائقيك وقدم خدمات الشحن للتجار والموردين بكفاءة عالية.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                إضافة شحنة جديدة
              </button>
              <button className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full font-bold hover:bg-white/10 transition-colors">
                تتبع الشحنات
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="text-center">
              <p className="text-4xl font-bold">47</p>
              <p className="text-indigo-200">شحنة نشطة</p>
            </div>
            <div className="w-px h-12 bg-indigo-400 hidden sm:block"></div>
            <div className="text-center">
              <p className="text-4xl font-bold">28</p>
              <p className="text-indigo-200">عميل نشط</p>
            </div>
            <div className="w-px h-12 bg-indigo-400 hidden sm:block"></div>
            <div className="text-center">
              <p className="text-4xl font-bold">95K</p>
              <p className="text-indigo-200">إجمالي الإيرادات</p>
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
                stat.changeType === 'positive' ? 'text-indigo-600 bg-indigo-50' : 'text-red-600 bg-red-50'
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

      {/* Recent Activity & Active Shipments */}
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
          <button className="w-full mt-6 text-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
            عرض كل النشاطات
          </button>
        </motion.div>

        {/* Active Shipments */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">الشحنات النشطة</h3>
            <button className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center transition-colors">
              <span>عرض الكل</span>
              <ChevronDown className="w-4 h-4 mr-1" />
            </button>
          </div>
          <div className="space-y-4">
            {activeShipments.map((shipment, index) => (
              <motion.div 
                key={shipment.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{shipment.trackingNumber}</h4>
                    <p className="text-sm text-gray-600">{shipment.customer}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                      {shipment.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(shipment.priority)}`}>
                      {shipment.priority}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <MapPin className="w-4 h-4 text-gray-400 ml-2" />
                  <span className="text-sm text-gray-600">{shipment.from}</span>
                  <Route className="w-4 h-4 text-gray-400 mx-2" />
                  <span className="text-sm text-gray-600">{shipment.to}</span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">التقدم</span>
                    <span className="text-sm font-medium text-gray-800">{shipment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${shipment.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">السائق: {shipment.driver}</p>
                    <p className="text-sm text-gray-600">التسليم المتوقع: {shipment.estimatedDelivery}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-indigo-600">{shipment.value.toLocaleString()} ر.س</p>
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors">
                      تتبع الشحنة
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pending Quotes */}
      <motion.div 
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">طلبات عروض الأسعار</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{pendingQuotes.length} طلب جديد</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-semibold text-gray-700">رقم الطلب</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">العميل</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">المسار</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الوزن</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الأبعاد</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الأولوية</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {pendingQuotes.map((quote, index) => (
                <motion.tr 
                  key={quote.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                >
                  <td className="py-4 px-4 font-medium text-gray-800">{quote.quoteNumber}</td>
                  <td className="py-4 px-4 text-gray-600">{quote.customer}</td>
                  <td className="py-4 px-4 text-gray-600">{quote.from} → {quote.to}</td>
                  <td className="py-4 px-4 text-gray-600">{quote.weight}</td>
                  <td className="py-4 px-4 text-gray-600">{quote.dimensions}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quote.urgency === 'عاجل' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {quote.urgency}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm">
                        إرسال عرض
                      </button>
                      <button className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                        تفاصيل
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
          <button className="flex flex-col items-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors group">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">إضافة شحنة</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">إدارة الأسطول</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">إدارة السائقين</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors group">
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

export default ShippingDashboard;

