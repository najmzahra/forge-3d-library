import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface CartItem {
  id: string;
  user_id: string;
  project_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    title: string;
    price: number;
    is_free: boolean;
    preview_images: string[];
    profiles?: {
      username?: string;
      full_name?: string;
    };
  };
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          project:projects (
            id,
            title,
            price,
            is_free,
            preview_images,
            profiles!creator_id (
              username,
              full_name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Cart error",
        description: "Failed to load cart items.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (projectId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add items to cart.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.project_id === projectId);
      
      if (existingItem) {
        toast({
          title: "Already in cart",
          description: "This item is already in your cart.",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          project_id: projectId,
          quantity: 1
        });

      if (error) throw error;

      toast({
        title: "Added to cart",
        description: "Item added to your cart successfully.",
      });

      fetchCartItems(); // Refresh cart
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Cart error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      toast({
        title: "Removed from cart",
        description: "Item removed from your cart.",
      });

      fetchCartItems(); // Refresh cart
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Cart error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(cartItemId);
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;

      fetchCartItems(); // Refresh cart
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: "Cart error",
        description: "Failed to update item quantity.",
        variant: "destructive",
      });
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setCartItems([]);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Cart error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
      return false;
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.project?.is_free ? 0 : (item.project?.price || 0);
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  return {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    fetchCartItems,
  };
};