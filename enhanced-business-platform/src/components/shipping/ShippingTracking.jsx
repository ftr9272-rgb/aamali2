import React, { useState } from 'react';
// motion is used via JSX tags (e.g. <motion.div />); ESLint may false-positive that it's unused
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Package, Truck, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const ShippingTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrack = () => {
    // محاكاة نتيجة التتبع
    const mockResult = {
      trackingNumber: trackingNumber || 'SH20250906001',
      status: 'in_transit',
      estimatedDelivery: '2025-09-08',
      currentLocation: 'الطريق السريع الرياض-جدة',
      history: [
        {
          status: 'pending',
          location: 'الرياض',
          description: 'تم إنشاء الشحنة',
          timestamp: '2025-09-06 08:00',
          icon: Package
        },
        {
          status: 'confirmed',
          location: 'الرياض',
          description: 'تم تأكيد الشحنة',
          timestamp: '2025-09-06 09:00',
          icon: CheckCircle
        },
        {
          status: 'picked_up',
          location: 'الرياض - حي النخيل',
          description: 'تم استلام الشحنة من المرسل',
          timestamp: '2025-09-06 10:30',
          icon: Package
        },
        {
          status: 'in_transit',
          location: 'الطريق السريع الرياض-جدة',
          description: 'الشحنة في الطريق إلى جدة',
          timestamp: '2025-09-06 14:00',
          icon: Truck
        }
      ]
    };
    setTrackingResult(mockResult);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'confirmed':
        return 'text-blue-600';
      case 'picked_up':
        return 'text-purple-600';
      case 'in_transit':
        return 'text-orange-600';
      case 'delivered':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">تتبع الشحنات</h1>
        <p className="text-gray-600">تتبع حالة الشحنات ومواقعها الحالية</p>
      </motion.div>

      {/* شريط البحث */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="أدخل رقم التتبع..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <Button onClick={handleTrack} className="bg-green-600 hover:bg-green-700">
              <Search className="h-4 w-4 mr-2" />
              تتبع
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* نتائج التتبع */}
      {trackingResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>نتائج التتبع - {trackingResult.trackingNumber}</CardTitle>
              <CardDescription>آخر تحديث: {trackingResult.history[trackingResult.history.length - 1].timestamp}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* الحالة الحالية */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Truck className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">الحالة الحالية</h3>
                  </div>
                  <p className="text-blue-800 mb-1">في الطريق إلى الوجهة</p>
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <MapPin className="h-4 w-4" />
                    <span>{trackingResult.currentLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-700 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>التسليم المتوقع: {trackingResult.estimatedDelivery}</span>
                  </div>
                </div>

                {/* تاريخ التتبع */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">تاريخ الشحنة</h3>
                  <div className="space-y-4">
                    {trackingResult.history.map((event, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${getStatusColor(event.status)} bg-gray-100`}>
                          <event.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{event.description}</h4>
                            <span className="text-sm text-gray-500">{event.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600">{event.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ShippingTracking;

