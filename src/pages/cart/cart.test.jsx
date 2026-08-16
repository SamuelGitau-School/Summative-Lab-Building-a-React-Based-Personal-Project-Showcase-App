import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cart from './Cart';
import { useCart } from '../../context/CartContext';

vi.mock('../../context/CartContext', () => ({
  useCart: vi.fn(),
}));

function renderCart() {
  render(
    <MemoryRouter>
      <Cart />
    </MemoryRouter>
  );
}

describe('Cart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when the cart is empty', () => {
    beforeEach(() => {
      useCart.mockReturnValue({
        items: [],
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        clearCart: vi.fn(),
        total: 0,
      });
    });

    it('shows the empty state message', () => {
      renderCart();
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(
        screen.getByText("Add something you like and it'll show up here.")
      ).toBeInTheDocument();
    });

    it('renders a "Browse products" link to /dashboard', () => {
      renderCart();
      const link = screen.getByRole('link', { name: 'Browse products' });
      expect(link).toHaveAttribute('href', '/dashboard');
    });

    it('does not render the cart summary or any item rows', () => {
      renderCart();
      expect(screen.queryByText(/Total:/)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Checkout' })).not.toBeInTheDocument();
    });
  });

  describe('when the cart has items', () => {
    const items = [
      { id: 1, name: 'Wireless Mouse', price: 25, quantity: 2 },
      { id: 2, name: 'Mechanical Keyboard', price: 75.5, quantity: 1 },
    ];

    let removeItem;
    let updateQuantity;
    let clearCart;

    beforeEach(() => {
      removeItem = vi.fn();
      updateQuantity = vi.fn();
      clearCart = vi.fn();

      useCart.mockReturnValue({
        items,
        removeItem,
        updateQuantity,
        clearCart,
        total: 125.5,
      });
    });

    it('renders the page heading', () => {
      renderCart();
      expect(screen.getByRole('heading', { level: 5, name: 'Your cart' })).toBeInTheDocument();
    });

    it('renders a row for every item with its name and unit price', () => {
      renderCart();
      expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
      expect(screen.getByText('$25.00 each')).toBeInTheDocument();
      expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument();
      expect(screen.getByText('$75.50 each')).toBeInTheDocument();
    });

    it('shows each item\'s current quantity in its input', () => {
      renderCart();
      const quantityInputs = screen.getAllByRole('spinbutton');
      expect(quantityInputs).toHaveLength(2);
      expect(quantityInputs[0]).toHaveValue(2);
      expect(quantityInputs[1]).toHaveValue(1);
    });

    it('calls updateQuantity with the item id and new value when a quantity input changes', () => {
      renderCart();
      const quantityInputs = screen.getAllByRole('spinbutton');
      fireEvent.change(quantityInputs[0], { target: { value: '5' } });
      expect(updateQuantity).toHaveBeenCalledWith(1, 5);
    });

    it('calls removeItem with the correct id when a delete button is clicked', () => {
      renderCart();
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      fireEvent.click(deleteButtons[1]);
      expect(removeItem).toHaveBeenCalledWith(2);
    });

    it('displays the formatted total', () => {
      renderCart();
      expect(screen.getByText('Total: $125.50')).toBeInTheDocument();
    });

    it('calls clearCart when "Clear" is clicked', () => {
      renderCart();
      fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
      expect(clearCart).toHaveBeenCalledTimes(1);
    });

    it('renders a "Checkout" button', () => {
      renderCart();
      expect(screen.getByRole('button', { name: 'Checkout' })).toBeInTheDocument();
    });
  });
});