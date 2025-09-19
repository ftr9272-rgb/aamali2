import React from 'react';
// motion is used via JSX tags (e.g. <motion.div />); ESLint's no-unused-vars may false-positive here
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Store, ArrowLeft, Star, Search, Filter, ShoppingBag, Truck, Package, Award, Users } from 'lucide-react';

const SmartMarketplace = ({ userType, onBack }) => {
  const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  // For shipping companies, show their specific interface
  if (userType === 'shipping') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100">
        {/* Shipping Company Header */}
        <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/10 to-transparent"></div>
          
          <div className="container mx-auto px-6 py-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.button 
                  onClick={onBack} 
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
                </motion.button>
                
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Truck className="w-6 h-6 text-white" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h1 className="text-xl font-bold">السوق الذكي</h1>
                  <p className="text-white/90 text-sm flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    اكتشف فرص الشحن المتاحة
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        {/* Shipping Company Main Content */}
        <main className="container mx-auto px-6 py-8">
          <motion.div {...fadeIn}>
            {/* Welcome Section */}
            <motion.div className="mb-8 text-center">
              <motion.h2 
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                فرص الشحن المتاحة
              </motion.h2>
              <motion.p 
                className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                تصفح واعثر على طلبات الشحن في السوق
              </motion.p>
            </motion.div>

            {/* Available Shipping Orders - Browse Only */}
              <motion.div 
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    طلبات شحن جديدة
                  </h3>
                  <motion.button 
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    عرض الكل
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((item) => (
                    <motion.div 
                      key={item} 
                      className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + item * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-800">طلب #{1000 + item}</h4>
                        <span className="text-green-600 text-sm font-medium px-3 py-1 bg-green-100 rounded-full">
                          جديد
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">التاجر:</span>
                          <span className="text-sm font-medium">متجر الأسواق الحديثة</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">الوجهة:</span>
                          <span className="text-sm font-medium">الرياض - حي العليا</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">القيمة:</span>
                          <span className="font-bold text-orange-600">{150 + item * 50} ريال</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium">
                          تقديم عرض
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm">
                          تفاصيل
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  // For merchants and suppliers, show the integrated marketplace

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Beautiful Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/10 to-transparent"></div>
        
        <div className="container mx-auto px-6 py-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.button 
                onClick={onBack} 
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
              </motion.button>
              
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Store className="w-6 h-6 text-white" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h1 className="text-xl font-bold">السوق الذكي</h1>
                <p className="text-white/90 text-sm flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  اكتشف الفرص التجارية المناسبة لك
                </p>
              </motion.div>
            </div>
            
            {/* User Type Switcher - REMOVED */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div {...fadeIn}>
          {/* Welcome Section */}
          <motion.div className="mb-12 text-center">
            <motion.h2 
              className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              مرحباً بك في السوق الذكي
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              اكتشف السوق التجاري المتكامل للموردين والتجار وشركات الشحن
            </motion.p>
            
            {/* Search Bar for all users */}
            <motion.div 
              className="mt-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="ابحث عن المنتجات، الموردين، أو خدمات الشحن..."
                  className="w-full pl-12 pr-6 py-4 bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300 text-gray-700 placeholder-gray-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Integrated Marketplace for All Three Parties */}
          <div className="space-y-12">
            {/* Quick Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {[
                { label: 'موردين نشطين', value: '500+', icon: <Users className="w-6 h-6" />, color: 'from-green-500 to-emerald-600' },
                { label: 'منتجات متاحة', value: '2.5K+', icon: <Package className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600' },
                { label: 'شركات شحن', value: '50+', icon: <Truck className="w-6 h-6" />, color: 'from-purple-500 to-pink-600' },
                { label: 'تقييم متوسط', value: '4.8⭐', icon: <Award className="w-6 h-6" />, color: 'from-yellow-500 to-orange-600' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
                  whileHover={{ y: -5, scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white mb-4 mx-auto`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 text-center">{stat.value}</h3>
                  <p className="text-gray-600 text-sm text-center mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Suppliers Section */}
            <motion.div 
              className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  الموردين المعتمدين
                </h3>
                <motion.button 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  عرض الكل
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => (
                  <motion.div 
                    key={item} 
                    className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + item * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      مميز
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Store className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">شركة المورد الذهبي {item}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < 4 + item ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 font-medium">4.{item + 5}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed">مورد موثوق متخصص في توفير منتجات عالية الجودة بأسعار تنافسية</p>
                      
                      <div className="flex gap-3">
                        <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium">
                          عرض المنتجات
                        </button>
                        <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300">
                          ⭐
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Products Section */}
            <motion.div 
              className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                  المنتجات والعروض المميزة
                </h3>
                <motion.button 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  عرض المزيد
                </motion.button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <motion.div 
                    key={item} 
                    className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 + item * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="relative">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl h-32 mb-4 flex items-center justify-center relative overflow-hidden">
                        <span className="text-blue-600 font-bold text-lg">منتج {item}</span>
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          خصم 20%
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">منتج عالي الجودة {item}</h4>
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">وصف مفصل للمنتج وميزاته الفريدة</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-lg font-bold text-blue-600">{50 + item * 10} ريال</span>
                          <span className="text-sm text-gray-500 line-through ml-2">{70 + item * 10} ريال</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">4.{item + 6}</span>
                        </div>
                      </div>
                      
                      <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-medium">
                        طلب المنتج
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Shipping Services Section */}
            <motion.div 
              className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  خدمات الشحن والتوصيل
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'شركة السرعة للنقل', description: 'توصيل سريع داخل المدينة خلال نفس اليوم', price: '15-30', time: '24 ساعة', status: 'متاح الآن', statusColor: 'green', rating: '4.9' },
                  { name: 'مؤسسة الأمان للشحن', description: 'شحن آمن ومضمون للبضائع الثقيلة والقيمة', price: '25-60', time: '48 ساعة', status: 'مشغول', statusColor: 'orange', rating: '4.7' },
                  { name: 'شركة الوفاء اللوجستية', description: 'شحن اقتصادي للكميات الكبيرة بأسعار منافسة', price: '12-25', time: '3-5 أيام', status: 'متاح الآن', statusColor: 'green', rating: '4.8' }
                ].map((company, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-800">{company.name}</h4>
                      <span className={`text-${company.statusColor}-600 text-sm font-medium px-3 py-1 bg-${company.statusColor}-100 rounded-full`}>
                        {company.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{company.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">السعر:</span>
                        <span className="font-bold text-purple-600">{company.price} ريال</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">مدة التوصيل:</span>
                        <span className="text-sm font-medium">{company.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">التقييم:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{company.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium">
                      طلب خدمة الشحن
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SmartMarketplace;