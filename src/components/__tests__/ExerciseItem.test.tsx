
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExerciseItem } from '../schedule/workout-tracking/ExerciseItem';
import { WorkoutExercise } from '@/hooks/useWorkoutTracking';

const mockExercise: WorkoutExercise = {
  name: 'Push-ups',
  sets: 3,
  reps: '10',
  completed: false
};

describe('ExerciseItem', () => {
  const mockOnToggleCompletion = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders exercise information correctly', () => {
    render(
      <ExerciseItem
        exercise={mockExercise}
        index={0}
        onToggleCompletion={mockOnToggleCompletion}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Push-ups - 3 series × 10')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('shows completed state correctly', () => {
    const completedExercise = { ...mockExercise, completed: true };
    
    render(
      <ExerciseItem
        exercise={completedExercise}
        index={0}
        onToggleCompletion={mockOnToggleCompletion}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByText('Push-ups - 3 series × 10')).toHaveClass('line-through');
  });

  it('calls onToggleCompletion when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ExerciseItem
        exercise={mockExercise}
        index={0}
        onToggleCompletion={mockOnToggleCompletion}
        onRemove={mockOnRemove}
      />
    );

    await user.click(screen.getByRole('checkbox'));
    expect(mockOnToggleCompletion).toHaveBeenCalledWith(0);
  });

  it('calls onRemove when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ExerciseItem
        exercise={mockExercise}
        index={0}
        onToggleCompletion={mockOnToggleCompletion}
        onRemove={mockOnRemove}
      />
    );

    await user.click(screen.getByRole('button'));
    expect(mockOnRemove).toHaveBeenCalledWith(0);
  });

  it('has proper accessibility attributes', () => {
    render(
      <ExerciseItem
        exercise={mockExercise}
        index={0}
        onToggleCompletion={mockOnToggleCompletion}
        onRemove={mockOnRemove}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByLabelText('Push-ups - 3 series × 10');
    
    expect(checkbox).toHaveAttribute('id', 'exercise-0');
    expect(label).toBeInTheDocument();
  });
});
