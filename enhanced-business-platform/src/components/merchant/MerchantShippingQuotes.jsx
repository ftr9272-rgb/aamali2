import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { PlusCircle, Truck, DollarSign, CalendarDays, MapPin, Package, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const MerchantShippingQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newQuoteRequest, setNewQuoteRequest] = useState({
    origin_address: '',
    destination_address: '',
    package_details: '',
    weight: '',
    dimensions: '',
    delivery_date_required: '',
    notes: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/merchant/shipping-quotes');
      setQuotes(data.quotes);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleNewQuoteRequestChange = (e) => {
    const { name, value } = e.target;
    setNewQuoteRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewQuoteRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/api/merchant/shipping-quotes', { method: 'POST', body: newQuoteRequest });
      alert('تم إنشاء طلب عرض الشحن بنجاح!');
      setIsModalOpen(false);
      setNewQuoteRequest({
        origin_address: '',
        destination_address: '',
        package_details: '',
        weight: '',
        dimensions: '',
        delivery_date_required: '',
        notes: ''
      });
      fetchQuotes(); // Refresh the list
    } catch (error) {
      alert(`خطأ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && quotes.length === 0) return <div className="text-center py-8">جاري تحميل عروض الشحن...</div>;
  if (error) return <div className="text-center py-8 text-red-500">خطأ في تحميل البيانات: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">عروض الشحن</h1>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="h-4 w-4 ml-2" /> طلب عرض شحن جديد
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <DialogHeader>
            <DialogTitle>إنشاء طلب عرض شحن جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitNewQuoteRequest} className="space-y-4">
            <div>
              <Label htmlFor="origin_address">عنوان المنشأ</Label>
              <Input id="origin_address" name="origin_address" value={newQuoteRequest.origin_address} onChange={handleNewQuoteRequestChange} required />
            </div>
            <div>
              <Label htmlFor="destination_address">عنوان الوجهة</Label>
              <Input id="destination_address" name="destination_address" value={newQuoteRequest.destination_address} onChange={handleNewQuoteRequestChange} required />
            </div>
            <div>
              <Label htmlFor="package_details">تفاصيل الطرد</Label>
              <Textarea id="package_details" name="package_details" value={newQuoteRequest.package_details} onChange={handleNewQuoteRequestChange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">الوزن (كجم)</Label>
                <Input id="weight" name="weight" type="number" step="0.01" value={newQuoteRequest.weight} onChange={handleNewQuoteRequestChange} />
              </div>
              <div>
                <Label htmlFor="dimensions">الأبعاد (طولxعرضxارتفاع سم)</Label>
                <Input id="dimensions" name="dimensions" value={newQuoteRequest.dimensions} onChange={handleNewQuoteRequestChange} />
              </div>
            </div>
            <div>
              <Label htmlFor="delivery_date_required">تاريخ التسليم المطلوب</Label>
              <Input id="delivery_date_required" name="delivery_date_required" type="date" value={newQuoteRequest.delivery_date_required} onChange={handleNewQuoteRequestChange} />
            </div>
            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea id="notes" name="notes" value={newQuoteRequest.notes} onChange={handleNewQuoteRequestChange} />
            </div>

            <DialogFooter>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                <Send className="h-4 w-4 ml-2" /> إرسال الطلب
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quotes.length > 0 ? (
          quotes.map((quote) => (
            <Card key={quote.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">طلب شحن #{quote.request_number}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">من: {quote.origin_address} إلى: {quote.destination_address}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Package className="h-4 w-4 text-blue-500 ml-2" />
                  <span>تفاصيل الطرد: {quote.package_details}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <CalendarDays className="h-4 w-4 text-purple-500 ml-2" />
                  <span>تاريخ التسليم المطلوب: {quote.delivery_date_required}</span>
                </div>
                {quote.shipping_company && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Truck className="h-4 w-4 text-green-500 ml-2" />
                    <span>شركة الشحن: {quote.shipping_company.company_name}</span>
                  </div>
                )}
                {quote.quoted_price && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <DollarSign className="h-4 w-4 text-orange-500 ml-2" />
                    <span>السعر المقترح: {quote.quoted_price?.toLocaleString('ar-SA')} ر.س</span>
                  </div>
                )}
                <div className="pt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : quote.status === 'quoted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : quote.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                    الحالة: {quote.status === 'pending' ? 'معلق' : quote.status === 'quoted' ? 'تم التسعير' : quote.status === 'accepted' ? 'مقبول' : quote.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">لا توجد عروض شحن حتى الآن.</p>
        )}
      </div>
    </div>
  );
};

export default MerchantShippingQuotes;

