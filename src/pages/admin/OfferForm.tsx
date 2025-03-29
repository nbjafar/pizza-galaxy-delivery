
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { getOfferById, addOffer, updateOffer, getMenuItems } from '@/services/database';
import { toast } from '@/components/ui/sonner';

const OfferForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const menuItems = getMenuItems();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    discount: 0,
    menuItemIds: [] as number[],
    startDate: '',
    endDate: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  
  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const offer = getOfferById(Number(id));
      
      if (offer) {
        setFormData({
          title: offer.title,
          description: offer.description,
          imageUrl: offer.imageUrl || '',
          discount: offer.discount,
          menuItemIds: offer.menuItemIds || [],
          startDate: offer.startDate,
          endDate: offer.endDate,
          isActive: offer.isActive
        });
      } else {
        toast.error('Offer not found');
        navigate('/admin/offers');
      }
    } else {
      // Set default dates for new offers
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);
      
      setFormData({
        ...formData,
        startDate: today.toISOString().split('T')[0],
        endDate: nextMonth.toISOString().split('T')[0]
      });
    }
  }, [id, isEditMode, navigate]);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error
    if (name in errors) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0
    });
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked
    });
  };
  
  const toggleMenuItem = (itemId: number) => {
    setFormData(prev => {
      const items = prev.menuItemIds.includes(itemId)
        ? prev.menuItemIds.filter(id => id !== itemId)
        : [...prev.menuItemIds, itemId];
      
      return {
        ...prev,
        menuItemIds: items
      };
    });
  };
  
  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
      startDate: '',
      endDate: ''
    };
    
    let isValid = true;
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
      isValid = false;
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
      isValid = false;
    }
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const offerData = {
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl || undefined,
      discount: formData.discount,
      menuItemIds: formData.menuItemIds.length > 0 ? formData.menuItemIds : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive
    };
    
    if (isEditMode) {
      updateOffer(Number(id), offerData);
    } else {
      addOffer(offerData);
    }
    
    // Redirect to offers list
    navigate('/admin/offers');
  };

  // Group menu items by category
  const menuItemsByCategory = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-playfair">
            {isEditMode ? 'Edit Offer' : 'Create New Offer'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isEditMode ? 'Update existing offer details' : 'Create a new special offer or promotion'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Offer Title*</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                
                <div>
                  <Label htmlFor="description">Description*</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={errors.description ? 'border-red-500' : ''}
                    rows={4}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
                
                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Enter the URL of the offer image. Recommended size: 800x400 pixels.
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="discount">Discount Percentage (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleNumberChange}
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Set to 0 if this is a special deal not based on percentage discount.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date*</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={errors.startDate ? 'border-red-500' : ''}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">End Date*</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={errors.endDate ? 'border-red-500' : ''}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                
                {formData.imageUrl && (
                  <div className="mt-4">
                    <Label>Image Preview</Label>
                    <div className="mt-2 border rounded-md overflow-hidden h-48 bg-gray-100">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <Label>Applicable Menu Items</Label>
                <p className="text-gray-500 text-sm mb-4">
                  Select the menu items this offer applies to. Leave unselected to apply to any item.
                </p>
                
                <div className="border rounded-md p-4 h-[500px] overflow-y-auto">
                  {Object.entries(menuItemsByCategory).map(([category, items]) => (
                    <div key={category} className="mb-4">
                      <h3 className="font-bold text-sm uppercase text-gray-500 mb-2">{category}</h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`item-${item.id}`}
                              checked={formData.menuItemIds.includes(item.id)}
                              onCheckedChange={() => toggleMenuItem(item.id)}
                            />
                            <Label htmlFor={`item-${item.id}`} className="flex items-center">
                              <span>{item.name}</span>
                              <span className="ml-2 text-sm text-gray-500">${item.price.toFixed(2)}</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" type="button" onClick={() => navigate('/admin/offers')}>
                Cancel
              </Button>
              <Button type="submit" className="bg-pizza hover:bg-pizza-light">
                {isEditMode ? 'Update Offer' : 'Create Offer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OfferForm;
