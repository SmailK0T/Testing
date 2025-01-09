import { useState, useCallback } from 'react';

interface UseExchangeCalculationsProps {
    initialFromAmount?: string;
    initialToAmount?: string;
    onExchangeChange?: (values: { from: string; to: string }) => void;
}

export const useExchangeCalculations = ({
    initialFromAmount = '10000',
    initialToAmount = '100',
    onExchangeChange
}: UseExchangeCalculationsProps = {}) => {
    const [fromAmount, setFromAmount] = useState(initialFromAmount);
    const [toAmount, setToAmount] = useState(initialToAmount);

    const handleFromAmountChange = useCallback((value: string) => {
        setFromAmount(value);
        onExchangeChange?.({ from: value, to: toAmount });
    }, [toAmount, onExchangeChange]);

    const handleToAmountChange = useCallback((value: string) => {
        setToAmount(value);
        onExchangeChange?.({ from: fromAmount, to: value });
    }, [fromAmount, onExchangeChange]);

    return {
        fromAmount,
        toAmount,
        onFromAmountChange: handleFromAmountChange,
        onToAmountChange: handleToAmountChange
    };
};
