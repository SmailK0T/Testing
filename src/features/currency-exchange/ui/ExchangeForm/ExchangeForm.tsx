import { FC } from 'react';
import { CurrencyInput } from '../../../../entities/currency-input/ui/CurrencyInput/CurrencyInput';
import { PercentageButtons } from '../PercentageButtons/PercentageButtons';
import { useExchangeCalculations } from '../../model/useExchangeCalculations';
import { ExchangeFormProps } from '../../model/types';
import styles from './ExchangeForm.module.css';

export const ExchangeForm: FC<ExchangeFormProps> = ({
    fromCurrency = 'RUB',
    toCurrency = 'USDT',
    initialFromAmount,
    initialToAmount,
    onExchangeChange,
    className
}) => {
    const {
        fromAmount,
        toAmount,
        onFromAmountChange,
        onToAmountChange
    } = useExchangeCalculations({
        initialFromAmount,
        initialToAmount,
        onExchangeChange
    });

    return (
        <div className={`${styles.container} ${className || ''}`}>
            <div className={styles.inputBlock}>
                <CurrencyInput
                    value={fromAmount}
                    currency={fromCurrency}
                    onChange={onFromAmountChange}
                />
                <PercentageButtons
                    percentages={[25, 50, 75, 100]}
                    baseAmount={10000}
                    onAmountChange={onFromAmountChange}
                />
            </div>
            
            <div className={styles.inputBlock}>
                <CurrencyInput
                    value={toAmount}
                    currency={toCurrency}
                    onChange={onToAmountChange}
                />
                <PercentageButtons
                    percentages={[25, 50, 75, 100]}
                    baseAmount={100}
                    onAmountChange={onToAmountChange}
                />
            </div>
        </div>
    );
};
