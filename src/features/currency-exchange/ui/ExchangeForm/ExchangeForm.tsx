import { FC, useState } from 'react';
import { CurrencyInput } from '../../../../entities/currency-input/ui/CurrencyInput/CurrencyInput';
import styles from './ExchangeForm.module.css';

export const ExchangeForm: FC = () => {
    const [fromAmount, setFromAmount] = useState('10000');
    const [toAmount, setToAmount] = useState('100');

    return (
        <div className={styles.container}>
            <div className={styles.inputBlock}>
                <CurrencyInput
                    value={fromAmount}
                    currency="RUB"
                    onChange={setFromAmount}
                />
                <div className={styles.percentages}>
                    {[25, 50, 75, 100].map((percent) => (
                        <button 
                            key={percent}
                            className={styles.percentButton}
                            onClick={() => setFromAmount((10000 * percent / 100).toString())}
                        >
                            {percent}%
                        </button>
                    ))}
                </div>
            </div>
            
            <div className={styles.inputBlock}>
                <CurrencyInput
                    value={toAmount}
                    currency="USDT"
                    onChange={setToAmount}
                />
                <div className={styles.percentages}>
                    {[25, 50, 75, 100].map((percent) => (
                        <button 
                            key={percent}
                            className={styles.percentButton}
                            onClick={() => setToAmount((100 * percent / 100).toString())}
                        >
                            {percent}%
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
