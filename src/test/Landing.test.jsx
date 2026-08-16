import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from '../pages/landing/Landing';

function renderLanding() {
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );
}

describe('Landing', () => {
  it('renders the hero heading and subtitle', () => {
    renderLanding();
    expect(screen.getByRole('heading', { level: 1, name: 'Project showcase' })).toBeInTheDocument();
    expect(
      screen.getByText('Browse products, build a cart, and manage your account — all in one place.')
    ).toBeInTheDocument();
  });

  it('renders a "Get started" link pointing to /signup', () => {
    renderLanding();
    const link = screen.getByRole('link', { name: 'Get started' });
    expect(link).toHaveAttribute('href', '/signup');
  });

  it('renders a "Log in" link pointing to /login', () => {
    renderLanding();
    const link = screen.getByRole('link', { name: 'Log in' });
    expect(link).toHaveAttribute('href', '/login');
  });

  it('renders all three feature cards with their titles and descriptions', () => {
    renderLanding();

    const expectedFeatures = [
      {
        title: 'Browse products',
        description: 'Explore the full catalog, filter by category, and search for exactly what you need.',
      },
      {
        title: 'Build your cart',
        description: "Add items as you go and check out whenever you're ready.",
      },
      {
        title: 'Save favorites',
        description: 'Keep a wishlist of things you want to come back to later.',
      },
    ];

    expectedFeatures.forEach(({ title, description }) => {
      expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument();
      expect(screen.getByText(description)).toBeInTheDocument();
    });
  });

  it('renders exactly three feature cards', () => {
    renderLanding();
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(3);
  });
});