import { useCartStore } from '@/stores/cartStore';
import { Project } from '@/types';

/**
 * Enhanced cart hook with additional utilities
 */
export const useCart = () => {
  const {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemById,
    isInCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  const addToCart = (project: Project) => {
    if (!project.price || project.price <= 0) {
      // Free projects don't go to cart, download directly
      window.open(project.files[0]?.downloadUrl || '#', '_blank');
      return;
    }
    addItem(project);
  };

  const incrementQuantity = (projectId: string) => {
    const item = getItemById(projectId);
    if (item) {
      updateQuantity(projectId, item.quantity + 1);
    }
  };

  const decrementQuantity = (projectId: string) => {
    const item = getItemById(projectId);
    if (item) {
      updateQuantity(projectId, Math.max(0, item.quantity - 1));
    }
  };

  const getCartSummary = () => ({
    itemCount: getTotalItems(),
    totalPrice: getTotalPrice(),
    isEmpty: items.length === 0,
    hasItems: items.length > 0,
  });

  const getFormattedTotal = () => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(getTotalPrice());
  };

  const proceedToCheckout = () => {
    if (items.length === 0) {
      return false;
    }
    // TODO: Implement checkout logic
    console.log('Proceeding to checkout with items:', items);
    return true;
  };

  return {
    // State
    items,
    total,
    itemCount,
    
    // Actions
    addToCart,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    
    // Utilities
    getItemById,
    isInCart,
    getCartSummary,
    getFormattedTotal,
    proceedToCheckout,
    
    // Computed
    isEmpty: items.length === 0,
    hasItems: items.length > 0,
  };
};
