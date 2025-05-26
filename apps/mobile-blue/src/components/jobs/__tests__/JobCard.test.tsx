import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { JobCard } from '../JobCard';
import { Job, JobStatus } from '@kaabil/shared';
import { Language } from 'shared/src/types/user.types';

const mockJob: Job = {
  id: '1',
  title: 'Construction Worker',
  wage: 500,
  location: 'Sector 15, Gurgaon',
  distance: 2.5,
  requirements: ['Experience in construction', 'Physical fitness'],
  employerId: 'emp-123',
  status: JobStatus.ACTIVE,
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
  description: 'Looking for experienced construction worker'
};

describe('JobCard', () => {
  it('renders job details correctly', () => {
    render(<JobCard job={mockJob} />);
    
    expect(screen.getByText('Construction Worker')).toBeVisible();
    expect(screen.getByText('₹500/day')).toBeVisible();
    expect(screen.getByText('Sector 15, Gurgaon (2.5 km away)')).toBeVisible();
    expect(screen.getByText('Experience in construction')).toBeVisible();
    expect(screen.getByText('Physical fitness')).toBeVisible();
  });

  it('calls onApply when apply button is pressed', () => {
    const mockOnApply = jest.fn();
    render(<JobCard job={mockJob} onApply={mockOnApply} />);
    
    const applyButton = screen.getByText('Apply');
    fireEvent.press(applyButton);
    
    expect(mockOnApply).toHaveBeenCalledWith('1');
  });

  it('renders in different languages', () => {
    render(<JobCard job={mockJob} language={Language.HINDI} />);
    
    expect(screen.getByText('आवेदन करें')).toBeVisible();
    expect(screen.getByText('आवश्यकताएं:')).toBeVisible();
  });
}); 