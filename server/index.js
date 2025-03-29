const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const UPLOAD_DIRECTORY = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIRECTORY)) {
  fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });
  console.log(`Created uploads directory at: ${UPLOAD_DIRECTORY}`);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIRECTORY);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pizza_galaxy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testDBConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

testDBConnection();

// ------------------------------------------------
// API Routes
// ------------------------------------------------

// Authentication
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [users] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // For demo purposes with plain text password
    // In production, use bcrypt.compare(password, user.password)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login time
    await pool.query(
      'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );
    
    // Don't send password in response
    delete user.password;
    
    res.json({ 
      user,
      message: 'Login successful' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Menu Categories
app.get('/api/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Menu Items
app.get('/api/menu-items', async (req, res) => {
  try {
    const [menuItems] = await pool.query(`
      SELECT m.*, c.name as category_name 
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
    `);
    
    // For each menu item, get its available sizes and toppings
    for (const item of menuItems) {
      // Get sizes
      const [sizes] = await pool.query(`
        SELECT s.name 
        FROM menu_item_sizes mis
        JOIN sizes s ON mis.size_id = s.id
        WHERE mis.menu_item_id = ?
      `, [item.id]);
      
      item.availableSizes = sizes.map(s => s.name);
      
      // Get toppings
      const [toppings] = await pool.query(`
        SELECT t.name 
        FROM menu_item_toppings mit
        JOIN toppings t ON mit.topping_id = t.id
        WHERE mit.menu_item_id = ?
      `, [item.id]);
      
      item.availableToppings = toppings.map(t => t.name);
    }
    
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
});

app.get('/api/menu-items/:id', async (req, res) => {
  try {
    const [menuItems] = await pool.query(`
      SELECT m.*, c.name as category_name 
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.id = ?
    `, [req.params.id]);
    
    if (menuItems.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    const menuItem = menuItems[0];
    
    // Get sizes
    const [sizes] = await pool.query(`
      SELECT s.name 
      FROM menu_item_sizes mis
      JOIN sizes s ON mis.size_id = s.id
      WHERE mis.menu_item_id = ?
    `, [menuItem.id]);
    
    menuItem.availableSizes = sizes.map(s => s.name);
    
    // Get toppings
    const [toppings] = await pool.query(`
      SELECT t.name 
      FROM menu_item_toppings mit
      JOIN toppings t ON mit.topping_id = t.id
      WHERE mit.menu_item_id = ?
    `, [menuItem.id]);
    
    menuItem.availableToppings = toppings.map(t => t.name);
    
    res.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ message: 'Failed to fetch menu item' });
  }
});

// Create a new menu item
app.post('/api/menu-items', upload.single('image'), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    let imageFilename = null;
    if (req.file) {
      // Store the relative path that will be used in frontend
      imageFilename = `/uploads/${req.file.filename}`;
      console.log(`Uploaded image: ${req.file.filename} to ${UPLOAD_DIRECTORY}`);
    }
    
    const { name, description, price, category, popular, availableSizes, availableToppings } = req.body;
    
    // Get or create category
    let categoryId = null;
    if (category) {
      const [categories] = await connection.query(
        'SELECT id FROM categories WHERE name = ?',
        [category]
      );
      
      if (categories.length > 0) {
        categoryId = categories[0].id;
      } else {
        const [result] = await connection.query(
          'INSERT INTO categories (name) VALUES (?)',
          [category]
        );
        categoryId = result.insertId;
      }
    }
    
    // Insert menu item
    const [result] = await connection.query(
      'INSERT INTO menu_items (name, description, price, category_id, image, popular) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, categoryId, imageFilename, popular || false]
    );
    
    const menuItemId = result.insertId;
    
    // Add sizes if available
    if (availableSizes && availableSizes.length > 0) {
      const sizes = typeof availableSizes === 'string' ? JSON.parse(availableSizes) : availableSizes;
      
      for (const sizeName of sizes) {
        // Get size id
        const [sizeRows] = await connection.query(
          'SELECT id FROM sizes WHERE name = ?',
          [sizeName]
        );
        
        if (sizeRows.length > 0) {
          await connection.query(
            'INSERT INTO menu_item_sizes (menu_item_id, size_id) VALUES (?, ?)',
            [menuItemId, sizeRows[0].id]
          );
        }
      }
    }
    
    // Add toppings if available
    if (availableToppings && availableToppings.length > 0) {
      const toppings = typeof availableToppings === 'string' ? JSON.parse(availableToppings) : availableToppings;
      
      for (const toppingName of toppings) {
        // Get topping id
        const [toppingRows] = await connection.query(
          'SELECT id FROM toppings WHERE name = ?',
          [toppingName]
        );
        
        if (toppingRows.length > 0) {
          await connection.query(
            'INSERT INTO menu_item_toppings (menu_item_id, topping_id) VALUES (?, ?)',
            [menuItemId, toppingRows[0].id]
          );
        }
      }
    }
    
    await connection.commit();
    
    res.status(201).json({
      id: menuItemId,
      name,
      description,
      price,
      category,
      image: imageFilename,
      popular: Boolean(popular),
      availableSizes: availableSizes ? (typeof availableSizes === 'string' ? JSON.parse(availableSizes) : availableSizes) : [],
      availableToppings: availableToppings ? (typeof availableToppings === 'string' ? JSON.parse(availableToppings) : availableToppings) : []
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Failed to create menu item' });
  } finally {
    connection.release();
  }
});

// Update menu item
app.put('/api/menu-items/:id', upload.single('image'), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { name, description, price, category, popular, availableSizes, availableToppings } = req.body;
    const menuItemId = req.params.id;
    
    // Check if menu item exists
    const [menuItems] = await connection.query(
      'SELECT image FROM menu_items WHERE id = ?',
      [menuItemId]
    );
    
    if (menuItems.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    let imageFilename = menuItems[0].image;
    if (req.file) {
      // Delete old image if exists and not a placeholder
      if (imageFilename && !imageFilename.includes('placeholder')) {
        const oldImagePath = path.join(__dirname, imageFilename);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log(`Deleted old image: ${oldImagePath}`);
        }
      }
      
      // Store the relative path that will be used in frontend
      imageFilename = `/uploads/${req.file.filename}`;
      console.log(`Updated with new image: ${req.file.filename} to ${UPLOAD_DIRECTORY}`);
    }
    
    // Get or create category
    let categoryId = null;
    if (category) {
      const [categories] = await connection.query(
        'SELECT id FROM categories WHERE name = ?',
        [category]
      );
      
      if (categories.length > 0) {
        categoryId = categories[0].id;
      } else {
        const [result] = await connection.query(
          'INSERT INTO categories (name) VALUES (?)',
          [category]
        );
        categoryId = result.insertId;
      }
    }
    
    // Update menu item
    await connection.query(
      'UPDATE menu_items SET name = ?, description = ?, price = ?, category_id = ?, image = ?, popular = ?, updated_at = NOW() WHERE id = ?',
      [name, description, price, categoryId, imageFilename, popular || false, menuItemId]
    );
    
    // Update sizes - first remove existing relations
    await connection.query(
      'DELETE FROM menu_item_sizes WHERE menu_item_id = ?',
      [menuItemId]
    );
    
    // Add sizes if available
    if (availableSizes && availableSizes.length > 0) {
      const sizes = typeof availableSizes === 'string' ? JSON.parse(availableSizes) : availableSizes;
      
      for (const sizeName of sizes) {
        // Get size id
        const [sizeRows] = await connection.query(
          'SELECT id FROM sizes WHERE name = ?',
          [sizeName]
        );
        
        if (sizeRows.length > 0) {
          await connection.query(
            'INSERT INTO menu_item_sizes (menu_item_id, size_id) VALUES (?, ?)',
            [menuItemId, sizeRows[0].id]
          );
        }
      }
    }
    
    // Update toppings - first remove existing relations
    await connection.query(
      'DELETE FROM menu_item_toppings WHERE menu_item_id = ?',
      [menuItemId]
    );
    
    // Add toppings if available
    if (availableToppings && availableToppings.length > 0) {
      const toppings = typeof availableToppings === 'string' ? JSON.parse(availableToppings) : availableToppings;
      
      for (const toppingName of toppings) {
        // Get topping id
        const [toppingRows] = await connection.query(
          'SELECT id FROM toppings WHERE name = ?',
          [toppingName]
        );
        
        if (toppingRows.length > 0) {
          await connection.query(
            'INSERT INTO menu_item_toppings (menu_item_id, topping_id) VALUES (?, ?)',
            [menuItemId, toppingRows[0].id]
          );
        }
      }
    }
    
    await connection.commit();
    
    res.json({
      id: parseInt(menuItemId, 10),
      name,
      description,
      price,
      category,
      image: imageFilename,
      popular: Boolean(popular),
      availableSizes: availableSizes ? (typeof availableSizes === 'string' ? JSON.parse(availableSizes) : availableSizes) : [],
      availableToppings: availableToppings ? (typeof availableToppings === 'string' ? JSON.parse(availableToppings) : availableToppings) : []
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Failed to update menu item' });
  } finally {
    connection.release();
  }
});

// Delete menu item
app.delete('/api/menu-items/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const menuItemId = req.params.id;
    
    // Get menu item to check image path
    const [menuItems] = await connection.query(
      'SELECT image FROM menu_items WHERE id = ?',
      [menuItemId]
    );
    
    if (menuItems.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Delete image file if exists and not a placeholder
    const imageFilename = menuItems[0].image;
    if (imageFilename && !imageFilename.includes('placeholder')) {
      const imagePath = path.join(__dirname, imageFilename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
      }
    }
    
    // Delete related records
    await connection.query('DELETE FROM menu_item_sizes WHERE menu_item_id = ?', [menuItemId]);
    await connection.query('DELETE FROM menu_item_toppings WHERE menu_item_id = ?', [menuItemId]);
    await connection.query('DELETE FROM offer_menu_items WHERE menu_item_id = ?', [menuItemId]);
    
    // Delete the menu item
    await connection.query('DELETE FROM menu_items WHERE id = ?', [menuItemId]);
    
    await connection.commit();
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Failed to delete menu item' });
  } finally {
    connection.release();
  }
});

// Offers/Promotions with image upload
app.post('/api/offers', upload.single('image'), async (req, res) => {
  try {
    let imageFilename = null;
    if (req.file) {
      // Store the relative path that will be used in frontend
      imageFilename = `/uploads/${req.file.filename}`;
      console.log(`Uploaded offer image: ${req.file.filename} to ${UPLOAD_DIRECTORY}`);
    }
    
    const { title, description, discount, menuItemIds, startDate, endDate, isActive } = req.body;
    
    // Process the database insert for offer
    // ... your existing offer creation logic
    
    res.status(201).json({
      id: 1, // Replace with actual ID
      title,
      description,
      imageUrl: imageFilename,
      discount: parseFloat(discount) || 0,
      menuItemIds: menuItemIds ? JSON.parse(menuItemIds) : [],
      startDate,
      endDate,
      isActive: isActive === 'true'
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ message: 'Failed to create offer' });
  }
});

app.put('/api/offers/:id', upload.single('image'), async (req, res) => {
  try {
    const offerId = req.params.id;
    
    // Check if offer exists and get current image
    // Similar to the menu item update logic
    
    let imageFilename = null; // This should be set to current image from DB
    if (req.file) {
      // Delete old image logic here
      
      // Store the relative path that will be used in frontend
      imageFilename = `/uploads/${req.file.filename}`;
      console.log(`Updated offer with new image: ${req.file.filename} to ${UPLOAD_DIRECTORY}`);
    }
    
    // Update offer in database
    // ... your existing offer update logic
    
    res.json({
      id: parseInt(offerId, 10),
      // Other offer data
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ message: 'Failed to update offer' });
  }
});

// Offers/Promotions
app.get('/api/offers', async (req, res) => {
  try {
    const query = `
      SELECT o.*, 
             GROUP_CONCAT(omi.menu_item_id) as menu_item_ids
      FROM offers o
      LEFT JOIN offer_menu_items omi ON o.id = omi.offer_id
      GROUP BY o.id
    `;
    
    const [offers] = await pool.query(query);
    
    // Convert menu_item_ids string to array of numbers
    offers.forEach(offer => {
      if (offer.menu_item_ids) {
        offer.menuItemIds = offer.menu_item_ids.split(',').map(id => parseInt(id, 10));
      } else {
        offer.menuItemIds = [];
      }
      delete offer.menu_item_ids;
    });
    
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Failed to fetch offers' });
  }
});

// Orders
app.get('/api/orders', async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, c.name as customerName, c.phone as customerPhone, c.address as customerAddress
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);
    
    // For each order, get its items
    for (const order of orders) {
      // Get order items
      const [items] = await pool.query(`
        SELECT oi.*, GROUP_CONCAT(oit.topping_name) as toppings
        FROM order_items oi
        LEFT JOIN order_item_toppings oit ON oi.id = oit.order_item_id
        WHERE oi.order_id = ?
        GROUP BY oi.id
      `, [order.id]);
      
      // Process items to match the expected format
      order.orderItems = items.map(item => ({
        menuItemId: item.menu_item_id,
        name: item.menu_item_name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        size: item.size,
        toppings: item.toppings ? item.toppings.split(',') : []
      }));
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const { customerName, customerPhone, customerAddress, orderType, orderItems, totalAmount, specialInstructions } = req.body;
    
    // Create or update customer
    let customerId;
    const [existingCustomers] = await connection.query(
      'SELECT id FROM customers WHERE phone = ?',
      [customerPhone]
    );
    
    if (existingCustomers.length > 0) {
      customerId = existingCustomers[0].id;
      // Update customer info
      await connection.query(
        'UPDATE customers SET name = ?, address = ? WHERE id = ?',
        [customerName, customerAddress || null, customerId]
      );
    } else {
      // Create new customer
      const [customerResult] = await connection.query(
        'INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)',
        [customerName, customerPhone, customerAddress || null]
      );
      customerId = customerResult.insertId;
    }
    
    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_id, order_type, total_amount, special_instructions) VALUES (?, ?, ?, ?)',
      [customerId, orderType, totalAmount, specialInstructions || null]
    );
    
    const orderId = orderResult.insertId;
    
    // Add order items
    for (const item of orderItems) {
      const [itemResult] = await connection.query(
        'INSERT INTO order_items (order_id, menu_item_id, menu_item_name, price, quantity, size) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.menuItemId, item.name, item.price, item.quantity, item.size || null]
      );
      
      const orderItemId = itemResult.insertId;
      
      // Add toppings if any
      if (item.toppings && item.toppings.length > 0) {
        for (const topping of item.toppings) {
          await connection.query(
            'INSERT INTO order_item_toppings (order_item_id, topping_name) VALUES (?, ?)',
            [orderItemId, topping]
          );
        }
      }
    }
    
    await connection.commit();
    
    res.status(201).json({
      id: orderId,
      customerName,
      customerPhone,
      customerAddress,
      orderType,
      orderItems,
      totalAmount,
      specialInstructions,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order' });
  } finally {
    connection.release();
  }
});

// Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    // Validate status value
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Update order status
    const [result] = await pool.query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, orderId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ id: parseInt(orderId, 10), status });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const [feedback] = await pool.query(
      'SELECT * FROM feedback ORDER BY created_at DESC'
    );
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
});

