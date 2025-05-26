
import { render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AddExerciseDialog } from '../schedule/workout-tracking/AddExerciseDialog';

describe('AddExerciseDialog', () => {
  const mockOnAddExercise = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens dialog when trigger button is clicked', async () => {
    const user = userEvent.setup();
    render(<AddExerciseDialog onAddExercise={mockOnAddExercise} />);
    
    await user.click(screen.getByText('Añadir Ejercicio'));
    expect(screen.getByText('Añadir Nuevo Ejercicio')).toBeInTheDocument();
  });

  it('adds exercise with correct data', async () => {
    const user = userEvent.setup();
    render(<AddExerciseDialog onAddExercise={mockOnAddExercise} />);
    
    // Open dialog
    await user.click(screen.getByText('Añadir Ejercicio'));
    
    // Fill form
    await user.type(screen.getByLabelText('Nombre del Ejercicio'), 'Squats');
    await user.clear(screen.getByLabelText('Series'));
    await user.type(screen.getByLabelText('Series'), '4');
    await user.clear(screen.getByLabelText('Repeticiones'));
    await user.type(screen.getByLabelText('Repeticiones'), '12');
    
    // Submit
    await user.click(screen.getByRole('button', { name: 'Añadir Ejercicio' }));
    
    await waitFor(() => {
      expect(mockOnAddExercise).toHaveBeenCalledWith({
        name: 'Squats',
        sets: 4,
        reps: '12',
        completed: false
      });
    });
  });

  it('displays error message when provided', async () => {
    const user = userEvent.setup();
    render(<AddExerciseDialog onAddExercise={mockOnAddExercise} error="Test error" />);
    
    await user.click(screen.getByText('Añadir Ejercicio'));
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('resets form after adding exercise', async () => {
    const user = userEvent.setup();
    render(<AddExerciseDialog onAddExercise={mockOnAddExercise} />);
    
    await user.click(screen.getByText('Añadir Ejercicio'));
    
    const nameInput = screen.getByLabelText('Nombre del Ejercicio') as HTMLInputElement;
    await user.type(nameInput, 'Test Exercise');
    
    await user.click(screen.getByRole('button', { name: 'Añadir Ejercicio' }));
    
    await waitFor(() => {
      expect(nameInput.value).toBe('');
    });
  });
});
