// src/components/ESDForm/ESDForm.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import ESDForm from './ESDForm';

describe('ESDForm Component', () => {
  const handleClose = jest.fn();
  const onSubmit = jest.fn();

  const renderComponent = (open) => {
    return render(
        <ESDForm open={open} handleClose={handleClose} onSubmit={onSubmit} />
    );
  };

  it('renders the form with fields and buttons', () => {
    renderComponent(true);
  });


  it('does not render the form when open is false', () => {
    renderComponent(false);
    expect(screen.queryByLabelText('User ID')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Completed')).not.toBeInTheDocument();
  });
});
