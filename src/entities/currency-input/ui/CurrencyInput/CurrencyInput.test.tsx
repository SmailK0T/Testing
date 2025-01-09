import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CurrencyInput } from './CurrencyInput';

describe('CurrencyInput', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('renders correctly with default props', () => {
        render(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="USD"
            />
        );
        
        const input = screen.getByRole('spinbutton');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue(100);
        expect(input).toHaveAttribute('step', '0.01'); // проверяем дефолтный шаг
        expect(input).not.toBeDisabled(); // проверяем что по умолчанию не disabled
    });

    it('renders correctly with custom props', () => {
        render(
            <CurrencyInput
                value="100.50"
                onChange={mockOnChange}
                currency="EUR"
                step="0.1"
                loading={true}
            />
        );
        
        const input = screen.getByRole('spinbutton');
        expect(input).toHaveValue(100.50);
        expect(input).toHaveAttribute('step', '0.1');
        expect(input).toBeDisabled();
    });

    it('calls onChange with correct values', () => {
        render(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="USD"
                step="0.01"
            />
        );
        
        const input = screen.getByRole('spinbutton');
        
        // Проверяем ввод целого числа
        fireEvent.change(input, { target: { value: '200' } });
        expect(mockOnChange).toHaveBeenCalledWith('200');
        
        // Проверяем ввод десятичного числа
        fireEvent.change(input, { target: { value: '199.99' } });
        expect(mockOnChange).toHaveBeenCalledWith('199.99');
        
        // Проверяем пустое значение
        fireEvent.change(input, { target: { value: '' } });
        expect(mockOnChange).toHaveBeenCalledWith('');
    });

    it('handles empty input correctly', () => {
        render(
            <CurrencyInput
                value=""
                onChange={mockOnChange}
                currency="USD"
                step="0.01"
            />
        );
        
        const input = screen.getByRole('spinbutton');
        expect(input).toHaveValue(null);
        
        fireEvent.change(input, { target: { value: '50' } });
        expect(mockOnChange).toHaveBeenCalledWith('50');
    });

    it('displays currency in correct format', () => {
        const { rerender } = render(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="USD"
                step="0.01"
            />
        );
        
        expect(screen.getByText('USD')).toBeInTheDocument();
        
        // Проверяем другие валюты
        rerender(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="EUR"
                step="0.01"
            />
        );
        expect(screen.getByText('EUR')).toBeInTheDocument();
    });

    it('handles loading state transitions correctly', () => {
        const { rerender } = render(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="USD"
                step="0.01"
                loading={false}
            />
        );
        
        const input = screen.getByRole('spinbutton');
        expect(input).not.toBeDisabled();
        
        // Переключаем в состояние загрузки
        rerender(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="USD"
                step="0.01"
                loading={true}
            />
        );
        expect(input).toBeDisabled();
    });

    it('respects step attribute for number input', () => {
        render(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="USD"
                step="0.1"
            />
        );
        
        const input = screen.getByRole('spinbutton');
        expect(input).toHaveAttribute('step', '0.1');
        
        fireEvent.change(input, { target: { value: '100.1' } });
        expect(mockOnChange).toHaveBeenCalledWith('100.1');
    });

    it('handles different number formats correctly', () => {
        render(
            <CurrencyInput
                value="1000.50"
                onChange={mockOnChange}
                currency="USD"
                step="0.01"
            />
        );
        
        const input = screen.getByRole('spinbutton');
        
        // Проверяем большие числа
        fireEvent.change(input, { target: { value: '1000000.00' } });
        expect(mockOnChange).toHaveBeenCalledWith('1000000.00');
        
        // Проверяем отрицательные числа
        fireEvent.change(input, { target: { value: '-100.50' } });
        expect(mockOnChange).toHaveBeenCalledWith('-100.50');
    });

    it('maintains correct input type', () => {
        render(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="USD"
                step="0.01"
            />
        );
        
        const input = screen.getByRole('spinbutton');
        expect(input).toHaveAttribute('type', 'number');
    });

    it('handles invalid input correctly', () => {
        render(
            <CurrencyInput
                value="100"
                onChange={mockOnChange}
                currency="USD"
                step="0.01"
            />
        );
        
        const input = screen.getByRole('spinbutton');
        
        // Проверяем ввод букв (должны игнорироваться)
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(mockOnChange).toHaveBeenCalledWith('');
        
        // Проверяем ввод специальных символов
        fireEvent.change(input, { target: { value: '!@#' } });
        expect(mockOnChange).toHaveBeenCalledWith('');
    });
});
