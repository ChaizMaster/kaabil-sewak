import React from 'react';
import { render } from '@testing-library/react-native';
import { SignUpForm } from '../SignUpForm';
import { Language } from '@kaabil/shared';

describe('SignUpForm', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <SignUpForm
        onSignUp={() => {}}
        onSwitchToLogin={() => {}}
        language={Language.ENGLISH}
      />
    );
    expect(toJSON()).toMatchSnapshot();
  });
}); 