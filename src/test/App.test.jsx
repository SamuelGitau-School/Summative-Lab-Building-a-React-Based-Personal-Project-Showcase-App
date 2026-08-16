import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import "@testing-library/jest-dom";
import App from '../App';
import { renderToReadableStream } from 'react-dom/server';

jest.mock('./components/landing page/landing', ()=> () => <div>Landing Page</div>);
jest.mock('./components/form page/login/login', ()=> () => <div>Login Page</div>);
jest.mock('./components/form page/sign up/sign-up', ()=> () => <div>Signup Page</div>);
jest.mock('./components/dashboard/dashboard', ()=> () => <div>Dashboard Page</div>);
jest.mock('./components/profile-page/profilepage', ()=> () => <div>Profile Page</div>);
jest.mock('./components/dashboard/adminpanel/adminpanel', ()=> () => <div>Admin Panel</div>);
jest.mock('./components/product-page/product-detail/product-detail', ()=> () => <div>Product Detail Page</div>);
jest.mock('./components/cart/cart', ()=> () => <div>Cart Page</div>);
jest.mock('./components/drop-down/wishlist/wishlist', ()=> () => <div>Wishlist Page</div>);
jest.mock('./assets/Route/Protectedroute', () => ({ children }) => <div>{children}</div>);

const rensderWithRoute = (route) => {
    return (<MemoryRouter initialEntries={[route]}>
        <App />
    </MemoryRouter>)
}

describe('App routing', () => {
    test('renders Landing page for / route', () => {
        render(rensderWithRoute('/'));
        expect(screen.getByText('Landing Page')).toBeInTheDocument();
    });

    test('renders Login page at "login"', () =>  {
        renderWithRoute('/login');
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    })

    test('renders Signup page at "signup"', () =>  {
        renderWithRoute('/signup');
        expect(screen.getByText('Signup Page')).toBeInTheDocument();
    });

    test('renders Dashboard at "Dashboard Page"', () => {
        renderWithRoute('/dashboard');
        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });

    test('renders Product detail at "product detail page:id"', () => {
        renderWithRoute('/products/123');
        expect(screen.getByText('Product Detail Page')).toBeInTheDocument();
    });

    test('renders Cart page at "Cart"', () => {
        renderWithRoute('/.cart');
        expect(screen.getByText('Cart Page')).toBeInTheDocument();
    });

    test('renders Wishlist page at "wishlist"', () => {
        renderWithRoute('./wishlist');
        expect(screen.getByText('Wishlist Page')).toBeInTheDocument();
    });

    test('renders Admin Panel at "admin"', () => {
        renderWithRoute('./admin');
        expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    });
});
