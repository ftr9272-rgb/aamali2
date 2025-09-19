import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Store, Factory, Truck, User, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { apiFetch } from '../lib/api';

const Auth = ({ onLogin, preSelectedUserType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(preSelectedUserType || 'merchant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call API via apiFetch which centralizes Authorization header handling
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: { username, password }
      });
      if (data && data.token) {
        try { localStorage.setItem('token', data.token); } catch (setErr) { console.debug('Failed to set token in localStorage', setErr); }
      }
      onLogin(userType, data.user || null);
    } catch (err) {
      // apiFetch throws on non-2xx with message like "<status> <body>"; try to extract useful text
      let msg = err && err.message ? err.message : null;
      if (msg) {
        // strip leading status code if present
        const parts = msg.split(' ');
        if (parts.length > 1 && /^\d{3}$/.test(parts[0])) {
          parts.shift();
          msg = parts.join(' ');
        }
        // try JSON
        try {
          const parsed = JSON.parse(msg);
          msg = parsed && (parsed.error || parsed.message) ? (parsed.error || parsed.message) : JSON.stringify(parsed);
        } catch {
          // leave as-is
        }
      }
      setError(msg || '\u062d\u062f\u062b \u062e\u0637\u0623 \u0623\u062b\u0646\u0627\u0621 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644');
      console.error('Login exception:', err);
    } finally {
      setLoading(false);
    }
  };

  const userTypes = [
    { value: 'merchant', label: 'تاجر', icon: <Store className="h-5 w-5" />, color: 'bg-blue-500' },
    { value: 'supplier', label: 'مورد', icon: <Factory className="h-5 w-5" />, color: 'bg-green-500' },
    { value: 'shipping', label: 'شركة شحن', icon: <Truck className="h-5 w-5" />, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
            >
              <User className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">تسجيل الدخول</CardTitle>
            <p className="text-gray-600">اختر نوع حسابك وادخل بياناتك</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* اختيار نوع المستخدم - يظهر فقط إذا لم يتم تحديد نوع مسبقاً */}
            {!preSelectedUserType && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">نوع الحساب</Label>
                <div className="grid grid-cols-1 gap-2">
                  {userTypes.map((type) => (
                    <motion.button
                      key={type.value}
                      type="button"
                      onClick={() => setUserType(type.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                        userType === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-2 rounded-lg ${type.color} text-white`}>
                        {type.icon}
                      </div>
                      <span className="font-medium">{type.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* عرض نوع المستخدم المحدد مسبقاً */}
            {preSelectedUserType && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">نوع الحساب</Label>
                <div className="p-3 rounded-lg border-2 border-blue-500 bg-blue-50 text-blue-700 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${userTypes.find(type => type.value === preSelectedUserType)?.color} text-white`}>
                    {userTypes.find(type => type.value === preSelectedUserType)?.icon}
                  </div>
                  <span className="font-medium">{userTypes.find(type => type.value === preSelectedUserType)?.label}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">اسم المستخدم</Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pr-10"
                    placeholder="أدخل اسم المستخدم"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex items-center justify-between">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'جارٍ...' : 'تسجيل الدخول'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;

