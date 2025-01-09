import { ChangeEvent, FC } from 'react';
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
    step,
    className = '',
    loading
}) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        onChange(value);
    };

    return (
        <div className={`${styles.wrapper} ${className}`}>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                className={styles.input}
                placeholder="0.00"
                step={step}
                disabled={loading}
            />
            <span className={styles.currency}>{currency}</span>
        </div>
    );
};
