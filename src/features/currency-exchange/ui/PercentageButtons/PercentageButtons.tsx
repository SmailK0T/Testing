import { FC } from 'react';
import styles from './PercentageButtons.module.css';

interface PercentageButtonsProps {
    percentages: number[];
    baseAmount: number;
    onAmountChange: (amount: string) => void;
}

export const PercentageButtons: FC<PercentageButtonsProps> = ({
    percentages,
    baseAmount,
    onAmountChange
}) => {
    return (
        <div className={styles.percentages}>
            {percentages.map((percent) => (
                <button 
                    key={percent}
                    className={styles.percentButton}
                    onClick={() => onAmountChange((baseAmount * percent / 100).toString())}
                >
                    {percent}%
                </button>
            ))}
        </div>
    );
};
