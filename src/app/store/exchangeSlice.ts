import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExchangeState } from './types';

const initialState: ExchangeState = {
    fromAmount: '10000',
    toAmount: '100',
    fromCurrency: 'RUB',
    toCurrency: 'USDT',
    rate: 0.01
};

export const exchangeSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {
        setFromAmount: (state, action: PayloadAction<string>) => {
            state.fromAmount = action.payload;
            state.toAmount = (Number(action.payload) * state.rate).toString();
        },
        setToAmount: (state, action: PayloadAction<string>) => {
            state.toAmount = action.payload;
            state.fromAmount = (Number(action.payload) / state.rate).toString();
        },
        setFromCurrency: (state, action: PayloadAction<string>) => {
            state.fromCurrency = action.payload;
        },
        setToCurrency: (state, action: PayloadAction<string>) => {
            state.toCurrency = action.payload;
        },
        setRate: (state, action: PayloadAction<number>) => {
            state.rate = action.payload;
            state.toAmount = (Number(state.fromAmount) * action.payload).toString();
        }
    }
});

export const { 
    setFromAmount, 
    setToAmount, 
    setFromCurrency, 
    setToCurrency, 
    setRate 
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
