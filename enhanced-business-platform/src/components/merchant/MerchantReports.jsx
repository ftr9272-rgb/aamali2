import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { FileText, PlusCircle, Download, CalendarDays } from 'lucide-react';

const MerchantReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    report_type: 'purchases',
    title: '',
    description: '',
    date_from: '',
    date_to: ''
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/merchant/reports');
      if (!data || !data.reports || data.reports.length === 0) {
        throw new Error('empty');
      }
      setReports(data.reports);
      setUsingMock(false);
    } catch (error) {
      console.warn('Reports fetch failed, falling back to mock data:', error.message);
      setError(null);
      // fallback mock reports for development/demo
      const mockReports = [
        {
          id: 1,
          title: 'تقرير مشتريات - الفترة الحالية',
          report_type: 'purchases',
          description: 'ملخص المشتريات والموردين خلال الفترة المحددة',
          date_from: '2024-01-01',
          date_to: '2024-06-30'
        },
        {
          id: 2,
          title: 'تقرير المدفوعات',
          report_type: 'payments',
          description: 'تفاصيل المدفوعات المحوّلة للموردين',
          date_from: '2024-05-01',
          date_to: '2024-05-31'
        }
      ];
      setReports(mockReports);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleNewReportChange = (name, value) => {
    setNewReport(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/api/merchant/reports/generate', { method: 'POST', body: newReport });
      alert('تم إنشاء التقرير بنجاح!');
      setIsModalOpen(false);
      setNewReport({
        report_type: 'purchases',
        title: '',
        description: '',
        date_from: '',
        date_to: ''
      });
      fetchReports(); // Refresh the list
    } catch (error) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && reports.length === 0) return <div className="text-center py-8">جاري تحميل التقارير...</div>;
  if (error) return <div className="text-center py-8 text-red-500">خطأ في تحميل البيانات: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">التقارير</h1>
      {usingMock && (
        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded">
          بيانات العرض مؤقتة (وهمية) — لم يتم الحصول على تقارير من الخادم، لذلك نعرض بيانات تجريبية.
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="h-4 w-4 ml-2" /> إنشاء تقرير جديد
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <DialogHeader>
            <DialogTitle>إنشاء تقرير جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGenerateReport} className="space-y-4">
            <div>
              <Label htmlFor="report_type">نوع التقرير</Label>
              <Select name="report_type" value={newReport.report_type} onValueChange={(value) => handleNewReportChange('report_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التقرير" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchases">المشتريات</SelectItem>
                  <SelectItem value="payments">المدفوعات</SelectItem>
                  <SelectItem value="suppliers">الموردين</SelectItem>
                  <SelectItem value="inventory">المخزون</SelectItem>
                  <SelectItem value="profit_loss">الأرباح والخسائر</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">العنوان</Label>
              <Input id="title" name="title" value={newReport.title} onChange={(e) => handleNewReportChange('title', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">الوصف</Label>
              <Input id="description" name="description" value={newReport.description} onChange={(e) => handleNewReportChange('description', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="date_from">من تاريخ</Label>
              <Input id="date_from" name="date_from" type="date" value={newReport.date_from} onChange={(e) => handleNewReportChange('date_from', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="date_to">إلى تاريخ</Label>
              <Input id="date_to" name="date_to" type="date" value={newReport.date_to} onChange={(e) => handleNewReportChange('date_to', e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                <FileText className="h-4 w-4 ml-2" /> إنشاء التقرير
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.length > 0 ? (
          reports.map((report) => (
            <Card key={report.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{report.title}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">نوع التقرير: {report.report_type}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">{report.description}</p>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <CalendarDays className="h-4 w-4 text-blue-500 ml-2" />
                  <span>الفترة: {report.date_from} - {report.date_to}</span>
                </div>
                <div className="pt-2">
                  <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400">
                    <Download className="h-4 w-4 ml-2" /> تحميل التقرير
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">لا توجد تقارير حتى الآن.</p>
        )}
      </div>
    </div>
  );
};

export default MerchantReports;

