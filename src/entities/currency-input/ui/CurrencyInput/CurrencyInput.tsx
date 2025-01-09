import { FC, ChangeEvent } from 'react';
import styles from './CurrencyInput.module.css';

interface CurrencyInputProps {
    value: string;
    currency: string;
    onChange: (value: string) => void;
    step?: string;
    loading?: boolean;
}

export const CurrencyInput: FC<CurrencyInputProps> = ({
    value,
    currency,
    onChange,
    step = '0.01',
    loading = false
}) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputWrapper}>
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
        </div>
    );
};
