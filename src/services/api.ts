
// Add this function to the Offers section
export const deleteOffer = async (id: number): Promise<void> => {
  try {
    await api.delete(`/offers/${id}`);
    toast.success('Offer deleted successfully');
  } catch (error) {
    console.error(`Error deleting offer ${id}:`, error);
    toast.error('Failed to delete offer');
    throw error;
  }
};
