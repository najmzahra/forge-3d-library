import React from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/stores/useCart';
import { useApp } from '@/hooks/stores/useApp';

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export const CartSidebar = ({ open, onClose }: CartSidebarProps) => {
  const {
    items,
    total,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
    getFormattedTotal,
  } = useCart();

  const { notifySuccess } = useApp();

  const handleCheckout = () => {
    // Simulate checkout process
    notifySuccess('Checkout initiated', 'Redirecting to payment...');
    clearCart();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            {itemCount > 0 && (
              <Badge variant="secondary">{itemCount}</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <p className="text-sm text-gray-400 mt-2">
              Browse our 3D models to add items
            </p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        by {item.author.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{item.fileSize}</span>
                        <span>•</span>
                        <span>{item.format}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Processing fee</span>
                <span>$2.99</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{getFormattedTotal()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                className="w-full"
                size="lg"
              >
                Checkout • {getFormattedTotal()}
              </Button>
              
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full"
                size="sm"
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
