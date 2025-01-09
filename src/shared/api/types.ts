export interface CalcRequest {
    pairId: number;
    inAmount: string | null;
    outAmount: number | null;
}

export interface CalcResponse {
    inAmount: number;
    outAmount: number;
    isStraight: boolean;
    price: [string, string]; // [прямая цена, обратная цена]
}
