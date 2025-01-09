import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Decimal from 'decimal.js';
import { ExchangeState } from './types';
import { exchangeApi } from '../../../shared/api/exchange.api';

const initialState: ExchangeState = {
    fromAmount: '10000',  // Начальное значение = min
    toAmount: '0',
    isLoading: false,
    error: null,
    limits: {
        from: {
            min: 10000,     // 10k
            max: 70000000,  // 70M
            step: 100
        },
        to: {
            min: 0,
            max: 0,
            step: 0.000001
        }
    }
};

export const fetchCalcPair = createAsyncThunk(
    'exchange/fetchCalcPair',
    async (params: { amount: string; isFromLeft: boolean }, { rejectWithValue }) => {
        try {
            const amount = new Decimal(params.amount);
            return await exchangeApi.postCalcPair({
                pairId: 133,
                inAmount: params.isFromLeft ? amount.toNumber() : null,
                outAmount: params.isFromLeft ? null : amount.toNumber()
            });
        } catch {
            return rejectWithValue('Failed to calculate exchange');
        }
    }
);

export const exchangeSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCalcPair.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.lastRequestTime = Date.now();
            })
            .addCase(fetchCalcPair.fulfilled, (state, action) => {
                state.isLoading = false;
                const price = new Decimal(action.payload.price[0]);
                
                // Обновляем лимиты для правого инпута на основе курса
                state.limits.to.min = new Decimal(state.limits.from.min).mul(price).toNumber();
                state.limits.to.max = new Decimal(state.limits.from.max).mul(price).toNumber();

                // Обновляем значения в зависимости от направления
                if (action.meta.arg.isFromLeft) {
                    state.toAmount = new Decimal(action.payload.outAmount).toFixed(6);
                } else {
                    state.fromAmount = new Decimal(action.payload.inAmount).toFixed(2);
                }
            })
            .addCase(fetchCalcPair.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export default exchangeSlice.reducer;
