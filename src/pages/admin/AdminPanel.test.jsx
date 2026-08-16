import {render, screen,waitFor, fireEvent, within} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import { getAllUsers, deleteUser, updateUser } from '../../utils/user';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../utils/product';
import { beforeEach, describe, expect, test } from 'vitest';

jest.mock('../../utils/user')
jest.mock('../../utils/product')

const mockUsers = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'joedoe@example.com', role: 'customer' },
    { id: 2, firstName: 'Site', lastName: 'Admin', email: 'admin@example.com', role: 'admin' },
]
 
const mockProducts= [
    {id:1, name:'product', price:9.99}
]

function renderAdminPanel (){
    return render(
        <MemoryRouter>
            <AdminPanel/>
        </MemoryRouter>
    )
}

beforeEach (()=>{
    jest.clearAllMocks()
    getAllUsers.mockResolvedValue(mockUsers)
    getProducts.mockResolvedValue(mockProducts)
})

describe('AdminPanel',()=>{
    test('render heading and defaults to users tab', async()=>{
        renderAdminPanel()
        expect(screen.getByText('Admin Panel')).toBeInTheDocument()
        await waitFor(()=>expect(getAllUsers).toHaveBeenCalledTimes(1))
        expect(await screen.findByText('John Doe')).toBeInTheDocument()
    })

    test('show loading spinner before users resolve', async()=>{
        let resolveUsers
        getAllUsers.mockReturnValue(new Promise((res)=>{resolveUsers = res}))
        renderAdminPanel()
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
        resolveUsers(mockUsers)
        await waitFor(()=>expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())
    })

    test('show an error alert if loading users fails', async() => {
        getAllUsers.mockRejectedValue(new Error('Failed to load users'))
        renderAdminPanel()
        expect(await screen.findByText('Failed to load users')).toBeInTheDocument()
    })
 
    test('promotes a user when clicking Promote', async () => {
        updateUser.mockResolvedValue({ ...mockUsers[0], role: 'admin' })
        renderAdminPanel()
        const johnRow = (await screen.findByText('John Doe')).closest('li')
        fireEvent.click(within(johnRow).getByText('Promote'))
        await waitFor(() => expect(updateUser).toHaveBeenCalledWith(1, { role: 'admin' }))
    })
 
    test('deletes a user after confirmation', async () => {
        window.confirm = jest.fn(() => true)
        deleteUser.mockResolvedValue({})
        renderAdminPanel()
        const adminRow = (await screen.findByText('Site Admin')).closest('li')
        fireEvent.click(within(adminRow).getByText('Delete'))
        await waitFor(() => expect(deleteUser).toHaveBeenCalledWith(2))
        await waitFor(() => expect(screen.queryByText('Site Admin')).not.toBeInTheDocument())
    })
 
    test('does not delete a user if confirmation is cancelled', async () => {
        window.confirm = jest.fn(() => false)
        renderAdminPanel()
        const johnRow = (await screen.findByText('John Doe')).closest('li')
        fireEvent.click(within(johnRow).getByText('Delete'))
        expect(deleteUser).not.toHaveBeenCalled()
    })
 
    test('switches to Products tab and loads products', async () => {
        renderAdminPanel()
        await screen.findByText('John Doe')
        fireEvent.click(screen.getByRole('tab', { name: 'products' }))
        await waitFor(() => expect(getProducts).toHaveBeenCalledTimes(1))
        expect(await screen.findByText('product')).toBeInTheDocument()
        expect(screen.getByText('$9.99')).toBeInTheDocument()
    })
 
    test('adds a new product via the form', async () => {
        createProduct.mockResolvedValue({ id: 2, name: 'Gadget', price: 19.99 })
        renderAdminPanel()
        fireEvent.click(screen.getByRole('tab', { name: 'products' }))
        await screen.findByText('product')
        fireEvent.click(screen.getByText('Add Product'))
        fireEvent.change(screen.getByLabelText('Product name'), { target: { value: 'Gadget' } })
        fireEvent.change(screen.getByLabelText('Price'), { target: { value: '19.99' } })
        fireEvent.click(screen.getByRole('button', { name: 'Add' }))
        await waitFor(() => expect(createProduct).toHaveBeenCalledWith({ name: 'Gadget', price: 19.99 }))
        expect(await screen.findByText('Gadget')).toBeInTheDocument()
    })
})