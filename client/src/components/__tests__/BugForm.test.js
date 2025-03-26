import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugForm from '../BugForm';

describe('BugForm Component', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders form fields correctly', () => {
    render(<BugForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    render(<BugForm onSubmit={mockSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const statusSelect = screen.getByLabelText(/status/i);
    const prioritySelect = screen.getByLabelText(/priority/i);
    const submitButton = screen.getByRole('button', { name: /create bug/i });

    await userEvent.type(titleInput, 'Test Bug');
    await userEvent.type(descriptionInput, 'This is a test bug');
    await userEvent.selectOptions(statusSelect, 'open');
    await userEvent.selectOptions(prioritySelect, 'medium');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        title: 'Test Bug',
        description: 'This is a test bug',
        status: 'open',
        priority: 'medium'
      });
    });
  });

  it('handles form reset when editing', () => {
    const initialData = {
      title: 'Test Bug',
      description: 'This is a test bug',
      status: 'open',
      priority: 'medium'
    };

    render(<BugForm onSubmit={mockSubmit} initialData={initialData} />);

    const titleInput = screen.getByLabelText(/title/i);
    const resetButton = screen.getByRole('button', { name: /reset/i });

    fireEvent.change(titleInput, { target: { value: 'Changed Title' } });
    fireEvent.click(resetButton);

    expect(titleInput).toHaveValue('Test Bug');
  });

  it('displays validation errors', async () => {
    render(<BugForm onSubmit={mockSubmit} />);

    const submitButton = screen.getByRole('button', { name: /create bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });
});
