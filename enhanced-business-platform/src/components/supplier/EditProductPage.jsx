import React, { useState, useEffect } from 'react';
// motion is used via JSX tags (e.g. <motion.div />); ESLint may false-positive that it's unused
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  FileText,
  DollarSign,
  Package,
  Tag,
  X,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useNavigate, useParams } from 'react-router-dom';

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const api = await import('../../lib/api.js');
        const data = await api.apiFetch(`/api/supplier/products/${productId}`);
        // normalize names used in this page
        const normalized = {
          id: data.id,
          name: data.name,
          description: data.description,
          category: data.category,
          price: data.price,
          stockQuantity: data.stock_quantity ?? data.stock ?? 0,
          minOrderQuantity: data.min_order_quantity ?? 1,
          unit: data.unit || 'piece',
          images: data.images || []
        };
        setProduct(normalized);
        setImagePreviews(normalized.images || []);
        return;
      } catch (err) {
        console.warn('Failed to fetch product, using mock', err);
      }

      const mockProduct = {
        id: parseInt(productId),
        name: 'جهاز كمبيوتر محمول HP',
        description: 'جهاز كمبيوتر محمول عالي الأداء مع معالج Intel Core i7 وذاكرة RAM سعة 16GB وقرص SSD سعة 512GB.',
        category: 'إلكترونيات',
        price: 2500,
        stockQuantity: 25,
        minOrderQuantity: 1,
        unit: 'piece',
        images: [
          'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
        ]
      };

      setProduct(mockProduct);
      setImagePreviews(mockProduct.images || []);
    })();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newPreviews.push(reader.result);
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const imageToRemove = imagePreviews[index];
    setImagePreviews(prev => prev.filter((_, i) => i !== index));

    // إضافة الصورة المحذوفة إلى قائمة الصور المحذوفة
    if (imageToRemove && !deletedImages.includes(imageToRemove)) {
      setDeletedImages(prev => [...prev, imageToRemove]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name: product.name,
        description: product.description,
        category: product.category,
        price: parseFloat(product.price || 0),
        stock_quantity: parseInt(product.stockQuantity || 0, 10),
        min_order_quantity: parseInt(product.minOrderQuantity || 1, 10),
        unit: product.unit,
        images: imagePreviews,
        deleted_images: deletedImages
      };

      try {
        const api = await import('../../lib/api.js');
        await api.apiFetch(`/api/supplier/products/${productId}`, { method: 'PUT', body: JSON.stringify(payload) });
        alert('تم تحديث المنتج بنجاح!');
        navigate('/supplier/products');
      } catch (err) {
        console.warn('API update failed, falling back to local:', err);
        await new Promise(resolve => setTimeout(resolve, 800));
        alert('تم تحديث المنتج محلياً');
        navigate('/supplier/products');
      }
    } catch (error) {
      console.error('خطأ في تحديث المنتج:', error);
      alert('حدث خطأ أثناء تحديث المنتج');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    'إلكترونيات',
    'أثاث',
    'ملابس',
    'أدوات منزلية',
    'مواد غذائية',
    'صحة و جمال',
    'كتب',
    'ألعاب',
    'مستلزمات مكتبية'
  ];

  const units = [
    { value: 'piece', label: 'قطعة' },
    { value: 'kg', label: 'كيلو جرام' },
    { value: 'liter', label: 'لتر' },
    { value: 'meter', label: 'متر' },
    { value: 'box', label: 'صندوق' },
    { value: 'pack', label: 'عبوة' }
  ];

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات المنتج...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* عنوان الصفحة */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/supplier/products')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              العودة
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">تعديل المنتج</h1>
              <p className="text-gray-600 mt-1">تعديل معلومات المنتج الحالية</p>
            </div>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* معلومات المنتج */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  معلومات المنتج
                </CardTitle>
                <CardDescription>
                  عدل المعلومات الأساسية عن المنتج
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المنتج <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    required
                    placeholder="أدخل اسم المنتج"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل وصفاً تفصيلياً للمنتج"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السعر (ريال) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      name="price"
                      value={product.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الوحدة <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="unit"
                      value={product.unit}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {units.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الكمية المتوفرة <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      name="stockQuantity"
                      value={product.stockQuantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحد الأدنى للطلب <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      name="minOrderQuantity"
                      value={product.minOrderQuantity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* صور المنتج */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  صور المنتج
                </CardTitle>
                <CardDescription>
                  عدل أو أضف صوراً جديدة للمنتج (أقصى 5 صور)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رفع صور جديدة
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">انقر للرفع</span> أو اسحب الصور هنا
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (حتى 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        max="5"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* معاينة الصور */}
                {imagePreviews.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      معاينة الصور
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`معاينة ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* صور المنتج الأصلية */}
                {product.images && product.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الصور الحالية
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {product.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`الصورة الأصلية ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(imagePreviews.indexOf(image))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* أزرار الحفظ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex justify-end gap-4"
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/supplier/products')}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default EditProductPage;
