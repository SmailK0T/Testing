import { FC } from 'react';
import { CurrencyInput } from '../../../../entities/currency-input/ui/CurrencyInput/CurrencyInput';
import { PercentageButtons } from '../PercentageButtons/PercentageButtons';
import { useAppDispatch, useAppSelector } from '../../../../app/store/hooks';
import { fetchCalcPair } from '../../model/exchangeSlice';
import styles from './ExchangeForm.module.css';

export const ExchangeForm: FC = () => {
    const dispatch = useAppDispatch();
    const { fromAmount, toAmount } = useAppSelector(state => state.exchange);

    const handleFromAmountChange = (value: string) => {
        dispatch(fetchCalcPair({ 
            amount: value, 
            isFromLeft: true 
        }));
    };

    const handleToAmountChange = (value: string) => {
        dispatch(fetchCalcPair({ 
            amount: value, 
            isFromLeft: false 
        }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.inputBlock}>
                <CurrencyInput
                    value={fromAmount}
                    currency="RUB"
                    onChange={handleFromAmountChange}
                    step="100"
                />
                <PercentageButtons
                    percentages={[25, 50, 75, 100]}
                    baseAmount={10000}
                    onAmountChange={handleFromAmountChange}
                />
            </div>
            
            <div className={styles.inputBlock}>
                <CurrencyInput
                    value={toAmount}
                    currency="USDT"
                    onChange={handleToAmountChange}
                    step="0.01"
                />
                <PercentageButtons
                    percentages={[25, 50, 75, 100]}
                    baseAmount={100}
                    onAmountChange={handleToAmountChange}
                />
            </div>
        </div>
    );
};
