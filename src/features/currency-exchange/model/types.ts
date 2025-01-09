export interface ExchangeFormProps {
    fromCurrency?: string;
    toCurrency?: string;
    initialFromAmount?: string;
    initialToAmount?: string;
    onExchangeChange?: (values: { from: string; to: string }) => void;
    className?: string;
}

export interface ExchangeValues {
    from: string;
    to: string;
}
