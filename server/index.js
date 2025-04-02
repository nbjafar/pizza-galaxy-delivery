
// Add this after the PUT /api/offers/:id endpoint
app.delete('/api/offers/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const offerId = req.params.id;
    
    // Check if offer exists and get image path
    const [offers] = await connection.query(
      'SELECT image_url FROM offers WHERE id = ?',
      [offerId]
    );
    
    if (offers.length === 0) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    // Delete image file if it exists and not a placeholder
    const imageFilename = offers[0].image_url;
    if (imageFilename && !imageFilename.includes('placeholder') && imageFilename.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, imageFilename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted offer image file: ${imagePath}`);
      }
    }
    
    // Delete related records
    await connection.query('DELETE FROM offer_menu_items WHERE offer_id = ?', [offerId]);
    
    // Delete the offer
    await connection.query('DELETE FROM offers WHERE id = ?', [offerId]);
    
    await connection.commit();
    
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting offer:', error);
    res.status(500).json({ message: 'Failed to delete offer', error: error.message });
  } finally {
    connection.release();
  }
});