// Submit feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO feedback (name, email, rating, message) VALUES (?, ?, ?, ?)',
      [name, email, rating, message]
    );
    
    res.status(201).json({
      id: result.insertId,
      name,
      email,
      rating,
      message,
      isPublished: false,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

// Update feedback publication status
app.patch('/api/feedback/:id/publish', async (req, res) => {
  try {
    const { isPublished } = req.body;
    const feedbackId = req.params.id;
    
    const [result] = await pool.query(
      'UPDATE feedback SET is_published = ? WHERE id = ?',
      [isPublished, feedbackId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.json({
      id: parseInt(feedbackId, 10),
      isPublished
    });
  } catch (error) {
    console.error('Error updating feedback publication:', error);
    res.status(500).json({ message: 'Failed to update feedback' });
  }
});

// Contact Messages
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );
    
    res.status(201).json({
      id: result.insertId,
      message: 'Contact message sent successfully'
    });
  } catch (error) {
    console.error('Error sending contact message:', error);
    res.status(500).json({ message: 'Failed to send contact message' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log(`Serving uploads from: ${path.join(__dirname, 'uploads')}`);

// API route to get the upload directory path
app.get('/api/upload-path', (req, res) => {
  res.json({ 
    path: UPLOAD_DIRECTORY,
    url: '/uploads'
  });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload directory: ${UPLOAD_DIRECTORY}`);
});
