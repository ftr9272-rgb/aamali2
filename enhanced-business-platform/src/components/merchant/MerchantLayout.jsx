import React from 'react';
// keep motion import for animated buttons in layout
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Users, 
  Star, 
  DollarSign, 
  Truck, 
  FileText, 
  Settings, 
  User, 
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const MerchantLayout = ({ children, activeTab, setActiveTab, onLogout, onGoToMarketplace }) => {
  // Sidebar always visible

  const navItems = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: Home },
    { id: 'suppliers', name: 'تصفح الموردين', icon: Users },
    { id: 'favorites', name: 'الموردين المفضلين', icon: Star },
    { id: 'quotation-requests', name: 'طلبات عروض الأسعار', icon: FileText },
    { id: 'received-quotations', name: 'عروض الأسعار المستلمة', icon: DollarSign },
    { id: 'purchase-orders', name: 'طلبات الشراء', icon: ShoppingCart },
    { id: 'payments', name: 'المدفوعات', icon: DollarSign },
    { id: 'shipping-companies', name: 'شركات الشحن', icon: Truck },
    { id: 'shipping-quotes', name: 'عروض الشحن', icon: Package },
    { id: 'reports', name: 'التقارير', icon: FileText },
    { id: 'profile', name: 'الملف الشخصي', icon: User },
    { id: 'settings', name: 'الإعدادات', icon: Settings },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
  {/* Sidebar (always visible) */}
  <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-xl lg:shadow-lg`}>
  <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">لوحة التاجر</h2>
                <p className="text-sm text-gray-500">مرحباً بك</p>
              </div>
            </div>
            {/* permanent sidebar - no mobile close button */}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </motion.button>
              );
            })}
          </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 mt-auto">
            <motion.button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">تسجيل الخروج</span>
            </motion.button>
          </div>
        </div>
    </aside>

  {/* Main Content */}
  <div className="flex-1 flex flex-col mr-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* mobile toggle removed - sidebar always visible */}
              <h1 className="text-2xl font-bold text-gray-900">
                {navItems.find(item => item.id === activeTab)?.name || 'لوحة التحكم'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onGoToMarketplace}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Package className="h-5 w-5" />
                <span className="font-medium">السوق الذكي</span>
              </motion.button>
              
              <motion.button
                className="relative p-2 rounded-lg hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
              
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </header>

  {/* Page Content */}
  <main className="flex-1 p-4 bg-gray-50 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MerchantLayout;

