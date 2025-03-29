
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { getMenuItemById, addMenuItem, updateMenuItem, getMenuCategories } from '@/services/database';
import { toast } from '@/components/ui/sonner';

const MenuItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const existingCategories = getMenuCategories();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    popular: false,
    discount: 0,
    newCategory: '',
    availableSizes: [] as string[],
    availableToppings: [] as string[]
  });
  
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  
  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const menuItem = getMenuItemById(Number(id));
      
      if (menuItem) {
        setFormData({
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          category: menuItem.category,
          image: menuItem.image || '',
          popular: menuItem.popular || false,
          discount: menuItem.discount || 0,
          newCategory: '',
          availableSizes: menuItem.availableSizes || [],
          availableToppings: menuItem.availableToppings || []
        });
      } else {
        toast.error('Menu item not found');
        navigate('/admin/menu-items');
      }
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
    
    // Clear validation error
    if (name in errors) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      popular: checked
    });
  };
  
  const toggleSize = (size: string) => {
    setFormData(prev => {
      const sizes = prev.availableSizes.includes(size)
        ? prev.availableSizes.filter(s => s !== size)
        : [...prev.availableSizes, size];
      
      return {
        ...prev,
        availableSizes: sizes
      };
    });
  };
  
  const toggleTopping = (topping: string) => {
    setFormData(prev => {
      const toppings = prev.availableToppings.includes(topping)
        ? prev.availableToppings.filter(t => t !== topping)
        : [...prev.availableToppings, topping];
      
      return {
        ...prev,
        availableToppings: toppings
      };
    });
  };
  
  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      price: '',
      category: ''
    };
    
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
      isValid = false;
    }
    
    if (!formData.category && !formData.newCategory) {
      newErrors.category = 'Category is required';
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
    
    // Determine final category (use new category if provided)
    const finalCategory = formData.newCategory || formData.category;
    
    const itemData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: finalCategory,
      image: formData.image,
      popular: formData.popular,
      discount: formData.discount || undefined,
      availableSizes: formData.availableSizes.length > 0 ? formData.availableSizes : undefined,
      availableToppings: formData.availableToppings.length > 0 ? formData.availableToppings : undefined
    };
    
    if (isEditMode) {
      updateMenuItem(Number(id), itemData);
    } else {
      addMenuItem(itemData);
    }
    
    // Redirect to menu items list
    navigate('/admin/menu-items');
  };
  
  // Default sizes and toppings
  const availableSizes = ['Small', 'Medium', 'Large', 'Family'];
  const availableToppings = [
    'Extra Cheese', 
    'Mushrooms', 
    'Pepperoni', 
    'Onions', 
    'Bell Peppers', 
    'Olives', 
    'Bacon', 
    'Ham', 
    'Pineapple', 
    'Jalapeños'
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-playfair">
            {isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isEditMode ? 'Update existing menu item details' : 'Create a new menu item to add to your menu'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Item Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)*</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleNumberChange}
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Enter the URL of the pizza image. Recommended size: 500x500 pixels.
                  </p>
                </div>
                
                <div>
                  <Label>Category*</Label>
                  {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                  
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                  >
                    <option value="">Select a category</option>
                    {existingCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  
                  <div className="mt-2">
                    <Label htmlFor="newCategory">Or add a new category</Label>
                    <Input
                      id="newCategory"
                      name="newCategory"
                      value={formData.newCategory}
                      onChange={handleInputChange}
                      placeholder="E.g. Specialty Pizzas"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="popular"
                    checked={formData.popular}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="popular">Mark as Popular</Label>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label>Available Sizes</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableSizes.map((size) => (
                      <div key={size} className="flex items-center space-x-2">
                        <Checkbox
                          id={`size-${size}`}
                          checked={formData.availableSizes.includes(size)}
                          onCheckedChange={() => toggleSize(size)}
                        />
                        <Label htmlFor={`size-${size}`}>{size}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Available Toppings</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableToppings.map((topping) => (
                      <div key={topping} className="flex items-center space-x-2">
                        <Checkbox
                          id={`topping-${topping}`}
                          checked={formData.availableToppings.includes(topping)}
                          onCheckedChange={() => toggleTopping(topping)}
                        />
                        <Label htmlFor={`topping-${topping}`}>{topping}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {formData.image && (
                  <div className="mt-4">
                    <Label>Image Preview</Label>
                    <div className="mt-2 border rounded-md overflow-hidden h-48 bg-gray-100">
                      <img
                        src={formData.image}
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
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" type="button" onClick={() => navigate('/admin/menu-items')}>
                Cancel
              </Button>
              <Button type="submit" className="bg-pizza hover:bg-pizza-light">
                {isEditMode ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MenuItemForm;
