export interface ExchangeFormProps {
    initialFromAmount?: string;
    initialToAmount?: string;
    onExchangeChange?: (values: { from: string; to: string }) => void;
    className?: string;
}

interface Limits {
    min: number;
    max: number;
    step: number;
}

export interface ExchangeState {
    inAmount: string;
    outAmount: string;
    isLoading: boolean;
    error: string | null;
    lastRequestTime?: number;
    limits: {
        from: Limits;  // min=10k, max=70M, step=100
        to: Limits;    // step=0.000001, min/max из API
    };
}