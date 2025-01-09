import { FC } from 'react';
import styles from './PercentageButtons.module.css';
import Decimal from 'decimal.js';

interface PercentageButtonsProps {
    percentages: number[];
    currentAmount: string;
    maxAmount: number;
    onAmountChange: (amount: string) => void;
}

export const PercentageButtons: FC<PercentageButtonsProps> = ({
    percentages,
    currentAmount,
    maxAmount,
    onAmountChange
}) => {
    const getCurrentPercentage = () => {
        const current = new Decimal(currentAmount || '0');
        return current.dividedBy(maxAmount).times(100).toNumber();
    };

    const getButtonFillPercentage = (buttonPercent: number) => {
        const currentPercentage = getCurrentPercentage();
        const prevPercent = percentages[percentages.indexOf(buttonPercent) - 1] || 0;

        if (currentPercentage <= prevPercent) return 0;
        if (currentPercentage >= buttonPercent) return 100;

        const percentageInThisRange = currentPercentage - prevPercent;
        const rangeSize = buttonPercent - prevPercent;
        return (percentageInThisRange / rangeSize) * 100;
    };

    return (
        <div className={styles.percentages}>
            {percentages.map((percent) => {
                const fillPercent = getButtonFillPercentage(percent);
                return (
                    <button
                        key={percent}
                        className={styles.percentButton}
                        onClick={() => onAmountChange(percent === 100
                            ? maxAmount.toFixed(2)
                            : (maxAmount * percent / 100).toFixed(2))}
                        style={{ '--fill-percent': `${fillPercent}%` } as React.CSSProperties}
                    >
                        <span>{percent}%</span>
                    </button>
                );
            })}
        </div>
    );
};
