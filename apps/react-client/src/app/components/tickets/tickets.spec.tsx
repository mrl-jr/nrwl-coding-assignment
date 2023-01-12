import useFetch from '../../hooks/useFetch';

import { act, render, screen } from '@testing-library/react';

import Tickets from './tickets';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
describe('Tickets', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.mock('react-router-dom', () => {
      return {
        useHref: jest.fn(),
      };
    });
    jest.mock('react-router-dom', () => ({
      Link: (props: any) => {
        return <a {...props} href={props.to} />;
      },
    }));
    const mockData = [{ id: 1, completed: false }];
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    };
    fetch.mockResolvedValue(mockResponse);
  });

  it('should render successfully', () => {
    const { baseElement } = render(<Tickets />);
    expect(baseElement).toBeTruthy();
  });

  it('should fetch tickets', async () => {
    const { baseElement } = render(<Tickets />);
    expect(fetch).toHaveBeenCalledWith('/api/tickets', { method: 'GET' });
  });

  it('should fetch users', async () => {
    const { baseElement } = render(<Tickets />);
    expect(fetch).toHaveBeenCalledWith('/api/users', { method: 'GET' });
  });

  it('should render the ticket list if tickets are returned', async () => {
    const { rerender } = render(
      <BrowserRouter>
        <Tickets />
      </BrowserRouter>
    );
    expect(screen.queryByTestId('ticket-list')).toBeNull();
    await act(() => {
      rerender(
        <BrowserRouter>
          <Tickets />{' '}
        </BrowserRouter>
      );
    });
    expect(screen.getByTestId('ticket-list')).toBeTruthy();
  });

  it('should not render the ticket list if users are not returned', async () => {
    const mockData: any[] = [];
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    };
    fetch.mockResolvedValue(mockResponse);
    const { rerender } = render(
      <BrowserRouter>
        <Tickets />
      </BrowserRouter>
    );
    expect(screen.queryByTestId('ticket-list')).toBeNull();
    await act(() => {
      rerender(
        <BrowserRouter>
          <Tickets />{' '}
        </BrowserRouter>
      );
    });
    expect(screen.queryByTestId('ticket-list')).toBeNull();
  });
});
