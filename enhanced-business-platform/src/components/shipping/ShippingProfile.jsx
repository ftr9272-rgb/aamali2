import React, { useState } from 'react';
// framer-motion removed (unused) to satisfy linter
import { User, Building, Phone, Mail, MapPin, Save, Edit, Star, Truck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ShippingProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    companyName: 'شركة التوصيل السريع',
    licenseNumber: 'SH-2024-001',
    contactPerson: 'أحمد محمد الغامدي',
    email: 'info@fastdelivery.com',
    phone: '+966551234567',
    address: 'الرياض، حي النخيل، شارع الملك فهد، مبنى 123',
    serviceAreas: ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة'],
    vehicleTypes: ['شاحنة صغيرة', 'فان', 'دراجة نارية'],
    pricingModel: 'per_km',
    baseRate: 5.0,
    minCharge: 25.0,
    maxWeight: 500.0,
    maxDistance: 1000.0,
    rating: 4.7,
    totalDeliveries: 156,
    isVerified: true
  });

  const handleSave = () => {
    setIsEditing(false);
    // حفظ البيانات
    console.log('حفظ الملف الشخصي:', profile);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
            <p className="text-gray-600">إدارة معلومات الشركة والخدمات</p>
          </div>
          <Button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
          >
            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? 'حفظ التغييرات' : 'تعديل الملف'}
          </Button>
        </div>

        {/* معلومات الشركة الأساسية */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              معلومات الشركة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم الشركة</label>
                <Input
                  value={profile.companyName}
                  onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الترخيص</label>
                <Input
                  value={profile.licenseNumber}
                  onChange={(e) => setProfile({...profile, licenseNumber: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الشخص المسؤول</label>
                <Input
                  value={profile.contactPerson}
                  onChange={(e) => setProfile({...profile, contactPerson: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                <Input
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* إحصائيات الأداء */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              إحصائيات الأداء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">{profile.rating}</p>
                <p className="text-sm text-yellow-700">التقييم العام</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Truck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{profile.totalDeliveries}</p>
                <p className="text-sm text-green-700">إجمالي التوصيلات</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{profile.serviceAreas.length}</p>
                <p className="text-sm text-blue-700">مناطق الخدمة</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{profile.isVerified ? 'معتمدة' : 'غير معتمدة'}</p>
                <p className="text-sm text-purple-700">حالة الاعتماد</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* إعدادات الخدمة */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الخدمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نموذج التسعير</label>
                <select
                  value={profile.pricingModel}
                  onChange={(e) => setProfile({...profile, pricingModel: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="per_km">حسب المسافة</option>
                  <option value="per_weight">حسب الوزن</option>
                  <option value="fixed">سعر ثابت</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">السعر الأساسي (ريال)</label>
                <Input
                  type="number"
                  value={profile.baseRate}
                  onChange={(e) => setProfile({...profile, baseRate: parseFloat(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى للرسوم (ريال)</label>
                <Input
                  type="number"
                  value={profile.minCharge}
                  onChange={(e) => setProfile({...profile, minCharge: parseFloat(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى للوزن (كجم)</label>
                <Input
                  type="number"
                  value={profile.maxWeight}
                  onChange={(e) => setProfile({...profile, maxWeight: parseFloat(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* مناطق الخدمة وأنواع المركبات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>مناطق الخدمة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.serviceAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{area}</span>
                    {isEditing && (
                      <Button size="sm" variant="outline">حذف</Button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <Button size="sm" className="w-full">إضافة منطقة جديدة</Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>أنواع المركبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.vehicleTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{type}</span>
                    {isEditing && (
                      <Button size="sm" variant="outline">حذف</Button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <Button size="sm" className="w-full">إضافة نوع مركبة</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
    </div>
  );
};

export default ShippingProfile;

