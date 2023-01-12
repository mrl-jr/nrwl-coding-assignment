import useFetch from '../../hooks/useFetch';
import { act, render } from '@testing-library/react';
import TicketDetails from './ticket-details';
import Router, {
  BrowserRouter,
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom';
import * as reactRouterDom from 'react-router-dom';

global.fetch = jest.fn();

describe('TicketDetails', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.mock('react-router-dom', () => {
      return {
        useHref: jest.fn(),
      };
    });
    jest.mock('react-router', () => ({
      Link: (props: any) => {
        return <a {...props} href={props.to} />;
      },
    }));
    const mockData = [{ id: 1 }];
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    };

    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({
        id: '12',
      }),
    }));
    fetch.mockResolvedValue(mockResponse);
  });
  it('should render successfully', () => {
    const { baseElement } = render(<TicketDetails />);
    expect(baseElement).toBeTruthy();
  });

  it('should fetch tickets', async () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/ticket/1']}>
        <Routes>
          <Route path="/ticket/:id" element={<TicketDetails />} />
        </Routes>
      </MemoryRouter>
    );
    expect(fetch).toHaveBeenCalledWith('/api/tickets/1', { method: 'GET' });
  });

  it('should fetch users', async () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/ticket/1']}>
        <Routes>
          <Route path="/ticket/:id" element={<TicketDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await act(() => {
      rerender(
        <MemoryRouter initialEntries={['/ticket/1']}>
          <Routes>
            <Route path="/ticket/:id" element={<TicketDetails />} />
          </Routes>
        </MemoryRouter>
      );
    });
    expect(fetch).toHaveBeenCalledWith('/api/users', { method: 'GET' });
  });

  it('should update the status if the chip is clicked', async () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/ticket/1']}>
        <Routes>
          <Route path="/ticket/:id" element={<TicketDetails />} />
        </Routes>
      </MemoryRouter>
    );
    await act(() => {
      rerender(
        <MemoryRouter initialEntries={['/ticket/1']}>
          <Routes>
            <Route path="/ticket/:id" element={<TicketDetails />} />
          </Routes>
        </MemoryRouter>
      );
    });
    const chip = document.querySelector('.MuiChip-root');
    chip?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(fetch).toHaveBeenCalledWith('/api/tickets/1', { method: 'GET' });
    expect(fetch).toHaveBeenCalledWith('/api/users', { method: 'GET' });
    expect(fetch).toHaveBeenCalledWith('/api/tickets/1/complete', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});
