import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Save, XCircle, Bell, Globe, Lock, Edit } from 'lucide-react';

const MerchantSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/merchant/settings');
      if (!data || !data.settings) throw new Error('empty');
      setSettings(data.settings);
      setFormData(data.settings); // Initialize form data with fetched settings
      setUsingMock(false);
    } catch (error) {
      console.warn('Failed to fetch merchant settings, using mock:', error.message);
      setError(null);
      const mockSettings = {
        language: 'ar',
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        email_notifications: 'enabled',
        sms_notifications: 'disabled',
        theme: 'light'
      };
      setSettings(mockSettings);
      setFormData(mockSettings);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiFetch('/api/merchant/settings', { method: 'PUT', body: formData });
      alert('تم تحديث الإعدادات بنجاح!');
      setIsEditing(false);
      fetchSettings(); // Re-fetch to ensure UI is updated with latest data
    } catch (error) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">جاري تحميل الإعدادات...</div>;
  if (error) return <div className="text-center py-8 text-red-500">خطأ في تحميل البيانات: {error}</div>;
  if (!settings) return <div className="text-center py-8 text-gray-500 dark:text-gray-400">لم يتم العثور على الإعدادات.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">الإعدادات</h1>
      {usingMock && (
        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded">
          بيانات الإعدادات المعروضة مؤقتة (وهمية). تأكد من أن الخادم يعمل أو سجّل الدخول للحصول على إعدادات حقيقية.
        </div>
      )}

      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">الإعدادات العامة</CardTitle>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Edit className="h-4 w-4 ml-2" /> تعديل
            </Button>
          ) : (
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                <Save className="h-4 w-4 ml-2" /> حفظ
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400">
                <XCircle className="h-4 w-4 ml-2" /> إلغاء
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="language">اللغة</Label>
            <Select name="language" value={isEditing ? formData.language : settings.language} onValueChange={(value) => handleSelectChange('language', value)} disabled={!isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="اختر اللغة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">الإنجليزية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="timezone">المنطقة الزمنية</Label>
            <Input id="timezone" name="timezone" value={isEditing ? formData.timezone : settings.timezone} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div>
            <Label htmlFor="currency">العملة الافتراضية</Label>
            <Input id="currency" name="currency" value={isEditing ? formData.currency : settings.currency} onChange={handleInputChange} disabled={!isEditing} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">إعدادات الإشعارات</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email_notifications">إشعارات البريد الإلكتروني</Label>
            <Select name="email_notifications" value={isEditing ? formData.email_notifications : settings.email_notifications} onValueChange={(value) => handleSelectChange('email_notifications', value)} disabled={!isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="اختر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">مفعلة</SelectItem>
                <SelectItem value="disabled">معطلة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sms_notifications">إشعارات الرسائل القصيرة</Label>
            <Select name="sms_notifications" value={isEditing ? formData.sms_notifications : settings.sms_notifications} onValueChange={(value) => handleSelectChange('sms_notifications', value)} disabled={!isEditing}>
              <SelectTrigger>
                <SelectValue placeholder="اختر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">مفعلة</SelectItem>
                <SelectItem value="disabled">معطلة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Add more settings sections as needed, e.g., Security, Integrations */}
    </div>
  );
};

export default MerchantSettings;

