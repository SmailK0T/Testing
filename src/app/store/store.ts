import { configureStore } from '@reduxjs/toolkit';
import exchangeReducer from '../../features/currency-exchange/model/exchangeSlice';

export const store = configureStore({
    reducer: {
        exchange: exchangeReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
