import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MapPin, 
  Phone, 
  Star,
  Truck,
  CheckCircle,
  XCircle,
  Navigation
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ShippingDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [_showAddDriver, _setShowAddDriver] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const mockDrivers = [
          {
            id: 1,
            name: 'محمد أحمد الغامدي',
            phone: '+966551234567',
            license: 'DL-001-2024',
            vehicleType: 'شاحنة صغيرة',
            vehiclePlate: 'أ ب ج 1234',
            vehicleCapacity: 1000,
            currentLocation: 'الطريق السريع الرياض-جدة',
            status: 'في الطريق',
            rating: 4.8,
            totalDeliveries: 89,
            isActive: true,
            currentShipment: 'SH20250906001'
          },
          {
            id: 2,
            name: 'عبدالله سعد المطيري',
            phone: '+966552345678',
            license: 'DL-002-2024',
            vehicleType: 'فان',
            vehiclePlate: 'د هـ و 5678',
            vehicleCapacity: 500,
            currentLocation: 'مركز التوزيع - الرياض',
            status: 'متاح',
            rating: 4.6,
            totalDeliveries: 67,
            isActive: true,
            currentShipment: null
          },
          {
            id: 3,
            name: 'خالد محمد العتيبي',
            phone: '+966553456789',
            license: 'DL-003-2024',
            vehicleType: 'دراجة نارية',
            vehiclePlate: 'ز ح ط 9012',
            vehicleCapacity: 50,
            currentLocation: 'جدة - حي الصفا',
            status: 'في استراحة',
            rating: 4.9,
            totalDeliveries: 156,
            isActive: true,
            currentShipment: null
          }
        ];
        setDrivers(mockDrivers);
      } catch (error) {
        console.error('خطأ في جلب السائقين:', error);
      }
    };
    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'متاح':
        return 'bg-green-100 text-green-800';
      case 'في الطريق':
        return 'bg-blue-100 text-blue-800';
      case 'في استراحة':
        return 'bg-yellow-100 text-yellow-800';
      case 'غير متاح':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'متاح':
        return <CheckCircle className="h-4 w-4" />;
      case 'في الطريق':
        return <Truck className="h-4 w-4" />;
      case 'في استراحة':
        return <Navigation className="h-4 w-4" />;
      case 'غير متاح':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* العنوان والإحصائيات */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة السائقين</h1>
            <p className="text-gray-600">متابعة وإدارة فريق السائقين والمركبات</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => _setShowAddDriver(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            إضافة سائق جديد
          </Button>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي السائقين</p>
                  <p className="text-2xl font-bold">{drivers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">السائقون المتاحون</p>
                  <p className="text-2xl font-bold text-green-600">
                    {drivers.filter(d => d.status === 'متاح').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">في الطريق</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {drivers.filter(d => d.status === 'في الطريق').length}
                  </p>
                </div>
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">متوسط التقييم</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {(drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>
  </div>

      {/* أدوات البحث */}
      <div>
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="البحث في السائقين..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
  </div>

      {/* قائمة السائقين */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>قائمة السائقين</CardTitle>
            <CardDescription>
              عرض {filteredDrivers.length} من أصل {drivers.length} سائق
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrivers.map((driver) => (
                <div
                    key={driver.id}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{driver.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">{driver.rating}</span>
                          <span className="text-sm text-gray-500">({driver.totalDeliveries} توصيلة)</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(driver.status)}`}>
                      {getStatusIcon(driver.status)}
                      {driver.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="h-4 w-4" />
                      <span>{driver.vehicleType} - {driver.vehiclePlate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{driver.currentLocation}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-600">رخصة القيادة</p>
                      <p className="font-medium">{driver.license}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-gray-600">سعة المركبة</p>
                      <p className="font-medium">{driver.vehicleCapacity} كجم</p>
                    </div>
                  </div>

                  {driver.currentShipment && (
                    <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>الشحنة الحالية:</strong> {driver.currentShipment}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      تعديل
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      تتبع
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredDrivers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">لا يوجد سائقون يطابقون البحث</p>
              </div>
            )}
          </CardContent>
        </Card>
  </div>
    </div>
  );
};

export default ShippingDrivers;

