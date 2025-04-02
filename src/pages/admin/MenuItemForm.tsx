
import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { getMenuItemById, addMenuItem, updateMenuItem, getMenuCategories } from '@/services/api';
import { toast } from 'sonner';
import { UploadCloud } from 'lucide-react';

const MenuItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    imageFile: null as File | null,
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
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const data = await getMenuCategories();
      setCategories(data);
    };
    
    loadCategories();
  }, []);
  
  // Initialize form with existing data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchMenuItem = async () => {
        setLoading(true);
        try {
          const menuItem = await getMenuItemById(Number(id));
          
          if (menuItem) {
            setFormData({
              name: menuItem.name,
              description: menuItem.description,
              price: menuItem.price,
              category: menuItem.category,
              image: menuItem.image || '',
              imageFile: null,
              popular: menuItem.popular || false,
              discount: menuItem.discount || 0,
              newCategory: '',
              availableSizes: menuItem.availableSizes || [],
              availableToppings: menuItem.availableToppings || []
            });
            
            if (menuItem.image) {
              setImagePreview(menuItem.image);
            }
          } else {
            toast.error('Menu item not found');
            navigate('/admin/menu-items');
          }
        } catch (error) {
          console.error('Error loading menu item:', error);
          toast.error('Failed to load menu item');
        } finally {
          setLoading(false);
        }
      };
      
      fetchMenuItem();
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
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      console.log('File selected:', file.name, file.type, file.size);
      
      // Update form data with the selected file
      setFormData({
        ...formData,
        imageFile: file,
        image: '' // Clear URL field when a file is selected
      });
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Determine final category (use new category if provided)
      const finalCategory = formData.newCategory || formData.category;
      
      // Create FormData for API submission
      const itemFormData = new FormData();
      itemFormData.append('name', formData.name);
      itemFormData.append('description', formData.description);
      itemFormData.append('price', formData.price.toString());
      itemFormData.append('category', finalCategory);
      
      // Explicitly convert boolean to string to ensure proper server handling
      itemFormData.append('popular', formData.popular ? 'true' : 'false');
      
      if (formData.discount > 0) {
        itemFormData.append('discount', formData.discount.toString());
      }
      
      if (formData.availableSizes.length > 0) {
        itemFormData.append('availableSizes', JSON.stringify(formData.availableSizes));
      }
      
      if (formData.availableToppings.length > 0) {
        itemFormData.append('availableToppings', JSON.stringify(formData.availableToppings));
      }
      
      // Add image file if one was selected
      if (formData.imageFile) {
        console.log('Appending image file to FormData:', formData.imageFile.name);
        itemFormData.append('image', formData.imageFile);
      } else if (formData.image) {
        // Use the existing image URL if no new file was selected
        console.log('Using existing image URL:', formData.image);
        itemFormData.append('image', formData.image);
      }
      
      // Log the FormData contents for debugging
      console.log('Submitting FormData:');
      for (const pair of (itemFormData as any).entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
      }
      
      if (isEditMode) {
        await updateMenuItem(Number(id), itemFormData);
      } else {
        await addMenuItem(itemFormData);
      }
      
      toast.success(`Menu item ${isEditMode ? 'updated' : 'added'} successfully`);
      navigate('/admin/menu-items');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} menu item`);
    } finally {
      setLoading(false);
    }
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
                    autoComplete="off"
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
                    autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageFile">Item Image</Label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="image" className="text-sm text-gray-600 mb-1 block">Image URL</Label>
                      <Input
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        disabled={!!formData.imageFile}
                        autoComplete="off"
                      />
                    </div>
                    
                    <div className="border border-dashed border-gray-300 rounded-md p-4">
                      <Label htmlFor="imageFile" className="text-sm text-gray-600 mb-1 block">Or Upload Image</Label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="imageFile" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                              <span>Upload a file</span>
                              <Input
                                id="imageFile"
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="sr-only"
                                autoComplete="off"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          {formData.imageFile && (
                            <p className="text-xs text-green-500">
                              File selected: {formData.imageFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Images are stored in the server/uploads directory. Recommended size: 500x500 pixels.
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="category">Category*</Label>
                  {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                  
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                    autoComplete="off"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
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
                      autoComplete="off"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="popular"
                    name="popular"
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
                          name={`size-${size}`}
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
                          name={`topping-${topping}`}
                          checked={formData.availableToppings.includes(topping)}
                          onCheckedChange={() => toggleTopping(topping)}
                        />
                        <Label htmlFor={`topping-${topping}`}>{topping}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {(imagePreview || formData.image) && (
                  <div className="mt-4">
                    <Label>Image Preview</Label>
                    <div className="mt-2 border rounded-md overflow-hidden h-48 bg-gray-100">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                          toast.error("Failed to load image preview");
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
              <Button type="submit" className="bg-pizza hover:bg-pizza-light" disabled={loading}>
                {loading ? 'Processing...' : isEditMode ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MenuItemForm;
