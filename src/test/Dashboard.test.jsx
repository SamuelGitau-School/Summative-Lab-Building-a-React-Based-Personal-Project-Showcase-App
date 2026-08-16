import {render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Dashboard from '../components/Dashboard/Dashboard';
import { useAuth } from '../../assets/Auth/authContext';
import { useCart } from '../../assets/Cart/CartContext';
import { getProducts } from '../../assets/Product/Product';

jest.mock('../../assets/Navbar/Navbar', () => () => <div>Navbar</div>);
jest.mock('../Drop-Down/Catergories/Categories', () => () => <div>Categories</div>);
jest.mock('../Drop-Down/Profile/Profile', () => () => <div>Profile</div>);

jest.mock('../../assets/Auth/authContext', () => ({useAuth: jest.fn()}));
jest.mock('../../assets/Cart/CartContext', () => ({useAuth: jest.fn()}));
jest.mock('../../assets/Product/Product', () => ({getProducts: jest.fn()}));

const mockProducts = [
    {}
]