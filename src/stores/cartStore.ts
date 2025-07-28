import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Cart, Project } from '@/types';
import { toast } from 'sonner';

interface CartStore extends Cart {
  // Actions
  addItem: (project: Project) => void;
  removeItem: (projectId: string) => void;
  updateQuantity: (projectId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Computed
  getItemById: (projectId: string) => CartItem | undefined;
  isInCart: (projectId: string) => boolean;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      total: 0,
      itemCount: 0,

      // Actions
      addItem: (project: Project) => {
        const existingItem = get().items.find(item => item.projectId === project.id);
        
        if (existingItem) {
          // Update quantity if item already exists
          set((state) => ({
            items: state.items.map(item =>
              item.projectId === project.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }));
          toast.success('Quantity updated in cart');
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `cart_${project.id}_${Date.now()}`,
            projectId: project.id,
            title: project.title,
            thumbnail: project.thumbnail,
            price: project.price || 0,
            fileSize: project.fileSize,
            format: project.format,
            author: project.author,
            addedAt: new Date().toISOString(),
            quantity: 1,
          };

          set((state) => ({
            items: [...state.items, newItem],
          }));
          toast.success('Added to cart');
        }

        // Recalculate totals
        const { items } = get();
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        
        set({ total, itemCount });
      },

      removeItem: (projectId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.projectId !== projectId),
        }));

        // Recalculate totals
        const { items } = get();
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        
        set({ total, itemCount });
        toast.success('Removed from cart');
      },

      updateQuantity: (projectId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(projectId);
          return;
        }

        set((state) => ({
          items: state.items.map(item =>
            item.projectId === projectId
              ? { ...item, quantity }
              : item
          ),
        }));

        // Recalculate totals
        const { items } = get();
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        
        set({ total, itemCount });
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
          itemCount: 0,
        });
        toast.success('Cart cleared');
      },

      // Computed getters
      getItemById: (projectId: string) =>
        get().items.find(item => item.projectId === projectId),

      isInCart: (projectId: string) =>
        get().items.some(item => item.projectId === projectId),

      getTotalItems: () => get().itemCount,

      getTotalPrice: () => get().total,
    }),
    {
      name: 'forge3d-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
