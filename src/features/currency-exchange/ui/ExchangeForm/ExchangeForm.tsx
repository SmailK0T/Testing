import { FC } from 'react';
import { CurrencyInput } from '../../../../entities/currency-input/ui/CurrencyInput/CurrencyInput';
import { PercentageButtons } from '../PercentageButtons/PercentageButtons';
import { useAppSelector } from '../../../../app/store/hooks';
import { useDebounceExchange } from '../../model/useDebounceExchange';
import styles from './ExchangeForm.module.css';

export const ExchangeForm: FC = () => {
    const { inAmount, outAmount, isLoading, limits } = useAppSelector(state => state.exchange);
    const {
        localInAmount,
        localOutAmount,
        setLocalInAmount,
        setLocalOutAmount
    } = useDebounceExchange({
        inAmount,
        outAmount
    });

    return (
        <div className={styles.container}>
            <div className={styles.inputBlock}>
                <CurrencyInput
                    value={localInAmount}
                    currency="RUB"
                    onChange={setLocalInAmount}
                    step={limits.from.step.toString()}
                    loading={isLoading}
                />
                <PercentageButtons
                    percentages={[25, 50, 75, 100]}
                    currentAmount={localInAmount}
                    maxAmount={limits.from.max}
                    onAmountChange={setLocalInAmount}
                />
            </div>

            <div className={styles.inputBlock}>
                <CurrencyInput
                    value={localOutAmount}
                    currency="USDT"
                    onChange={setLocalOutAmount}
                    step={limits.to.step.toString()}
                    loading={isLoading}
                />
                <PercentageButtons
                    percentages={[25, 50, 75, 100]}
                    currentAmount={localOutAmount}
                    maxAmount={limits.to.max}
                    onAmountChange={setLocalOutAmount}
                />
            </div>
        </div>
    );
};
