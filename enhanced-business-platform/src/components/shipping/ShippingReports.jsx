import React, { useState } from 'react';
import { TrendingUp, Download, Calendar, DollarSign, Package, Truck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const ShippingReports = () => {
  const [_selectedPeriod, _setSelectedPeriod] = useState('month');

  const reportData = {
    totalRevenue: 45000,
    totalShipments: 156,
    averagePrice: 288,
    deliveryRate: 98.5,
    monthlyData: [
      { month: 'يناير', revenue: 35000, shipments: 120 },
      { month: 'فبراير', revenue: 42000, shipments: 145 },
      { month: 'مارس', revenue: 45000, shipments: 156 }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">التقارير والإحصائيات</h1>
            <p className="text-gray-600">تحليل أداء الشحن والإيرادات</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>

        {/* بطاقات الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.totalRevenue.toLocaleString()} ريال</p>
                  <p className="text-sm text-green-600">+12% من الشهر الماضي</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الشحنات</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.totalShipments}</p>
                  <p className="text-sm text-blue-600">+8% من الشهر الماضي</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">متوسط سعر الشحنة</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.averagePrice} ريال</p>
                  <p className="text-sm text-purple-600">+3% من الشهر الماضي</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">معدل التسليم الناجح</p>
                  <p className="text-2xl font-bold text-gray-900">{reportData.deliveryRate}%</p>
                  <p className="text-sm text-green-600">+0.5% من الشهر الماضي</p>
                </div>
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>الإيرادات الشهرية</CardTitle>
              <CardDescription>تطور الإيرادات خلال الأشهر الماضية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{data.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(data.revenue / 50000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{data.revenue.toLocaleString()} ريال</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>عدد الشحنات الشهرية</CardTitle>
              <CardDescription>تطور عدد الشحنات خلال الأشهر الماضية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{data.month}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(data.shipments / 200) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{data.shipments} شحنة</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingReports;

