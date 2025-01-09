import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { fetchCalcPair } from './exchangeSlice';
import Decimal from 'decimal.js';

interface UseDebounceExchangeProps {
    inAmount: string;
    outAmount: string;
    delay?: number;
}

const normalizeAmount = (value: string): string => {
    // Преобразуем строку в число и обратно в строку, чтобы убрать ведущие нули
    const num = Number(value);
    return isNaN(num) ? '0' : num.toString();
};

const roundToStep = (value: Decimal, step: number): string => {
    const remainder = value.modulo(step);
    if (remainder.equals(0)) {
        return value.toString();
    }
    
    // Округляем до ближайшего шага
    const quotient = value.dividedBy(step).floor();
    const lowerStep = quotient.times(step);
    const upperStep = quotient.plus(1).times(step);
    
    // Находим ближайшее значение
    const toLower = value.minus(lowerStep);
    const toUpper = upperStep.minus(value);
    
    // При равном расстоянии или если ближе к нижнему значению, округляем вниз
    return toLower.lessThanOrEqualTo(toUpper) ? lowerStep.toString() : upperStep.toString();
};

export const useDebounceExchange = ({ 
    inAmount: initialInAmount, 
    outAmount: initialOutAmount,
    delay = 1000 
}: UseDebounceExchangeProps) => {
    const dispatch = useAppDispatch();
    const { limits } = useAppSelector(state => state.exchange);
    
    const [localInAmount, setLocalInAmount] = useState(initialInAmount);
    const [localOutAmount, setLocalOutAmount] = useState(initialOutAmount);

    useEffect(() => {
        setLocalInAmount(initialInAmount);
    }, [initialInAmount]);

    useEffect(() => {
        setLocalOutAmount(initialOutAmount);
    }, [initialOutAmount]);

    // Обработка входящей суммы
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localInAmount !== initialInAmount) {
                const normalizedAmount = normalizeAmount(localInAmount);
                const amount = new Decimal(normalizedAmount);
                const minAmount = new Decimal(limits.from.min);
                const maxAmount = new Decimal(limits.from.max);
                const step = new Decimal(100); // Шаг для RUB

                let validAmount = normalizedAmount;
                let needsUpdate = false;

                // Проверка минимального значения
                if (amount.lessThan(minAmount)) {
                    validAmount = minAmount.toString();
                    needsUpdate = true;
                }
                // Проверка максимального значения
                else if (amount.greaterThan(maxAmount)) {
                    validAmount = maxAmount.toString();
                    needsUpdate = true;
                }
                // Проверка на кратность шагу
                else {
                    const roundedAmount = roundToStep(amount, step.toNumber());
                    if (roundedAmount !== amount.toString()) {
                        validAmount = roundedAmount;
                        needsUpdate = true;
                    }
                    // Проверка на ведущие нули
                    else if (normalizedAmount !== localInAmount) {
                        needsUpdate = true;
                    }
                }

                // Если нужно обновить значение в инпуте
                if (needsUpdate) {
                    setLocalInAmount(validAmount);
                }
                
                // Отправляем запрос только один раз
                dispatch(fetchCalcPair({ 
                    amount: validAmount, 
                    isFromLeft: true 
                }));
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [localInAmount, dispatch, initialInAmount, delay, limits.from.min, limits.from.max]);

    // Обработка исходящей суммы
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localOutAmount !== initialOutAmount) {
                const normalizedAmount = normalizeAmount(localOutAmount);
                const amount = new Decimal(normalizedAmount);
                const minAmount = new Decimal(limits.to.min);
                const maxAmount = new Decimal(limits.to.max);
                const step = new Decimal(0.000001); // Шаг для USDT

                let validAmount = normalizedAmount;
                let needsUpdate = false;

                // Проверка минимального значения
                if (amount.lessThan(minAmount)) {
                    validAmount = minAmount.toString();
                    needsUpdate = true;
                }
                // Проверка максимального значения
                else if (amount.greaterThan(maxAmount)) {
                    validAmount = maxAmount.toString();
                    needsUpdate = true;
                }
                // Проверка на кратность шагу
                else {
                    const roundedAmount = roundToStep(amount, step.toNumber());
                    if (roundedAmount !== amount.toString()) {
                        validAmount = roundedAmount;
                        needsUpdate = true;
                    }
                    // Проверка на ведущие нули
                    else if (normalizedAmount !== localOutAmount) {
                        needsUpdate = true;
                    }
                }

                // Если нужно обновить значение в инпуте
                if (needsUpdate) {
                    setLocalOutAmount(validAmount);
                }

                // Отправляем запрос только один раз
                dispatch(fetchCalcPair({ 
                    amount: validAmount, 
                    isFromLeft: false 
                }));
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [localOutAmount, dispatch, initialOutAmount, delay, limits.to.min, limits.to.max]);

    return {
        localInAmount,
        localOutAmount,
        setLocalInAmount,
        setLocalOutAmount
    };
};
