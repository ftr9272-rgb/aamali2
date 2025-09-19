import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Components
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import SmartMarketplace from './components/SmartMarketplace';

// Merchant Components
import MerchantLayout from './components/merchant/MerchantLayout';
import MerchantDashboard from './components/merchant/MerchantDashboard';
import MerchantSuppliers from './components/merchant/MerchantSuppliers';
import MerchantSupplierProducts from './components/merchant/MerchantSupplierProducts';
import MerchantFavorites from './components/merchant/MerchantFavorites';
import MerchantQuotationRequests from './components/merchant/MerchantQuotationRequests';
import MerchantReceivedQuotations from './components/merchant/MerchantReceivedQuotations';
import MerchantPurchaseOrders from './components/merchant/MerchantPurchaseOrders';
import MerchantPurchaseOrderDetails from './components/merchant/MerchantPurchaseOrderDetails';
import MerchantPayments from './components/merchant/MerchantPayments';
import MerchantShippingCompanies from './components/merchant/MerchantShippingCompanies';
import MerchantShippingQuotes from './components/merchant/MerchantShippingQuotes';
import MerchantReports from './components/merchant/MerchantReports';
import MerchantProfile from './components/merchant/MerchantProfile';
import MerchantSettings from './components/merchant/MerchantSettings';

// Supplier Components
import SupplierLayout from './components/supplier/SupplierLayout_new';
import SupplierDashboard from './components/supplier/SupplierDashboard_new';
import SupplierProducts from './components/supplier/SupplierProducts_new';
import SupplierOrders from './components/supplier/SupplierOrders_new';
import SupplierQuotations from './components/supplier/SupplierQuotations_new';
import SupplierMerchants from './components/supplier/SupplierMerchants';
import SupplierReports from './components/supplier/SupplierReports';
import SupplierProfile from './components/supplier/SupplierProfile';
import SupplierSettings from './components/supplier/SupplierSettings';

// Shipping Components
import ShippingLayout from './components/shipping/ShippingLayout';
import ShippingDashboard from './components/shipping/ShippingDashboard';
import ShippingShipments from './components/shipping/ShippingShipments';
import ShippingDrivers from './components/shipping/ShippingDrivers';
import ShippingQuotes from './components/shipping/ShippingQuotes';
import ShippingTracking from './components/shipping/ShippingTracking';
import ShippingReports from './components/shipping/ShippingReports';
import ShippingProfile from './components/shipping/ShippingProfile';
import ShippingSettings from './components/shipping/ShippingSettings';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // landing, auth, dashboard, marketplace
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('merchant'); // merchant, supplier, shipping
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleGetStarted = () => {
    setCurrentView('auth');
  };

  const handleLogin = (type, userData) => {
    setUserType(type);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    setActiveTab('dashboard');
    // تخزين بيانات المستخدم
    if (userData) {
      localStorage.setItem('userType', type);
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('landing');
    setActiveTab('dashboard');
  };

  const handleGoToMarketplace = () => {
    setCurrentView('marketplace');
  };

  const handleBackFromMarketplace = () => {
    setCurrentView('dashboard');
  };

  const renderMerchantContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MerchantDashboard />;
      case 'suppliers':
        return <MerchantSuppliers />;
      case 'supplier-products':
        return <MerchantSupplierProducts />;
      case 'favorites':
        return <MerchantFavorites />;
      case 'quotation-requests':
        return <MerchantQuotationRequests />;
      case 'received-quotations':
        return <MerchantReceivedQuotations />;
      case 'purchase-orders':
        return <MerchantPurchaseOrders />;
      case 'purchase-order-details':
        return <MerchantPurchaseOrderDetails />;
      case 'payments':
        return <MerchantPayments />;
      case 'shipping-companies':
        return <MerchantShippingCompanies />;
      case 'shipping-quotes':
        return <MerchantShippingQuotes />;
      case 'reports':
        return <MerchantReports />;
      case 'profile':
        return <MerchantProfile />;
      case 'settings':
        return <MerchantSettings />;
      default:
        return <MerchantDashboard />;
    }
  };

  const renderSupplierContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SupplierDashboard />;
      case 'products':
        return <SupplierProducts />;
      case 'orders':
        return <SupplierOrders />;
      case 'quotations':
        return <SupplierQuotations />;
      case 'merchants':
        return <SupplierMerchants />;
      case 'reports':
        return <SupplierReports />;
      case 'profile':
        return <SupplierProfile />;
      case 'settings':
        return <SupplierSettings />;
      default:
        return <SupplierDashboard />;
    }
  };

  const renderShippingContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ShippingDashboard />;
      case 'shipments':
        return <ShippingShipments />;
      case 'drivers':
        return <ShippingDrivers />;
      case 'quotes':
        return <ShippingQuotes />;
      case 'tracking':
        return <ShippingTracking />;
      case 'routes':
        return <ShippingTracking />; // يمكن إنشاء مكون منفصل للطرق
      case 'reports':
        return <ShippingReports />;
      case 'profile':
        return <ShippingProfile />;
      case 'settings':
        return <ShippingSettings />;
      default:
        return <ShippingDashboard />;
    }
  };

  const renderDashboardContent = () => {
    switch (userType) {
      case 'merchant':
        return (
          <MerchantLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            onGoToMarketplace={handleGoToMarketplace}
          >
            {renderMerchantContent()}
          </MerchantLayout>
        );
      case 'supplier':
        return (
          <SupplierLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            onGoToMarketplace={handleGoToMarketplace}
          >
            {renderSupplierContent()}
          </SupplierLayout>
        );
      case 'shipping':
        return (
          <ShippingLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            onGoToMarketplace={handleGoToMarketplace}
          >
            {renderShippingContent()}
          </ShippingLayout>
        );
      default:
        return (
          <MerchantLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
            onGoToMarketplace={handleGoToMarketplace}
          >
            {renderMerchantContent()}
          </MerchantLayout>
        );
    }
  };

  return (
    <div className="App min-h-screen">
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onGetStarted={handleGetStarted} />
          </motion.div>
        )}

        {currentView === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <Auth onLogin={handleLogin} />
          </motion.div>
        )}

        {currentView === 'dashboard' && isAuthenticated && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            {renderDashboardContent()}
          </motion.div>
        )}

        {currentView === 'marketplace' && isAuthenticated && (
          <motion.div
            key="marketplace"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <SmartMarketplace
              userType={userType}
              onBack={handleBackFromMarketplace}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
