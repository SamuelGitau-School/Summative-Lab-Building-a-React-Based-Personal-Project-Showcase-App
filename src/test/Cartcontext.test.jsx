import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const shirt = { id: 1, name: 'Linen shirt', price: 2500 };
const shoes = { id: 2, name: 'Runners', price: 7800 };

const setupCart = () => renderHook(() => useCart(), { wrapper });

const readStorage = () => JSON.parse(localStorage.getItem('cart'));

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('useCart guard', () => {
    it('throws when used outside a CartProvider', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => renderHook(() => useCart())).toThrow(
        /must be used within a CartProvider/i
      );

      spy.mockRestore();
    });
  });

  describe('initial state', () => {
    it('starts empty when localStorage has no cart', () => {
      const { result } = setupCart();

      expect(result.current.items).toEqual([]);
      expect(result.current.total).toBe(0);
      expect(result.current.count).toBe(0);
    });

    it('rehydrates a saved cart from localStorage', () => {
      localStorage.setItem(
        'cart',
        JSON.stringify([{ ...shirt, quantity: 3 }])
      );

      const { result } = setupCart();

      expect(result.current.items).toHaveLength(1);
      expect(result.current.count).toBe(3);
      expect(result.current.total).toBe(7500);
    });

    it('survives a corrupted cart entry without crashing', () => {
      // Requires the try/catch fix in the useState initialiser.
      localStorage.setItem('cart', 'not-json{{{');

      expect(() => setupCart()).not.toThrow();
    });
  });

  describe('addItem', () => {
    it('adds a new product with quantity 1', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shirt));

      expect(result.current.items).toEqual([{ ...shirt, quantity: 1 }]);
      expect(result.current.count).toBe(1);
    });

    it('increments quantity instead of duplicating an existing product', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shirt));
      act(() => result.current.addItem(shirt));
      act(() => result.current.addItem(shirt));

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(3);
    });

    it('keeps distinct products as separate lines', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shirt));
      act(() => result.current.addItem(shoes));

      expect(result.current.items).toHaveLength(2);
      expect(result.current.count).toBe(2);
    });

    it('does not mutate the product object passed in', () => {
      const { result } = setupCart();
      const original = { ...shirt };

      act(() => result.current.addItem(shirt));

      expect(shirt).toEqual(original);
      expect(shirt).not.toHaveProperty('quantity');
    });
  });

  describe('removeItem', () => {
    it('removes the matching product', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shirt));
      act(() => result.current.addItem(shoes));
      act(() => result.current.removeItem(shirt.id));

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe(shoes.id);
    });

    it('ignores an id that is not in the cart', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shirt));
      act(() => result.current.removeItem(999));

      expect(result.current.items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('sets an explicit quantity', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shirt));
      act(() => result.current.updateQuantity(shirt.id, 5));

      expect(result.current.items[0].quantity).toBe(5);
      expect(result.current.count).toBe(5);
    });

    it('removes the item when quantity drops to zero', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shirt));
      act(() => result.current.updateQuantity(shirt.id, 0));

      expect(result.current.items).toEqual([]);
    });

    it('removes the item on a negative quantity', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shirt));
      act(() => result.current.updateQuantity(shirt.id, -3));

      expect(result.current.items).toEqual([]);
    });

    it('leaves other lines untouched', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shirt));
      act(() => result.current.addItem(shoes));
      act(() => result.current.updateQuantity(shirt.id, 4));

      const shoesLine = result.current.items.find((i) => i.id === shoes.id);
      expect(shoesLine.quantity).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('empties the cart and resets the derived values', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shirt));
      act(() => result.current.addItem(shoes));
      act(() => result.current.clearCart());

      expect(result.current.items).toEqual([]);
      expect(result.current.total).toBe(0);
      expect(result.current.count).toBe(0);
    });
  });

  describe('derived totals', () => {
    it('multiplies price by quantity across lines', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shirt));
      act(() => result.current.addItem(shirt));
      act(() => result.current.addItem(shoes));

      // (2500 x 2) + (7800 x 1)
      expect(result.current.total).toBe(12800);
      expect(result.current.count).toBe(3);
    });

    it('recomputes after a quantity change', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shoes));
      expect(result.current.total).toBe(7800);

      act(() => result.current.updateQuantity(shoes.id, 3));
      expect(result.current.total).toBe(23400);
    });
  });

  describe('persistence', () => {
    it('writes the cart to localStorage after a change', () => {
      const { result } = setupCart();

      act(() => result.current.addItem(shirt));

      expect(readStorage()).toEqual([{ ...shirt, quantity: 1 }]);
    });

    it('restores the same cart in a fresh provider', () => {
      const first = setupCart();
      act(() => first.result.current.addItem(shirt));
      act(() => first.result.current.updateQuantity(shirt.id, 2));
      first.unmount();

      const { result } = setupCart();

      expect(result.current.items).toEqual([{ ...shirt, quantity: 2 }]);
      expect(result.current.total).toBe(5000);
    });
  });
});