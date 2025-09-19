import React, { useState, useEffect, useMemo } from 'react';
import { apiFetch } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
// Some files used `Motion` while others used `motion` — create an alias so both forms work
const Motion = motion;
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
  Calendar,
  Clock,
  Bell,
  Search,
  Filter,
  Download
} from 'lucide-react';

const MerchantDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [statsCards, setStatsCards] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginTestResult, setLoginTestResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // استخدام البيانات المحملة من الخادم أو البيانات الافتراضية إذا لم تكن متوفرة
  const displayRecentActivities = useMemo(() => {
    if (recentActivities.length > 0) return recentActivities;

    return [
      {
        id: 1,
        type: 'order',
        title: 'تم استلام طلب جديد',
        time: 'منذ 10 دقائق',
        icon: ShoppingBag,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        details: 'طلب #12345 - 5 منتجات'
      },
      {
        id: 2,
        type: 'quotation',
        title: 'تم استلام عرض سعر جديد',
        time: 'منذ ساعتين',
        icon: FileText,
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600',
        details: 'من شركة النور للإلكترونيات'
      },
      {
        id: 3,
        type: 'shipping',
        title: 'تم شحن طلبك',
        time: 'أمس',
        icon: Truck,
        iconBg: 'bg-purple-50',
        iconColor: 'text-purple-600',
        details: 'رقم الشحن: SH-98765'
      },
      {
        id: 4,
        type: 'supplier',
        title: 'مورد جديد مفضل',
        time: 'منذ 3 أيام',
        icon: Users,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
        details: 'شركة التقنية المتقدمة'
      }
    ];
  }, [recentActivities]);

  // تأثيرات الحركة والانتقال
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // تحميل بيانات لوحة التحكم من الخادم
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // تحميل بيانات لوحة التحكم
        const dashboardData = await apiFetch('/api/merchant/dashboard');

        // تحويل بيانات لوحة التحكم إلى تنسيق مطلوب
        setStatsCards([
          {
            title: 'إجمالي المبيعات',
            value: dashboardData.stats.total_spent ? dashboardData.stats.total_spent.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0',
            unit: 'ر.س',
            change: '+12.5%',
            changeType: 'positive',
            icon: DollarSign,
            color: 'from-emerald-500 to-teal-400',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            description: 'إجمالي الإنفاق'
          },
          {
            title: 'إجمالي الطلبات',
            value: dashboardData.stats.total_orders ? dashboardData.stats.total_orders : '0',
            unit: 'طلب',
            change: '+8.2%',
            changeType: 'positive',
            icon: ShoppingBag,
            color: 'from-blue-500 to-indigo-400',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            description: 'إجمالي الطلبات'
          },
          {
            title: 'الطلبات المعلقة',
            value: dashboardData.stats.pending_orders ? dashboardData.stats.pending_orders : '0',
            unit: 'طلب',
            change: '+5.4%',
            changeType: 'positive',
            icon: Clock,
            color: 'from-amber-500 to-orange-400',
            bgColor: 'bg-amber-50',
            iconColor: 'text-amber-600',
            description: 'طلبات قيد الانتظار'
          },
          {
            title: 'الموردين المفضلين',
            value: dashboardData.stats.favorite_suppliers ? dashboardData.stats.favorite_suppliers : '0',
            unit: 'مورد',
            change: '+3.1%',
            changeType: 'positive',
            icon: Users,
            color: 'from-purple-500 to-pink-400',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            description: 'موردين مفضلين'
          },
        ]);

        // تحميل النشاطات الحديثة بناءً على البيانات من الواجهة الخلفية
        const activities = [];

        // إضافة الطلبات الحديثة كأنشطة
        if (dashboardData.recent_orders && dashboardData.recent_orders.length > 0) {
          dashboardData.recent_orders.forEach(order => {
            activities.push({
              id: `order-${order.id}`,
              type: 'order',
              title: `طلب جديد #${order.id}`,
              time: formatDate(order.created_at),
              icon: ShoppingBag,
              iconBg: 'bg-blue-50',
              iconColor: 'text-blue-600',
              details: `المبلغ: ${order.total_amount.toFixed(2)} ر.س`,
              status: order.status,
              data: order
            });
          });
        }

        // إضافة طلبات عروض الأسعار
        if (dashboardData.active_quotation_requests && dashboardData.active_quotation_requests.length > 0) {
          dashboardData.active_quotation_requests.forEach(request => {
            activities.push({
              id: `request-${request.id}`,
              type: 'quotation_request',
              title: `طلب عرض سعر #${request.id}`,
              time: formatDate(request.created_at),
              icon: FileText,
              iconBg: 'bg-green-50',
              iconColor: 'text-green-600',
              details: `عدد العناصر: ${request.items_count || request.items?.length || 0}`,
              status: request.status,
              data: request
            });
          });
        }

        // إضافة عروض الأسعار المستلمة
        if (dashboardData.recent_quotations && dashboardData.recent_quotations.length > 0) {
          dashboardData.recent_quotations.forEach(quotation => {
            activities.push({
              id: `quotation-${quotation.id}`,
              type: 'quotation',
              title: `عرض سعر جديد من ${quotation.supplier_name || quotation.supplier?.company_name || 'مجهول'}`,
              time: formatDate(quotation.created_at),
              icon: FileText,
              iconBg: 'bg-purple-50',
              iconColor: 'text-purple-600',
              details: `المبلغ الإجمالي: ${quotation.total_amount.toFixed(2)} ر.س`,
              status: quotation.status,
              data: quotation
            });
          });
        }

        // إضافة المدفوعات المعلقة
        if (dashboardData.pending_payments && dashboardData.pending_payments.length > 0) {
          dashboardData.pending_payments.forEach(payment => {
            activities.push({
              id: `payment-${payment.id}`,
              type: 'payment',
              title: 'مدفوعة معلقة',
              time: formatDate(payment.created_at),
              icon: DollarSign,
              iconBg: 'bg-amber-50',
              iconColor: 'text-amber-600',
              details: `طلب: #${payment.purchase_order_id}`,
              status: payment.payment_status,
              data: payment
            });
          });
        }

        // ترتيب النشاطات حسب الأحدث
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));

        setRecentActivities(activities);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // دالة لتنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes > 0 ? `منذ ${diffMinutes} دقيقة` : 'الآن';
      }
      return `منذ ${diffHours} ساعة`;
    } else if (diffDays === 1) {
      return 'أمس';
    } else if (diffDays < 7) {
      return `منذ ${diffDays} يوم`;
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  // اختبار سريع للمصادقة لعرض نتيجة مباشرة داخل الواجهة (مفيد عندما لا يمكن لصق أو رؤية Console)
  useEffect(() => {
    let cancelled = false;
    const runLoginTest = async () => {
      try {
        // Use apiFetch so Authorization header and error handling are consistent
        const data = await apiFetch('/api/auth/login', { method: 'POST', body: { username: 'supplier_demo', password: '123456' } });
        if (!cancelled) setLoginTestResult({ status: 200, ok: true, body: data });
      } catch (err) {
        // apiFetch throws Error with message containing status + body when non-2xx
        if (!cancelled) {
          const msg = err && err.message ? err.message : String(err);
          setLoginTestResult({ error: msg });
        }
      }
    };
    runLoginTest();
    return () => { cancelled = true; };
  }, []);

  // استخدام البيانات الافتراضية مؤقتاً حتى يتم تحميل المنتجات من الخادم
  const featuredProducts = [
    {
      id: 1,
      name: 'حاسوب محمول للأعمال',
      supplier: 'شركة النور للإلكترونيات',
      price: 3500,
      originalPrice: null,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'جديد', color: 'bg-emerald-500' }
    },
    {
      id: 2,
      name: 'أثاث مكتبي فاخر',
      supplier: 'مصنع الأخشاب الذهبية',
      price: 1200,
      originalPrice: null,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'الأكثر مبيعاً', color: 'bg-blue-500' }
    },
    {
      id: 3,
      name: 'كاميرات مراقبة HD',
      supplier: 'شركة التقنية الآمنة',
      price: 450,
      originalPrice: null,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'مخزون محدود', color: 'bg-amber-500' }
    },
    {
      id: 4,
      name: 'طابعة ليزر متعددة الوظائف',
      supplier: 'شركة الطباعة الحديثة',
      price: 850,
      originalPrice: 1200,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'عرض خاص', color: 'bg-rose-500' }
    }
  ];

  // عرض رسائل التحميل أو الخطأ
  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="mt-6 text-lg text-gray-600">جاري تحميل لوحة التحكم...</p>
          <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-red-200">
          <div className="text-red-500 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">خطأ في تحميل البيانات</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-medium"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* إشعار حالة المصادقة */}
      <AnimatePresence>
        {loginTestResult && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-lg text-sm"
          >
            {loginTestResult.error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                فشل اختبار الدخول: {String(loginTestResult.error)}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                اختبار الدخول: الحالة {loginTestResult.status} — مُنجز بنجاح
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* قسم البحث والتصفية */}
      <motion.div 
        className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        {...fadeIn}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن منتجات، موردين، أو طلبات..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
              <span>تصفية</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
              <Download className="w-5 h-5" />
              <span>تصدير تقرير</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Hero Section (mirrored layout: big stats on the left, welcome text on the right) */}
      <Motion.div
        className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10"
        {...fadeInUp}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: large stats (sourced from statsCards state) */}
          <div className="w-full lg:w-2/5">
            <div className="flex items-center justify-start space-x-6 lg:space-x-8 rtl:space-x-reverse">
              {/** statsCards is an array of 4; map first three to big numbers with safe fallbacks **/}
              {statsCards.slice(0, 3).map((s) => (
                <div key={s.title} className="flex flex-col items-center text-left">
                  <p className="text-5xl md:text-6xl font-extrabold leading-none">{String(s.value ?? '0')}</p>
                  <p className="text-emerald-100 mt-2">{s.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: welcome text + CTAs */}
          <div className="w-full lg:w-3/5 text-right lg:text-right">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">مرحباً بك في منصة أعمالي!</h1>
            <p className="text-emerald-100 text-lg max-w-2xl mb-6">
              هنا يمكنك إدارة جميع عملياتك التجارية بسلاسة، من الموردين إلى العملاء، كل ذلك في مكان واحد.
            </p>
            <div className="flex flex-wrap justify-end gap-4">
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-3">
                <Plus className="w-5 h-5" />
                ابدأ الآن
              </button>
              <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors flex items-center gap-3">
                <FileText className="w-5 h-5" />
                عرض الدليل
              </button>
            </div>
          </div>
        </div>
      </Motion.div>

      {/* أقسام لوحة التحكم */}
      <div className="mb-8">
        {/* علامات التبويب */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            الطلبات
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            المنتجات
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            التحليلات
          </button>
        </div>

        {/* محتوى علامات التبويب */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* بطاقات الإحصائيات */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {statsCards.map((stat, index) => (
                  <Motion.div
                    key={stat.title}
                    variants={fadeInUp}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Background gradient effect */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-full -translate-y-4 translate-x-4"
                         style={{ background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}></div>

                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center transition-transform duration-300 hover:rotate-6 hover:scale-110`}>
                        <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        stat.changeType === 'positive' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                    <p className="text-gray-500 text-xs mb-3">{stat.description}</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
                      <span className="text-gray-500 text-sm ml-2">{stat.unit}</span>
                    </div>
                  </Motion.div>
                ))}
              </motion.div>

              {/* النشاطات الحديثة والمنتجات المميزة */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* النشاطات الحديثة */}
                <Motion.div
                  className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-500" />
                      آخر النشاطات
                    </h3>
                    <button className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors flex items-center gap-1">
                      <span>عرض الكل</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {displayRecentActivities.map((activity, index) => (
                      <Motion.div
                        key={activity.id}
                        className="flex items-start hover:bg-gray-50 p-3 rounded-lg transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      >
                        <div className={`w-10 h-10 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.details}</p>
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                </Motion.div>

                {/* المنتجات المميزة */}
                <Motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500" />
                      أحدث المنتجات المضافة
                    </h3>
                    <button className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1 transition-colors">
                      <span>عرض الكل</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredProducts.map((product, index) => (
                      <Motion.div
                        key={product.id}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      >
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className={`absolute top-3 left-3 ${product.badge.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                            {product.badge.text}
                          </span>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-500 mb-4 text-sm">{product.supplier}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-xl text-emerald-600">
                                {product.price.toLocaleString()} <span className="text-sm">ر.س</span>
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  {product.originalPrice.toLocaleString()} ر.س
                                </span>
                              )}
                            </div>
                            <button className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-600 transition-colors text-sm">
                              تفاصيل
                            </button>
                          </div>
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                </Motion.div>
              </div>

              {/* الرسم البياني للأداء */}
              <Motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    أداء المبيعات
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedPeriod('daily')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedPeriod === 'daily'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      يومي
                    </button>
                    <button
                      onClick={() => setSelectedPeriod('weekly')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedPeriod === 'weekly'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      أسبوعي
                    </button>
                    <button
                      onClick={() => setSelectedPeriod('monthly')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedPeriod === 'monthly'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      شهري
                    </button>
                  </div>
                </div>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">سيتم عرض الرسم البياني هنا</p>
                    <p className="text-sm text-gray-400 mt-2">البيانات للفترة: {selectedPeriod === 'daily' ? 'يومي' : selectedPeriod === 'weekly' ? 'أسبوعي' : 'شهري'}</p>
                  </div>
                </div>
              </Motion.div>

              {/* الإجراءات السريعة */}
              <Motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-500" />
                  إجراءات سريعة
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">إضافة طلب</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">إدارة الموردين</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">تتبع الشحنات</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:from-amber-100 hover:to-amber-200 transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">عرض التقارير</span>
                  </button>
                </div>
              </Motion.div>
            </motion.div>
          )}

          {/* علامة تبويب الطلبات */}
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">طلباتي</h3>
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">سيتم عرض قائمة الطلبات هنا</p>
              </div>
            </motion.div>
          )}

          {/* علامة تبويب المنتجات */}
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">منتجاتي</h3>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">سيتم عرض قائمة المنتجات هنا</p>
              </div>
            </motion.div>
          )}

          {/* علامة تبويب التحليلات */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">تحليلات الأداء</h3>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">سيتم عرض التقارير والتحليلات هنا</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MerchantDashboard;
              type="text"
              placeholder="ابحث عن منتجات، موردين، أو طلبات..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
              <span>تصفية</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
              <Download className="w-5 h-5" />
              <span>تصدير تقرير</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Hero Section (mirrored layout: big stats on the left, welcome text on the right) */}
      <Motion.div
        className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10"
        {...fadeInUp}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: large stats (sourced from statsCards state) */}
          <div className="w-full lg:w-2/5">
            <div className="flex items-center justify-start space-x-6 lg:space-x-8 rtl:space-x-reverse">
              {/** statsCards is an array of 4; map first three to big numbers with safe fallbacks **/}
              {statsCards.slice(0, 3).map((s) => (
                <div key={s.title} className="flex flex-col items-center text-left">
                  <p className="text-5xl md:text-6xl font-extrabold leading-none">{String(s.value ?? '0')}</p>
                  <p className="text-emerald-100 mt-2">{s.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: welcome text + CTAs */}
          <div className="w-full lg:w-3/5 text-right lg:text-right">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">مرحباً بك في منصة أعمالي!</h1>
            <p className="text-emerald-100 text-lg max-w-2xl mb-6">
              هنا يمكنك إدارة جميع عملياتك التجارية بسلاسة، من الموردين إلى العملاء، كل ذلك في مكان واحد.
            </p>
            <div className="flex flex-wrap justify-end gap-4">
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-3">
                <Plus className="w-5 h-5" />
                ابدأ الآن
              </button>
              <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors flex items-center gap-3">
                <FileText className="w-5 h-5" />
                عرض الدليل
              </button>
            </div>
          </div>
        </div>
      </Motion.div>

      {/* أقسام لوحة التحكم */}
      <div className="mb-8">
        {/* علامات التبويب */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'orders'
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            الطلبات
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'products'
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            المنتجات
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            التحليلات
          </button>
        </div>

        {/* محتوى علامات التبويب */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* بطاقات الإحصائيات */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {statsCards.map((stat, index) => (
                  <Motion.div
                    key={stat.title}
                    variants={fadeInUp}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Background gradient effect */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-full -translate-y-4 translate-x-4"
                         style={{ background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}></div>

                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center transition-transform duration-300 hover:rotate-6 hover:scale-110`}>
                        <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        stat.changeType === 'positive' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                    <p className="text-gray-500 text-xs mb-3">{stat.description}</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
                      <span className="text-gray-500 text-sm ml-2">{stat.unit}</span>
                    </div>
                  </Motion.div>
                ))}
              </motion.div>

              {/* النشاطات الحديثة والمنتجات المميزة */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* النشاطات الحديثة */}
                <Motion.div
                  className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-500" />
                      آخر النشاطات
                    </h3>
                    <button className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors flex items-center gap-1">
                      <span>عرض الكل</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {displayRecentActivities.map((activity, index) => (
                      <Motion.div
                        key={activity.id}
                        className="flex items-start hover:bg-gray-50 p-3 rounded-lg transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      >
                        <div className={`w-10 h-10 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-800">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.details}</p>
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                </Motion.div>

                {/* المنتجات المميزة */}
                <Motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500" />
                      أحدث المنتجات المضافة
                    </h3>
                    <button className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1 transition-colors">
                      <span>عرض الكل</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredProducts.map((product, index) => (
                      <Motion.div
                        key={product.id}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      >
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className={`absolute top-3 left-3 ${product.badge.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                            {product.badge.text}
                          </span>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-500 mb-4 text-sm">{product.supplier}</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-xl text-emerald-600">
                                {product.price.toLocaleString()} <span className="text-sm">ر.س</span>
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  {product.originalPrice.toLocaleString()} ر.س
                                </span>
                              )}
                            </div>
                            <button className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-600 transition-colors text-sm">
                              تفاصيل
                            </button>
                          </div>
                        </div>
                      </Motion.div>
                    ))}
                  </div>
                </Motion.div>
              </div>

              {/* الرسم البياني للأداء */}
              <Motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    أداء المبيعات
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedPeriod('daily')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedPeriod === 'daily'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      يومي
                    </button>
                    <button
                      onClick={() => setSelectedPeriod('weekly')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedPeriod === 'weekly'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      أسبوعي
                    </button>
                    <button
                      onClick={() => setSelectedPeriod('monthly')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedPeriod === 'monthly'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      شهري
                    </button>
                  </div>
                </div>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">سيتم عرض الرسم البياني هنا</p>
                    <p className="text-sm text-gray-400 mt-2">البيانات للفترة: {selectedPeriod === 'daily' ? 'يومي' : selectedPeriod === 'weekly' ? 'أسبوعي' : 'شهري'}</p>
                  </div>
                </div>
              </Motion.div>

              {/* الإجراءات السريعة */}
              <Motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-500" />
                  إجراءات سريعة
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">إضافة طلب</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">إدارة الموردين</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">تتبع الشحنات</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:from-amber-100 hover:to-amber-200 transition-all group">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">عرض التقارير</span>
                  </button>
                </div>
              </Motion.div>
            </motion.div>
          )}

          {/* علامة تبويب الطلبات */}
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">طلباتي</h3>
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">سيتم عرض قائمة الطلبات هنا</p>
              </div>
            </motion.div>
          )}

          {/* علامة تبويب المنتجات */}
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">منتجاتي</h3>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">سيتم عرض قائمة المنتجات هنا</p>
              </div>
            </motion.div>
          )}

          {/* علامة تبويب التحليلات */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6">تحليلات الأداء</h3>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">سيتم عرض التقارير والتحليلات هنا</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MerchantDashboard;

        {/* Hero Section (mirrored layout: big stats on the left, welcome text on the right) */}
        <Motion.div
          className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10"
          {...fadeInUp}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: large stats (sourced from statsCards state) */}
            <div className="w-full lg:w-2/5">
              <div className="flex items-center justify-start space-x-6 lg:space-x-8 rtl:space-x-reverse">
                {/** statsCards is an array of 4; map first three to big numbers with safe fallbacks **/}
                {statsCards.slice(0, 3).map((s) => (
                  <div key={s.title} className="flex flex-col items-center text-left">
                    <p className="text-5xl md:text-6xl font-extrabold leading-none">{String(s.value ?? '0')}</p>
                    <p className="text-emerald-100 mt-2">{s.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: welcome text + CTAs */}
            <div className="w-full lg:w-3/5 text-right lg:text-right">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">مرحباً بك في منصة أعمالي!</h1>
              <p className="text-emerald-100 text-lg max-w-2xl mb-6">
                هنا يمكنك إدارة جميع عملياتك التجارية بسلاسة، من الموردين إلى العملاء، كل ذلك في مكان واحد.
              </p>
              <div className="flex flex-wrap justify-end gap-4">
                <button className="bg-white text-emerald-600 px-6 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  ابدأ الآن
                </button>
                <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  عرض الدليل
                </button>
              </div>
            </div>
          </div>
        </Motion.div>

        {/* أقسام لوحة التحكم */}
        <div className="mb-8">
          {/* علامات التبويب */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              الطلبات
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'products'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              المنتجات
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'text-emerald-500 border-b-2 border-emerald-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              التحليلات
            </button>
          </div>

          {/* محتوى علامات التبويب */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* بطاقات الإحصائيات */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {statsCards.map((stat, index) => (
                    <Motion.div
                      key={stat.title}
                      variants={fadeInUp}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Background gradient effect */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-full -translate-y-4 translate-x-4"
                           style={{ background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}></div>

                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center transition-transform duration-300 hover:rotate-6 hover:scale-110`}>
                          <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                        </div>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          stat.changeType === 'positive' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                      <p className="text-gray-500 text-xs mb-3">{stat.description}</p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
                        <span className="text-gray-500 text-sm ml-2">{stat.unit}</span>
                      </div>
                    </Motion.div>
                  ))}
                </motion.div>

                {/* النشاطات الحديثة والمنتجات المميزة */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* النشاطات الحديثة */}
                  <Motion.div
                    className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-500" />
                        آخر النشاطات
                      </h3>
                      <button className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors flex items-center gap-1">
                        <span>عرض الكل</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {displayRecentActivities.map((activity, index) => (
                        <Motion.div
                          key={activity.id}
                          className="flex items-start hover:bg-gray-50 p-3 rounded-lg transition-colors"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        >
                          <div className={`w-10 h-10 ${activity.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-800">{activity.title}</p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                            <p className="text-xs text-gray-400 mt-1">{activity.details}</p>
                          </div>
                        </Motion.div>
                      ))}
                    </div>
                  </Motion.div>

                  {/* المنتجات المميزة */}
                  <Motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-500" />
                        أحدث المنتجات المضافة
                      </h3>
                      <button className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1 transition-colors">
                        <span>عرض الكل</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {featuredProducts.map((product, index) => (
                        <Motion.div
                          key={product.id}
                          className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                        >
                          <div className="relative">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className={`absolute top-3 left-3 ${product.badge.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                              {product.badge.text}
                            </span>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-amber-400 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-500 mb-4 text-sm">{product.supplier}</p>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-xl text-emerald-600">
                                  {product.price.toLocaleString()} <span className="text-sm">ر.س</span>
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    {product.originalPrice.toLocaleString()} ر.س
                                  </span>
                                )}
                              </div>
                              <button className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-600 transition-colors text-sm">
                                تفاصيل
                              </button>
                            </div>
                          </div>
                        </Motion.div>
                      ))}
                    </div>
                  </Motion.div>
                </div>

                {/* الرسم البياني للأداء */}
                <Motion.div
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-500" />
                      أداء المبيعات
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedPeriod('daily')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          selectedPeriod === 'daily'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        يومي
                      </button>
                      <button
                        onClick={() => setSelectedPeriod('weekly')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          selectedPeriod === 'weekly'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        أسبوعي
                      </button>
                      <button
                        onClick={() => setSelectedPeriod('monthly')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          selectedPeriod === 'monthly'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                        شهري
                      </button>
                    </div>
                  </div>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">سيتم عرض الرسم البياني هنا</p>
                      <p className="text-sm text-gray-400 mt-2">البيانات للفترة: {selectedPeriod === 'daily' ? 'يومي' : selectedPeriod === 'weekly' ? 'أسبوعي' : 'شهري'}</p>
                    </div>
                  </div>
                </Motion.div>

                {/* الإجراءات السريعة */}
                <Motion.div
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-500" />
                    إجراءات سريعة
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all group">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">إضافة طلب</span>
                    </button>
                    <button className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">إدارة الموردين</span>
                    </button>
                    <button className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Truck className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">تتبع الشحنات</span>
                    </button>
                    <button className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl hover:from-amber-100 hover:to-amber-200 transition-all group">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">عرض التقارير</span>
                    </button>
                  </div>
                </Motion.div>
              </motion.div>
            )}

            {/* علامة تبويب الطلبات */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">طلباتي</h3>
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">سيتم عرض قائمة الطلبات هنا</p>
                </div>
              </motion.div>
            )}

            {/* علامة تبويب المنتجات */}
            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">منتجاتي</h3>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">سيتم عرض قائمة المنتجات هنا</p>
                </div>
              </motion.div>
            )}

            {/* علامة تبويب التحليلات */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6">تحليلات الأداء</h3>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">سيتم عرض التقارير والتحليلات هنا</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  export default MerchantDashboard;
      id: 1,
      name: 'حاسوب محمول للأعمال',
      supplier: 'شركة النور للإلكترونيات',
      price: 3500,
      originalPrice: null,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'جديد', color: 'bg-emerald-500' }
    },
    {
      id: 2,
      name: 'أثاث مكتبي فاخر',
      supplier: 'مصنع الأخشاب الذهبية',
      price: 1200,
      originalPrice: null,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'الأكثر مبيعاً', color: 'bg-blue-500' }
    },
    {
      id: 3,
      name: 'كاميرات مراقبة HD',
      supplier: 'شركة التقنية الآمنة',
      price: 450,
      originalPrice: null,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'مخزون محدود', color: 'bg-amber-500' }
    },
    {
      id: 4,
      name: 'طابعة ليزر متعددة الوظائف',
      supplier: 'شركة الطباعة الحديثة',
      price: 850,
      originalPrice: 1200,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      badge: { text: 'عرض خاص', color: 'bg-rose-500' }
    }
  ];

  // عرض رسائل التحميل أو الخطأ
  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md border border-red-200">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">خطأ في تحميل البيانات</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {loginTestResult && (
        <div className="mb-4 p-3 rounded-lg text-sm">
          {loginTestResult.error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded">فشل اختبار الدخول: {String(loginTestResult.error)}</div>
          ) : (
            <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded">
              اختبار الدخول: الحالة {loginTestResult.status} — مُنجز بنجاح
            </div>
          )}
        </div>
      )}
      {/* Hero Section */}
  <Motion.div 
        className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-10 text-white shadow-2xl mb-8"
        {...fadeInUp}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="mb-8 lg:mb-0">
            <h2 className="text-4xl font-bold mb-3">مرحباً بك في منصة أعمالي!</h2>
            <p className="text-emerald-100 text-lg max-w-2xl">
              هنا يمكنك إدارة جميع عملياتك التجارية بسلاسة، من الموردين إلى العملاء، كل ذلك في مكان واحد.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="bg-white text-emerald-600 px-6 py-2 rounded-full font-bold hover:bg-emerald-50 transition-colors">
                ابدأ الآن
              </button>
              <button className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full font-bold hover:bg-white/10 transition-colors">
                عرض الدليل
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="text-center">
              <p className="text-4xl font-bold">120</p>
              <p className="text-emerald-200">مورد نشط</p>
            </div>
            <div className="w-px h-12 bg-emerald-400 hidden sm:block"></div>
            <div className="text-center">
              <p className="text-4xl font-bold">350</p>
              <p className="text-emerald-200">تاجر معتمد</p>
            </div>
            <div className="w-px h-12 bg-emerald-400 hidden sm:block"></div>
            <div className="text-center">
              <p className="text-4xl font-bold">1,240</p>
              <p className="text-emerald-200">منتج متاح</p>
            </div>
          </div>
        </div>
  </Motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <Motion.div
            key={stat.title}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {/* Background gradient effect */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-full -translate-y-4 translate-x-4" 
                 style={{ background: `linear-gradient(135deg, ${stat.color.split(' ')[1]}, ${stat.color.split(' ')[3]})` }}></div>
            
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center transition-transform duration-300 hover:rotate-12 hover:scale-110`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
              <span className="text-gray-500 text-sm mr-2">{stat.unit}</span>
            </div>
          </Motion.div>
        ))}
      </div>

      {/* Recent Activity & Featured Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activity */}
  <Motion.div 
          className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6">آخر النشاطات</h3>
          <div className="space-y-4">
            {displayRecentActivities.map((activity, index) => (
              <Motion.div 
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
              </Motion.div>
            ))}
          </div>
          <button className="w-full mt-6 text-center text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
            عرض كل النشاطات
          </button>
  </Motion.div>

        {/* Featured Products */}
  <Motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">أحدث المنتجات المضافة</h3>
            <button className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center transition-colors">
              <span>عرض الكل</span>
              <ChevronDown className="w-4 h-4 mr-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProducts.map((product, index) => (
              <Motion.div 
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
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      <span className="text-sm text-gray-600 mr-1">{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 mb-4 text-sm">{product.supplier}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xl text-emerald-600">
                        {product.price.toLocaleString()} <span className="text-sm">ر.س</span>
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through mr-2">
                          {product.originalPrice.toLocaleString()} ر.س
                        </span>
                      )}
                    </div>
                    <button className="bg-emerald-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-emerald-600 transition-colors text-sm">
                      تفاصيل
                    </button>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
  </Motion.div>
      </div>

      {/* Performance Chart Section */}
  <Motion.div 
        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">أداء المبيعات</h3>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSelectedPeriod('daily')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPeriod === 'daily' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              يومي
            </button>
            <button 
              onClick={() => setSelectedPeriod('weekly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPeriod === 'weekly' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              أسبوعي
            </button>
            <button 
              onClick={() => setSelectedPeriod('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedPeriod === 'monthly' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              شهري
            </button>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">سيتم عرض الرسم البياني هنا</p>
            <p className="text-sm text-gray-400">البيانات للفترة: {selectedPeriod === 'daily' ? 'يومي' : selectedPeriod === 'weekly' ? 'أسبوعي' : 'شهري'}</p>
          </div>
        </div>
  </Motion.div>

      {/* Quick Actions */}
  <Motion.div 
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6">إجراءات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">إضافة طلب</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">إدارة الموردين</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">تتبع الشحنات</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors group">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">عرض التقارير</span>
          </button>
        </div>
  </Motion.div>
    </div>
  );
};

export default MerchantDashboard;

