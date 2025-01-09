import { FC, ChangeEvent } from 'react';
import styles from './CurrencyInput.module.css';

interface CurrencyInputProps {
    value: string;
    currency: string;
    onChange: (value: string) => void;
    step?: string;
    className?: string;
    loading?: boolean
}

export const CurrencyInput: FC<CurrencyInputProps> = ({
    value,
    currency,
    onChange,
    step = '0.01',
    className = '',
    loading = false
}) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        onChange(value);
    };

    return (
        <div className={`${styles.container} ${className}`}>
            <input
                type="number"
                value={value}
                onChange={handleChange}
                step={step}
                disabled={loading}
                className={styles.input}
            />
            <span className={styles.currency}>{currency}</span>
        </div>
    );
};
