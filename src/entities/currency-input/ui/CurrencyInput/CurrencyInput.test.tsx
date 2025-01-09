import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CurrencyInput } from './CurrencyInput';

describe('CurrencyInput', () => {
    const mockOnChange = jest.fn();
    const user = userEvent.setup();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('renders correctly', () => {
        const { getByRole } = render(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="USD"
                step="0.01"
            />
        );
        
        const input = getByRole('spinbutton');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue(100);
    });

    it('calls onChange when value changes', async () => {
        const { getByRole } = render(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="USD"
                step="0.01"
            />
        );
        
        const input = getByRole('spinbutton');
        await user.type(input, '200');
        
        expect(mockOnChange).toHaveBeenCalled();
    });

    it('displays currency correctly', () => {
        const { getByText } = render(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="USD"
                step="0.01"
            />
        );
        
        expect(getByText('USD')).toBeInTheDocument();
    });

    it('handles loading state correctly', () => {
        const { getByRole } = render(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="USD"
                step="0.01"
                loading={true}
            />
        );
        
        const input = getByRole('spinbutton');
        expect(input).toBeDisabled();
    });
});
