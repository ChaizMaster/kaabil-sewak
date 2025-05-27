import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { PhotoUpload } from '../PhotoUpload';
import { Language } from 'shared/src/types/user.types';
import * as ImagePicker from 'expo-image-picker';

// Mock the useTranslation hook
jest.mock('shared/src/hooks/useTranslation', () => ({
  useTranslation: (lang: Language) => ({
    t: {
      photo: 'Photo',
      uploadPhoto: 'Upload Photo',
      takePhoto: 'Take Photo',
      chooseFromGallery: 'Choose from Gallery',
      photoRequired: 'Photo is required',
      photoIdentityCaption: 'Please upload your photo or take a selfie to uniquely identify you, as names can be common. This helps us ensure you are a genuine worker.',
      retakePhoto: 'Retake Photo',
      cancel: 'Cancel',
    },
    currentLanguage: lang,
  }),
}));

describe('PhotoUpload Component', () => {
  const mockOnPhotoSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders upload placeholder when no photo is selected', () => {
    render(
      <PhotoUpload
        onPhotoSelected={mockOnPhotoSelected}
        language={Language.ENGLISH}
      />
    );

    expect(screen.getByText('Photo *')).toBeTruthy();
    expect(screen.getByText('Upload Photo')).toBeTruthy();
    expect(screen.getByText('Please upload your photo or take a selfie to uniquely identify you, as names can be common. This helps us ensure you are a genuine worker.')).toBeTruthy();
  });

  test('shows photo preview when photo is selected', () => {
    render(
      <PhotoUpload
        onPhotoSelected={mockOnPhotoSelected}
        language={Language.ENGLISH}
        selectedPhoto="mock-photo-uri"
      />
    );

    expect(screen.getByText('Retake Photo')).toBeTruthy();
  });

  test('shows error message when error is provided', () => {
    render(
      <PhotoUpload
        onPhotoSelected={mockOnPhotoSelected}
        language={Language.ENGLISH}
        error="Photo is required"
      />
    );

    expect(screen.getByText('Photo is required')).toBeTruthy();
  });

  test('opens modal when upload button is pressed', () => {
    render(
      <PhotoUpload
        onPhotoSelected={mockOnPhotoSelected}
        language={Language.ENGLISH}
      />
    );

    const uploadButton = screen.getByTestId('photo-upload-button');
    fireEvent.press(uploadButton);

    expect(screen.getByText('Take Photo')).toBeTruthy();
    expect(screen.getByText('Choose from Gallery')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
  });

  test('calls onPhotoSelected when photo is taken', async () => {
    const mockLaunchCamera = ImagePicker.launchCameraAsync as jest.Mock;
    mockLaunchCamera.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'new-photo-uri' }]
    });

    render(
      <PhotoUpload
        onPhotoSelected={mockOnPhotoSelected}
        language={Language.ENGLISH}
      />
    );

    const uploadButton = screen.getByTestId('photo-upload-button');
    fireEvent.press(uploadButton);

    const takePhotoButton = screen.getByTestId('take-photo-button');
    fireEvent.press(takePhotoButton);

    await waitFor(() => {
      expect(mockOnPhotoSelected).toHaveBeenCalledWith('new-photo-uri');
    });
  });

  test('calls onPhotoSelected when photo is selected from gallery', async () => {
    const mockLaunchImageLibrary = ImagePicker.launchImageLibraryAsync as jest.Mock;
    mockLaunchImageLibrary.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'gallery-photo-uri' }]
    });

    render(
      <PhotoUpload
        onPhotoSelected={mockOnPhotoSelected}
        language={Language.ENGLISH}
      />
    );

    const uploadButton = screen.getByTestId('photo-upload-button');
    fireEvent.press(uploadButton);

    const galleryButton = screen.getByTestId('choose-gallery-button');
    fireEvent.press(galleryButton);

    await waitFor(() => {
      expect(mockOnPhotoSelected).toHaveBeenCalledWith('gallery-photo-uri');
    });
  });

  test('closes modal when cancel is pressed', () => {
    render(
      <PhotoUpload
        onPhotoSelected={mockOnPhotoSelected}
        language={Language.ENGLISH}
      />
    );

    const uploadButton = screen.getByTestId('photo-upload-button');
    fireEvent.press(uploadButton);

    const cancelButton = screen.getByTestId('cancel-photo-button');
    fireEvent.press(cancelButton);

    // Modal should be closed, so these buttons should not be visible
    expect(screen.queryByText('Take Photo')).toBeNull();
    expect(screen.queryByText('Choose from Gallery')).toBeNull();
  });

  test('handles camera permission denial gracefully', async () => {
    const mockRequestCameraPermissions = ImagePicker.requestCameraPermissionsAsync as jest.Mock;
    mockRequestCameraPermissions.mockResolvedValue({ status: 'denied' });

    render(
      <PhotoUpload
        onPhotoSelected={mockOnPhotoSelected}
        language={Language.ENGLISH}
      />
    );

    const uploadButton = screen.getByTestId('photo-upload-button');
    fireEvent.press(uploadButton);

    const takePhotoButton = screen.getByTestId('take-photo-button');
    fireEvent.press(takePhotoButton);

    await waitFor(() => {
      expect(mockOnPhotoSelected).not.toHaveBeenCalled();
    });
  });

  test('has proper accessibility labels', () => {
    render(
      <PhotoUpload
        onPhotoSelected={mockOnPhotoSelected}
        language={Language.ENGLISH}
      />
    );

    expect(screen.getByLabelText('Upload Photo')).toBeTruthy();
  });

  test('shows retake accessibility label when photo is selected', () => {
    render(
      <PhotoUpload
        onPhotoSelected={mockOnPhotoSelected}
        language={Language.ENGLISH}
        selectedPhoto="mock-photo-uri"
      />
    );

    expect(screen.getByLabelText('Retake Photo')).toBeTruthy();
  });
}); 