import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { JobCard } from '../JobCard';
import { Job, JobStatus } from '@kaabil/shared';

describe('JobCard Component', () => {
  const mockJob: Job = {
    id: 'job-123',
    title: 'Construction Worker',
    wage: 500,
    location: 'Sector 15, Gurgaon',
    distance: 2.5,
    requirements: ['Basic tools', 'Experience'],
    employerId: 'emp-456',
    status: JobStatus.ACTIVE,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    description: 'Construction work for residential building'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // RED: Write failing tests first
  it('should display job title prominently', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('Construction Worker')).toBeVisible();
  });

  it('should show wage in large, clear format', () => {
    render(<JobCard job={mockJob} />);
    const wageElement = screen.getByText('₹500/day');
    expect(wageElement).toBeVisible();
    expect(wageElement).toHaveStyle({
      fontSize: 24,
      fontWeight: 'bold'
    });
  });

  it('should display location with distance', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('Sector 15, Gurgaon (2.5 km)')).toBeVisible();
  });

  it('should show job requirements', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByText('• Basic tools')).toBeVisible();
    expect(screen.getByText('• Experience')).toBeVisible();
  });

  it('should have voice command button', () => {
    render(<JobCard job={mockJob} />);
    const voiceButton = screen.getByTestId('voice-command-button');
    expect(voiceButton).toBeVisible();
  });

  it('should have apply button', () => {
    render(<JobCard job={mockJob} />);
    const applyButton = screen.getByText('Apply');
    expect(applyButton).toBeVisible();
  });

  it('should call onApply when apply button is pressed', () => {
    const onApply = jest.fn();
    render(<JobCard job={mockJob} onApply={onApply} />);
    
    const applyButton = screen.getByText('Apply');
    fireEvent.press(applyButton);
    
    expect(onApply).toHaveBeenCalledWith('job-123');
  });

  it('should handle voice commands for application', () => {
    const onApply = jest.fn();
    render(<JobCard job={mockJob} onApply={onApply} />);
    
    const voiceButton = screen.getByTestId('voice-command-button');
    fireEvent.press(voiceButton);
    
    // Should show voice prompt
    expect(screen.getByText('Say "Apply" to apply for this job')).toBeVisible();
  });

  it('should have proper accessibility labels', () => {
    render(<JobCard job={mockJob} />);
    
    const applyButton = screen.getByLabelText('Apply for Construction Worker');
    const voiceButton = screen.getByLabelText('Voice apply for job');
    
    expect(applyButton).toBeVisible();
    expect(voiceButton).toBeVisible();
  });

  it('should display job card with proper test ID', () => {
    render(<JobCard job={mockJob} />);
    expect(screen.getByTestId('job-card')).toBeVisible();
  });

  it('should handle missing optional props gracefully', () => {
    render(<JobCard job={mockJob} />);
    
    const applyButton = screen.getByText('Apply');
    fireEvent.press(applyButton);
    
    // Should not crash when onApply is not provided
    expect(screen.getByTestId('job-card')).toBeVisible();
  });
}); 