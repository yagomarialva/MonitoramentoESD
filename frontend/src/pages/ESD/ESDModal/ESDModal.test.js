// src/components/ESDModal/ESDModal.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../i18n';
import ESDModal from './ESDModal';

describe('ESDModal Component', () => {
  const bracelet = { id: 1, userId: '1', title: 'Station 1', completed: false };
  const handleClose = jest.fn();

  const renderComponent = (open) => {
    return render(
    //   <I18nextProvider i18n={i18n}>
        <ESDModal open={open} handleClose={handleClose} bracelet={bracelet} />
    //   </I18nextProvider>w
    );
  };

  it('renders the modal with bracelet data', () => {
    renderComponent(true);

    expect(screen.getByText('Station 1')).toBeInTheDocument();
  });

  it('calls handleClose when the close button is clicked', () => {
    renderComponent(true);

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

});
