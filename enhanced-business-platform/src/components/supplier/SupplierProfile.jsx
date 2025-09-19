import React, { useState, useEffect } from 'react';
// motion is used via JSX tags (e.g. <motion.div />); ESLint may false-positive that it's unused
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Edit,
  Save,
  Camera,
  Globe,
  Calendar,
  Award,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const SupplierProfile = () => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // محاكاة البيانات - في التطبيق الحقيقي ستأتي من API
      const mockProfile = {
        id: 1,
        companyName: 'شركة الإمدادات المتقدمة',
        contactPerson: 'أحمد محمد السعيد',
        email: 'supplier@demo.com',
        phone: '+966501234567',
        address: 'الرياض، حي الملك فهد، شارع العليا',
        website: 'www.advanced-supplies.com',
        businessType: 'تجارة الإلكترونيات والأثاث',
        establishedYear: '2018',
        employeeCount: '25-50',
        description: 'شركة رائدة في توريد الإلكترونيات والأثاث المكتبي بجودة عالية وأسعار تنافسية. نخدم العملاء في جميع أنحاء المملكة العربية السعودية.',
        certifications: [
          'شهادة الجودة ISO 9001',
          'ترخيص وزارة التجارة',
          'عضوية غرفة التجارة'
        ],
        bankDetails: {
          bankName: 'البنك الأهلي السعودي',
          accountNumber: '****1234',
          iban: 'SA****1234567890'
        },
        taxInfo: {
          taxNumber: '123456789',
          vatRegistered: true
        },
        statistics: {
          totalOrders: 89,
          totalRevenue: 125000,
          activeProducts: 156,
          customerRating: 4.8
        }
      };
      setProfile(mockProfile);
      setEditedProfile(mockProfile);
    } catch (error) {
      console.error('خطأ في جلب بيانات الملف الشخصي:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // في التطبيق الحقيقي سيتم إرسال البيانات للخادم
      setProfile(editedProfile);
      setIsEditing(false);
      alert('تم حفظ التغييرات بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
      alert('حدث خطأ في حفظ البيانات');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* العنوان */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
            <p className="text-gray-600">إدارة معلومات شركتك وبياناتك الشخصية</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                تعديل الملف
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  حفظ التغييرات
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  إلغاء
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* المعلومات الأساسية */}
        <div className="lg:col-span-2 space-y-6">
          {/* معلومات الشركة */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  معلومات الشركة
                </CardTitle>
                <CardDescription>البيانات الأساسية للشركة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم الشركة</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.companyName || ''}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.companyName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الشخص المسؤول</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.contactPerson || ''}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.contactPerson}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع النشاط</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.businessType || ''}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.businessType}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">سنة التأسيس</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.establishedYear || ''}
                        onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.establishedYear}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">عدد الموظفين</label>
                    {isEditing ? (
                      <select
                        value={editedProfile.employeeCount || ''}
                        onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="1-10">1-10</option>
                        <option value="11-25">11-25</option>
                        <option value="25-50">25-50</option>
                        <option value="50-100">50-100</option>
                        <option value="100+">100+</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{profile.employeeCount}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الموقع الإلكتروني</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.website || ''}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.website}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">وصف الشركة</label>
                  {isEditing ? (
                    <textarea
                      value={editedProfile.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* معلومات الاتصال */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  معلومات الاتصال
                </CardTitle>
                <CardDescription>بيانات التواصل والعنوان</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editedProfile.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.phone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900">{profile.address}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* البيانات المصرفية والضريبية */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  البيانات المالية
                </CardTitle>
                <CardDescription>المعلومات المصرفية والضريبية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم البنك</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.bankDetails?.bankName || ''}
                        onChange={(e) => handleNestedInputChange('bankDetails', 'bankName', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.bankDetails?.bankName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الحساب</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.bankDetails?.accountNumber || ''}
                        onChange={(e) => handleNestedInputChange('bankDetails', 'accountNumber', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.bankDetails?.accountNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الآيبان</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.bankDetails?.iban || ''}
                        onChange={(e) => handleNestedInputChange('bankDetails', 'iban', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.bankDetails?.iban}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الرقم الضريبي</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.taxInfo?.taxNumber || ''}
                        onChange={(e) => handleNestedInputChange('taxInfo', 'taxNumber', e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-900">{profile.taxInfo?.taxNumber}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* الشريط الجانبي */}
        <div className="space-y-6">
          {/* الإحصائيات */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{profile.statistics?.totalOrders}</p>
                  <p className="text-sm text-blue-700">إجمالي الطلبات</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{profile.statistics?.totalRevenue?.toLocaleString()}</p>
                  <p className="text-sm text-green-700">إجمالي الإيرادات (ريال)</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{profile.statistics?.activeProducts}</p>
                  <p className="text-sm text-purple-700">المنتجات النشطة</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{profile.statistics?.customerRating}</p>
                  <p className="text-sm text-yellow-700">تقييم العملاء</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* الشهادات والتراخيص */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  الشهادات والتراخيص
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.certifications?.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SupplierProfile;

