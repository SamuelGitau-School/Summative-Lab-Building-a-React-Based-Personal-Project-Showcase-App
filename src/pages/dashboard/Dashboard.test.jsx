import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { getProducts } from '../../utils/product'
import { beforeEach, describe, expect, test } from 'vitest'


jest.mock('../../context/AuthContext')
jest.mock('../../context/CartContext')
jest.mock('../../utils/product')


jest.mock('../../components/layout/Navbar/Navbar', () => ({ onSearch }) => (
  <input placeholder="search" onChange={(e) => onSearch(e.target.value)} />
))
jest.mock('../../components/layout/dropdown/Categories', () => ({ onSelect }) => (
  <select onChange={(e) => onSelect(e.target.value)}>
    <option value="All">All</option>
    <option value="electronics">electronics</option>
  </select>
))

const mockProducts = [
  { id: 1, name: 'Headphones', price: 49.99, category: 'Audio', department: 'electronics' },
  { id: 2, name: 'T-Shirt', price: 19.99, category: 'Apparel', department: 'clothing' },
  { id: 3, name: 'Speaker', price: 89.99, category: 'Audio', department: 'electronics' },
]

const addItem = jest.fn()

function renderDashboard() {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  )
}

beforeEach(() => {
  jest.clearAllMocks()
  getProducts.mockResolvedValue(mockProducts)
  useAuth.mockReturnValue({ user: { firstName: 'John', role: 'customer' } })
  useCart.mockReturnValue({ addItem })
})

describe('Dashboard', () => {
    test('shows loading spinner then renders products', async () => {
        renderDashboard()
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())
        expect(screen.getByText('Welcome back, John')).toBeInTheDocument()
        expect(screen.getAllByText('Headphones').length).toBeGreaterThan(0)
    })

    //featured show
    test('only shows one card per category in the Featured strip', async () => {
        renderDashboard()
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())
        const featuredHeading = screen.getByText('Featured')
        const featuredSection = featuredHeading.closest('div')
        expect(within(featuredSection).getByText('Headphones')).toBeInTheDocument()
        expect(within(featuredSection).queryByText('Speaker')).not.toBeInTheDocument()
    })

    test('filters products by search input', async () => {
        renderDashboard()
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())
        fireEvent.change(screen.getByPlaceholderText('search'), { target: { value: 'shirt' } })
        expect(await screen.findByText('T-Shirt')).toBeInTheDocument()
        expect(screen.queryByText('Speaker')).not.toBeInTheDocument()
    })

    test('shows empty state when no products match', async () => {
        renderDashboard()
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())
        fireEvent.change(screen.getByPlaceholderText('search'), { target: { value: 'none' } })
        expect(await screen.findByText('No products match your search or category.')).toBeInTheDocument()
    })

    test('calls addItem when "Add to cart" is clicked', async () => {
        renderDashboard()
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())
        const [firstAddButton] = screen.getAllByText('Add to cart')
        fireEvent.click(firstAddButton)
        expect(addItem).toHaveBeenCalledTimes(1)
    })

    test('hides "Switch to Admin Dashboard" for non-admin users', async () => {
        renderDashboard()
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())
        expect(screen.queryByText('Switch to Admin Dashboard')).not.toBeInTheDocument()
    })

    test('shows "Switch to Admin Dashboard" for admin users', async () => {
        useAuth.mockReturnValue({ user: { firstName: 'John', role: 'admin' } })
        renderDashboard()
        await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())
        expect(screen.getByText('Switch to Admin Dashboard')).toBeInTheDocument()
    })
})