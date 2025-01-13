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
    step,
    loading = false
}) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputWrapper}>
                <div className={styles.inputContainer}>
                    <input
                        type="number"
                        value={value}
                        onChange={handleChange}
                        inputMode="decimal"
                        pattern="[0-9]*[.,]?[0-9]*"
                        step={step || "0.01"}
                        disabled={loading}
                        className={styles.input}
                    />
                    <div>
                        <span className={styles.currency}>{currency}</span>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};
