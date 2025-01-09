import { configureStore } from '@reduxjs/toolkit';
import exchangeReducer, { fetchCalcPair } from './exchangeSlice';
import { exchangeApi } from '../../../shared/api/exchange.api';
import { CalcResponse } from '../../../shared/api/types';

// Мокаем API
jest.mock('../../../shared/api/exchange.api');
const mockedExchangeApi = exchangeApi as jest.Mocked<typeof exchangeApi>;

describe('exchangeSlice', () => {
    let store: ReturnType<typeof configureStore<{
        exchange: ReturnType<typeof exchangeReducer>
    }>>;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                exchange: exchangeReducer
            }
        });
    });

    it('should have correct initial state', () => {
        const state = store.getState().exchange;
        
        expect(state.inAmount).toBe('10000');
        expect(state.outAmount).toBe('0');
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.limits).toEqual({
            from: {
                min: 10000,
                max: 70000000,
                step: 100
            },
            to: {
                min: 0,
                max: 0,
                step: 0.000001
            }
        });
    });

    describe('fetchCalcPair', () => {
        const mockResponse: CalcResponse = {
            price: ['2.5', '0.4'],  // [прямая цена, обратная цена]
            inAmount: 10000,
            outAmount: 25000,
            isStraight: true
        };

        beforeEach(() => {
            mockedExchangeApi.postCalcPair.mockReset();
        });

        it('should handle successful calculation from left to right', async () => {
            mockedExchangeApi.postCalcPair.mockResolvedValueOnce(mockResponse);

            await store.dispatch(fetchCalcPair({ amount: '10000', isFromLeft: true }));
            const state = store.getState().exchange;

            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
            expect(state.inAmount).toBe('10000');
            expect(state.outAmount).toBe('25000');
            expect(state.limits.to.min).toBe(2500); // 1000 * 2.5
            expect(state.limits.to.max).toBe(175000000); // 70M * 2.5
        });

        it('should handle successful calculation from right to left', async () => {
            const rightToLeftResponse: CalcResponse = {
                ...mockResponse,
                inAmount: 4000,
                outAmount: 10000,
                isStraight: false
            };
            mockedExchangeApi.postCalcPair.mockResolvedValueOnce(rightToLeftResponse);

            await store.dispatch(fetchCalcPair({ amount: '10000', isFromLeft: false }));
            const state = store.getState().exchange;

            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
            expect(state.inAmount).toBe('4000');
            expect(state.outAmount).toBe('10000');
            expect(state.limits.to.min).toBe(2500);
            expect(state.limits.to.max).toBe(175000000);
        });

        it('should set loading state while fetching', () => {
            mockedExchangeApi.postCalcPair.mockImplementation(() => new Promise(() => {}));

            store.dispatch(fetchCalcPair({ amount: '10000', isFromLeft: true }));
            const state = store.getState().exchange;

            expect(state.isLoading).toBe(true);
            expect(state.error).toBeNull();
            expect(state.lastRequestTime).toBeDefined();
        });

        it('should handle API error', async () => {
            const errorMessage = 'Failed to calculate exchange';
            mockedExchangeApi.postCalcPair.mockRejectedValueOnce(new Error(errorMessage));

            await store.dispatch(fetchCalcPair({ amount: '10000', isFromLeft: true }));
            const state = store.getState().exchange;

            expect(state.isLoading).toBe(false);
            expect(state.error).toBe(errorMessage);
        });

        it('should call API with correct parameters for left to right', async () => {
            mockedExchangeApi.postCalcPair.mockResolvedValueOnce(mockResponse);

            await store.dispatch(fetchCalcPair({ amount: '20000', isFromLeft: true }));

            expect(mockedExchangeApi.postCalcPair).toHaveBeenCalledWith({
                pairId: 133,
                inAmount: '20000',
                outAmount: null
            });
        });

        it('should call API with correct parameters for right to left', async () => {
            mockedExchangeApi.postCalcPair.mockResolvedValueOnce(mockResponse);

            await store.dispatch(fetchCalcPair({ amount: '20000', isFromLeft: false }));

            expect(mockedExchangeApi.postCalcPair).toHaveBeenCalledWith({
                pairId: 133,
                inAmount: null,
                outAmount: 20000
            });
        });

        it('should handle decimal amounts correctly', async () => {
            const decimalResponse: CalcResponse = {
                price: ['2.5', '0.4'],
                inAmount: 10000.5,
                outAmount: 25001.25,
                isStraight: true
            };
            mockedExchangeApi.postCalcPair.mockResolvedValueOnce(decimalResponse);

            await store.dispatch(fetchCalcPair({ amount: '10000.5', isFromLeft: true }));
            const state = store.getState().exchange;

            expect(state.inAmount).toBe('10000.5');
            expect(state.outAmount).toBe('25001.25');
        });

        it('should update limits based on exchange rate', async () => {
            const customResponse: CalcResponse = {
                price: ['3.0', '0.333333'],
                inAmount: 10000,
                outAmount: 30000,
                isStraight: true
            };
            mockedExchangeApi.postCalcPair.mockResolvedValueOnce(customResponse);

            await store.dispatch(fetchCalcPair({ amount: '10000', isFromLeft: true }));
            const state = store.getState().exchange;

            expect(state.limits.to.min).toBe(3000);      // 1000 * 3.0
            expect(state.limits.to.max).toBe(210000000); // 70M * 3.0
        });
    });
});
