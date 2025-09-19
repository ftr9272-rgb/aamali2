import React, { useState, useEffect } from 'react';
// motion is used via JSX tags (e.g. <motion.div />); ESLint may false-positive that it's unused
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye,
  Edit,
  MapPin,
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Plus,
  Calendar,
  Phone,
  User
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ShippingShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [_selectedShipment, _setSelectedShipment] = useState(null);
  const [_showShipmentDetails, _setShowShipmentDetails] = useState(false);

  useEffect(() => {
    const fetchShipments = async () => {
    try {
      // محاكاة البيانات - في التطبيق الحقيقي ستأتي من API
      const mockShipments = [
        {
          id: 1,
          trackingNumber: 'SH20250906001',
          merchant: {
            name: 'متجر الأسواق الحديثة',
            phone: '+966501234567',
            email: 'modern@markets.com'
          },
          pickup: {
            address: 'الرياض، حي النخيل، شارع الملك فهد، مبنى 123',
            contactName: 'أحمد محمد',
            contactPhone: '+966501234567',
            date: '2025-09-07',
            timeSlot: '09:00-12:00'
          },
          delivery: {
            address: 'جدة، حي الصفا، شارع التحلية، مبنى 456',
            contactName: 'فاطمة علي',
            contactPhone: '+966502345678',
            date: '2025-09-08',
            timeSlot: '14:00-17:00'
          },
          package: {
            description: 'أجهزة إلكترونية',
            weight: 15.5,
            dimensions: '50x40x30',
            value: 5000
          },
          pricing: {
            quoted: 150,
            actual: 150,
            currency: 'SAR'
          },
          status: 'in_transit',
          driver: 'محمد أحمد الغامدي',
          vehicle: 'شاحنة صغيرة - أ ب ج 1234',
          notes: 'يرجى التعامل بحذر - أجهزة حساسة',
          specialInstructions: 'التسليم للمستلم شخصياً فقط',
          createdAt: '2025-09-06',
          estimatedDelivery: '2025-09-08'
        },
        {
          id: 2,
          trackingNumber: 'SH20250906002',
          merchant: {
            name: 'سوق المدينة',
            phone: '+966502345678',
            email: 'city@market.com'
          },
          pickup: {
            address: 'الدمام، حي الفيصلية، شارع الأمير محمد، مبنى 789',
            contactName: 'سعد أحمد',
            contactPhone: '+966503456789',
            date: '2025-09-04',
            timeSlot: '10:00-13:00'
          },
          delivery: {
            address: 'الرياض، حي العليا، شارع التخصصي، مبنى 321',
            contactName: 'نورا سعد',
            contactPhone: '+966504567890',
            date: '2025-09-05',
            timeSlot: '15:00-18:00'
          },
          package: {
            description: 'أثاث مكتبي',
            weight: 45.0,
            dimensions: '120x80x75',
            value: 3000
          },
          pricing: {
            quoted: 200,
            actual: 200,
            currency: 'SAR'
          },
          status: 'delivered',
          driver: 'عبدالله سعد المطيري',
          vehicle: 'فان - د هـ و 5678',
          notes: 'تم التسليم بنجاح',
          deliveredAt: '2025-09-05',
          createdAt: '2025-09-04'
        },
        {
          id: 3,
          trackingNumber: 'SH20250906003',
          merchant: {
            name: 'متجر الجودة',
            phone: '+966503456789',
            email: 'quality@store.com'
          },
          pickup: {
            address: 'جدة، حي الروضة، شارع الأمير سلطان، مبنى 555',
            contactName: 'خالد محمد',
            contactPhone: '+966505678901',
            date: '2025-09-07',
            timeSlot: '08:00-11:00'
          },
          delivery: {
            address: 'مكة المكرمة، حي العزيزية، شارع الحرم، مبنى 777',
            contactName: 'أمل أحمد',
            contactPhone: '+966506789012',
            date: '2025-09-08',
            timeSlot: '16:00-19:00'
          },
          package: {
            description: 'مستلزمات طبية',
            weight: 8.2,
            dimensions: '30x25x20',
            value: 2500
          },
          pricing: {
            quoted: 120,
            actual: null,
            currency: 'SAR'
          },
          status: 'pending',
          driver: null,
          vehicle: null,
          notes: 'شحنة عاجلة - مستلزمات طبية',
          specialInstructions: 'يجب الحفاظ على درجة حرارة مناسبة',
          createdAt: '2025-09-06',
          estimatedDelivery: '2025-09-08'
        }
      ];
      setShipments(mockShipments);
    } catch (error) {
      console.error('خطأ في جلب الشحنات:', error);
    }
    };
    fetchShipments();
  }, []);

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.merchant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-purple-100 text-purple-800';
      case 'in_transit':
        return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'confirmed':
        return 'مؤكدة';
      case 'picked_up':
        return 'تم الاستلام';
      case 'in_transit':
        return 'في الطريق';
      case 'out_for_delivery':
        return 'خرج للتوصيل';
      case 'delivered':
        return 'تم التسليم';
      case 'cancelled':
        return 'ملغية';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'picked_up':
        return <Package className="h-4 w-4" />;
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'out_for_delivery':
        return <MapPin className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (shipmentId, newStatus) => {
    setShipments(shipments.map(shipment => 
      shipment.id === shipmentId ? { ...shipment, status: newStatus } : shipment
    ));
  };

  const shipmentStatuses = ['all', 'pending', 'confirmed', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'];

  return (
    <div className="p-6 space-y-6">
      {/* العنوان والإحصائيات */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الشحنات</h1>
            <p className="text-gray-600">متابعة وإدارة جميع الشحنات والطلبات</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            إضافة شحنة جديدة
          </Button>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي الشحنات</p>
                  <p className="text-2xl font-bold">{shipments.length}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">في الانتظار</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {shipments.filter(s => s.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">في الطريق</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {shipments.filter(s => s.status === 'in_transit').length}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">تم التسليم</p>
                  <p className="text-2xl font-bold text-green-600">
                    {shipments.filter(s => s.status === 'delivered').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* أدوات البحث والتصفية */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="البحث في الشحنات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {shipmentStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'جميع الحالات' : getStatusText(status)}
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
      </motion.div>

      {/* قائمة الشحنات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>قائمة الشحنات</CardTitle>
            <CardDescription>
              عرض {filteredShipments.length} من أصل {shipments.length} شحنة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredShipments.map((shipment) => (
                <motion.div
                  key={shipment.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">{shipment.trackingNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(shipment.status)}`}>
                          {getStatusIcon(shipment.status)}
                          {getStatusText(shipment.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">التاجر: {shipment.merchant.name}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{shipment.pickup.address.split('،')[0]} → {shipment.delivery.address.split('،')[0]}</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-gray-900">{shipment.pricing.quoted} {shipment.pricing.currency}</p>
                      <p className="text-sm text-gray-600">{shipment.package.weight} كجم</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">معلومات الاستلام</p>
                      <p className="text-sm font-medium">{shipment.pickup.contactName}</p>
                      <p className="text-sm text-gray-500">{shipment.pickup.date} - {shipment.pickup.timeSlot}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">معلومات التسليم</p>
                      <p className="text-sm font-medium">{shipment.delivery.contactName}</p>
                      <p className="text-sm text-gray-500">{shipment.delivery.date} - {shipment.delivery.timeSlot}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">السائق المكلف</p>
                      <p className="text-sm font-medium">{shipment.driver || 'لم يتم التعيين'}</p>
                      {shipment.vehicle && (
                        <p className="text-sm text-gray-500">{shipment.vehicle}</p>
                      )}
                    </div>
                  </div>

                  {shipment.package.description && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm"><strong>وصف الشحنة:</strong> {shipment.package.description}</p>
                      <p className="text-sm"><strong>الأبعاد:</strong> {shipment.package.dimensions} سم</p>
                      <p className="text-sm"><strong>القيمة:</strong> {shipment.package.value} {shipment.pricing.currency}</p>
                    </div>
                  )}

                  {shipment.notes && (
                    <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{shipment.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        _setSelectedShipment(shipment);
                        _setShowShipmentDetails(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      عرض التفاصيل
                    </Button>
                    
                    {shipment.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleStatusUpdate(shipment.id, 'confirmed')}
                      >
                        تأكيد الشحنة
                      </Button>
                    )}
                    
                    {shipment.status === 'confirmed' && (
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleStatusUpdate(shipment.id, 'picked_up')}
                      >
                        تأكيد الاستلام
                      </Button>
                    )}
                    
                    {shipment.status === 'picked_up' && (
                      <Button 
                        size="sm" 
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => handleStatusUpdate(shipment.id, 'in_transit')}
                      >
                        بدء الرحلة
                      </Button>
                    )}
                    
                    {shipment.status === 'in_transit' && (
                      <Button 
                        size="sm" 
                        className="bg-indigo-600 hover:bg-indigo-700"
                        onClick={() => handleStatusUpdate(shipment.id, 'out_for_delivery')}
                      >
                        خرج للتوصيل
                      </Button>
                    )}
                    
                    {shipment.status === 'out_for_delivery' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusUpdate(shipment.id, 'delivered')}
                      >
                        تأكيد التسليم
                      </Button>
                    )}

                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredShipments.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا توجد شحنات تطابق البحث</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ShippingShipments;

