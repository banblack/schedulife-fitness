
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AddExerciseDialog } from '../schedule/workout-tracking/AddExerciseDialog';

describe('AddExerciseDialog', () => {
  const mockOnAddExercise = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens dialog when trigger button is clicked', () => {
    render(<AddExerciseDialog onAddExercise={mockOnAddExercise} />);
    
    fireEvent.click(screen.getByText('Añadir Ejercicio'));
    expect(screen.getByText('Añadir Nuevo Ejercicio')).toBeInTheDocument();
  });

  it('adds exercise with correct data', async () => {
    render(<AddExerciseDialog onAddExercise={mockOnAddExercise} />);
    
    // Open dialog
    fireEvent.click(screen.getByText('Añadir Ejercicio'));
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Nombre del Ejercicio'), {
      target: { value: 'Squats' }
    });
    fireEvent.change(screen.getByLabelText('Series'), {
      target: { value: '4' }
    });
    fireEvent.change(screen.getByLabelText('Repeticiones'), {
      target: { value: '12' }
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Añadir Ejercicio' }));
    
    await waitFor(() => {
      expect(mockOnAddExercise).toHaveBeenCalledWith({
        name: 'Squats',
        sets: 4,
        reps: '12',
        completed: false
      });
    });
  });

  it('displays error message when provided', () => {
    render(<AddExerciseDialog onAddExercise={mockOnAddExercise} error="Test error" />);
    
    fireEvent.click(screen.getByText('Añadir Ejercicio'));
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('resets form after adding exercise', async () => {
    render(<AddExerciseDialog onAddExercise={mockOnAddExercise} />);
    
    fireEvent.click(screen.getByText('Añadir Ejercicio'));
    
    const nameInput = screen.getByLabelText('Nombre del Ejercicio') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: 'Test Exercise' } });
    
    fireEvent.click(screen.getByRole('button', { name: 'Añadir Ejercicio' }));
    
    await waitFor(() => {
      expect(nameInput.value).toBe('');
    });
  });
});
