import { FC } from 'react';
import { ExchangeForm } from '../features/currency-exchange/ui/ExchangeForm/ExchangeForm';
import { ThemeToggle } from '../shared/ui/ThemeToggle/ThemeToggle';
import '../app/styles/themes.css';
import styles from './App.module.css';

export const App: FC = () => {
    return (
        <div className={styles.app}>
            <div className={styles.header}>
                <h1>Currency Exchange</h1>
                <ThemeToggle />
            </div>
            <ExchangeForm />
        </div>
    );
};
